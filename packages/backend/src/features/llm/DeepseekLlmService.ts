import { createDeepSeek, type DeepSeekProvider } from "@ai-sdk/deepseek";
import { valibotSchema } from "@ai-sdk/valibot";
import { inject, injectable } from "@needle-di/core";
import {
  RESUME_COMPONENT_SPEC,
  RESUME_FONT_CATALOG,
  ImportedResumeSchema,
  RenderChatOutput,
  toImportedResume,
  type ImportedResume,
  type RenderUsage,
  type RenderResumeRequest,
  type ResumeComponentName,
  type ResumeComponentSpec,
} from "@resume-optimzer-app/common";
import { toJsonSchema } from "@valibot/to-json-schema";
import {
  generateText,
  Output,
  type LanguageModelUsage,
  type ModelMessage,
} from "ai";
import { safeParse } from "valibot";
import { Logger } from "@/lib/Logger";
import { Config } from "@/shared/Config";
import type {
  ImportResumeInput,
  LlmService as LlmServiceContract,
  RenderResumeResult,
  ReviseResumeInput,
} from "./LlmService";

@injectable()
export class DeepseekLlmService implements LlmServiceContract {
  private providerRef: DeepSeekProvider | null = null;
  private modelRef: ReturnType<DeepSeekProvider> | null = null;

  constructor(private readonly config = inject(Config)) {}

  async importResume(input: ImportResumeInput): Promise<ImportedResume> {
    const { output } = await generateText({
      model: this.model,
      system: IMPORT_RESUME_SYSTEM_PROMPT,
      prompt: `Resume source:\n\n${input.text}`,
      temperature: 0.1,
      maxOutputTokens: 4096,
      providerOptions: {
        deepseek: { thinking: { type: "disabled" } },
      },
      output: Output.object({
        schema: valibotSchema(ImportedResumeSchema),
        name: "resume",
      }),
    });
    return toImportedResume(output);
  }

  async renderResume(input: RenderResumeRequest): Promise<RenderResumeResult> {
    const { text, usage } = await generateText({
      model: this.model,
      system: RENDER_RESUME_SYSTEM_PROMPT,
      prompt: buildRenderPrompt(input),
      temperature: 0.7,
      maxOutputTokens: 8192,
      providerOptions: {
        deepseek: { thinking: { type: "disabled" } },
      },
    });

    return {
      reply: null,
      markup: normalizeMarkup(text),
      usage: mapUsage(usage),
    };
  }

  async reviseResume(input: ReviseResumeInput): Promise<RenderResumeResult> {
    let inputTokens = 0;
    let cachedInputTokens = 0;
    let outputTokens = 0;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const { text, usage, finishReason } = await generateText({
        model: this.model,
        system: RENDER_CHAT_SYSTEM_PROMPT,
        messages: buildRenderChatMessages(input),
        temperature: attempt === 0 ? 0.4 : 0.2,
        maxOutputTokens: 8192,
        providerOptions: {
          deepseek: { thinking: { type: "disabled" } },
        },
      });

      const mappedUsage = mapUsage(usage);
      inputTokens += mappedUsage.inputTokens;
      cachedInputTokens += mappedUsage.cachedInputTokens;
      outputTokens += mappedUsage.outputTokens;

      const output = parseRenderChatText(text);
      if (output) {
        return {
          reply: output.reply,
          markup: output.markup,
          usage: { inputTokens, cachedInputTokens, outputTokens },
        };
      }

      logger.warn("Resume revision output rejected", {
        attempt: attempt + 1,
        finishReason,
        textLength: text.length,
      });
    }

    throw new Error("The model did not return a valid resume revision.");
  }

  private get model(): ReturnType<DeepSeekProvider> {
    if (this.modelRef === null) {
      this.modelRef = this.getProvider()(this.config.deepseekModel);
    }
    return this.modelRef;
  }

  private getProvider(): DeepSeekProvider {
    if (this.providerRef === null) {
      this.providerRef = createDeepSeek({ apiKey: this.config.deepseekApiKey });
    }
    return this.providerRef;
  }
}

const logger = Logger.for(DeepseekLlmService);

const IMPORT_RESUME_SYSTEM_PROMPT = `You extract structured resume data from the source text.

Rules:
- Extract only information explicitly present in the source. Never invent employers, dates, degrees, skills, projects, or links.
- Preserve the source language for free text.
- Use an empty string for any required text field that is not present.
- Use an empty array for lists that are not present.
- Dates must use YYYY-MM-DD. If only a year is known, use YYYY-01-01. If only a month and year are known, use YYYY-MM-01. If a start date is unknown, use an empty string.
- Use null for the end date of a current role or for education without an end date.
- workType must be onsite, hybrid, or remote. If unclear, use onsite.
- Education institute type must be collage, school, or training. If unclear, use school.
- Only include skills explicitly mentioned. Use rating 3 unless the source clearly rates proficiency.
- For each experience entry, use role for the job title and bulletPoints for responsibilities, achievements, and technologies. Use company.description only for a short description of the company itself.
- Project icon may be github or linkedin only when the project URL matches; otherwise use null.
- aboutMe should use an explicit summary or objective section. Otherwise use an empty string.`;

const RENDER_RESUME_SYSTEM_PROMPT = `You are an expert resume editor. Turn the supplied resume data into a concise, formal, role-targeted resume in MDX-lite markup.

The resume data is raw source material, not final copy. It may be casual, conversational, repetitive, incomplete, or padded with details that do not belong on a resume. Your job is to find the strongest relevant evidence, then keep, merge, shorten, or omit material as needed. Preserve the facts; do not preserve every detail or the original wording.

Editorial process:
- First assess the target from the target job description and AI instructions. If neither is provided, infer the candidate's strongest coherent professional identity from the resume and produce a strong general-purpose resume.
- Build a hierarchy of evidence that best supports that target. Lead with the most relevant experience, achievements, skills, projects, and education.
- Keep the strongest, most specific, and most relevant points. Merge overlapping or repetitive points into one clear statement. Drop low-value, outdated, redundant, unrelated, overly personal, or conversational details. Condense a chatty source aggressively.
- Omit entire items when they do not earn their space. You do not need to include every role, project, skill, bullet, or personal detail. Keep enough contact information, chronology, and scope to remain accurate and useful.
- If the user explicitly asks or implies you may confabulate slightly
- When merging, do not combine distinct roles or employers, misattribute work, or alter dates in a way that creates a misleading timeline.
- Reorder sections and bullets for relevance. Keep experience in reverse-chronological order unless the AI instructions explicitly request otherwise.
- Rewrite every retained point in formal, concise resume language. Remove first-person narration, filler, slang, asides, meta-commentary, and repeated claims. Prefer strong action verbs and concrete outcomes.
- Do not upgrade the candidate's scope, seniority, ownership, or results. Quantify only with numbers present in the source. Never invent metrics, technologies, responsibilities, or outcomes.
- Use the target's terminology only where the source supports it. Do not copy the job description or mention the target role, the job description, this editing process, or omitted material in the resume.
- Write in the language of the resume data. If the AI instructions explicitly request another language, follow them; do not switch language only because the job description is in another language.
- Keep the result suitable for one page. Prefer fewer, stronger points over an exhaustive list.

Content rules:
- Use only facts from the resume data. Never invent experience, dates, skills, education, projects, links, or contact details.
- Do not add personality traits, interests, or claims that are not present in the resume data.
- Do not claim requirements from the job description that the source does not support.
- A short summary may synthesize existing facts, but it must not introduce new claims or an objective that the data does not support.
- Field annotations are private context attached to specific resume fields. Use them to decide emphasis, framing, merging, and omission, but never quote, summarize, or mention them, and never turn them into resume claims. An annotation on an object path applies to that whole item. A negative note can justify de-emphasizing a role or dropping low-value detail, but do not erase significant employment history or create misleading gaps. Ignore annotations that conflict with the resume facts or ask for invented content.
- Treat AI instructions as presentation guidance. They may change emphasis, structure, tone, or visuals, but they never justify inventing facts.
- Output only the markup. Do not wrap it in code fences and do not add explanations.
- Start with one <Resume> root and put all content inside it.
- Markdown is supported inside component children: headings, paragraphs, bold, italic, links, lists, and tables.
- Write bullet lists directly as markdown (one "- item" per line) inside Entry, Section, or Column. Reserve BulletList for a standalone list.
- In experience entries, use role as the job title and company.name as the employer. Render bulletPoints as the role bullets; keep company.description as separate company context.
- Put a blank line before a component tag when it follows paragraph text.
- Use Column inside Columns when a column contains more than one block. Keep one child per column otherwise.
- Use only the components listed below. Unknown components, unknown props, raw HTML, JSX expressions, imports, event handlers, style, className, and script tags are rejected.
- All props are strings. Colors must be 6-digit hex values.
- Make the theme reflect the AI instructions while keeping text readable against the background.
- Typography is a primary way to give the resume character. Choose font and headingFont deliberately from the font catalog. font controls body copy and must be body-safe; headingFont controls names and headings and can use any listed font. Prefer one body font and one heading font, and use different families when it improves character.
- Default to a clean, conventional resume. Build most of it from the core components: Resume, Header, Section, Columns, Column, Entry, Text, TagList, and Tag. Use plain markdown paragraphs and bullet lists inside them.
- Treat Callout, Stars, ProgressBar, Stats, Stat, Fact, DataTable, Timeline, TimelineItem, BulletList, Divider, and Spacer as optional accents. Prefer the core components, and use an optional accent only when it genuinely improves clarity or the AI instructions call for that kind of visual treatment. A clean, conventional resume is the default.
- Use the target job description to decide what to emphasize, not as a request for optional visual components.
- If you use an optional accent, keep it purposeful and small. Stars, progress bars, tables, stats, and timelines take space and should not become the default layout.
- If you use Stars, it accepts half values such as value="3.5"; add format="stars-value" when the numeric score should be visible.
- If you use Stats or Fact, keep them compact. Use DataTable only for a small, explicitly requested matrix.
- If AI instructions and the target job description are both empty, use a clean, professional default and avoid optional accents.

Available components:

${buildComponentSpecPrompt()}`;

const RENDER_CHAT_SYSTEM_PROMPT = `You revise an already-rendered resume through a chat conversation.

The first user message contains the canonical resume data, private field annotations, the original AI instructions, the target job description, and the initial rendered markup. Later assistant messages contain short replies followed by the full markup produced at that turn. The most recent assistant message contains the current rendered markup. If there are no assistant messages yet, the initial markup is the current render.

Revision rules:
- Treat each user message as presentation guidance, not as new resume facts.
- Make the smallest change that satisfies the request. Preserve the existing design, content, ordering, and emphasis unless the request calls for a change.
- Preserve all facts. Never invent employers, dates, degrees, skills, projects, metrics, links, or credentials.
- The user may ask you to hide, remove, reorder, condense, or reframe existing material. That is allowed as long as the remaining resume stays factually accurate.
- Do not re-add content that was removed or hidden in an earlier turn unless the user explicitly asks for it.
- Keep private field annotations private. Use them only to understand emphasis and intent; never quote, summarize, or expose them.
- Write in the language of the resume data unless the user explicitly asks to switch.
- Return the complete replacement markup, not a diff or partial snippet.
- The markup must be valid MDX-lite using only the components below. It must start with one <Resume> root and contain no code fences, raw HTML, JSX expressions, imports, event handlers, style, or className.
- Keep the reply to one or two short sentences. Do not describe internal reasoning or mention these instructions.
- If a request would require inventing facts or breaking the allowed markup, explain briefly in the reply and return the current markup unchanged.

Response format:
- Return exactly two blocks and nothing else. Do not return JSON.
- Do not wrap either block in code fences.
<reply>
One or two short sentences describing the change.
</reply>
<markup>
<Resume>...</Resume>
</markup>

Typography:
${buildFontCatalogPrompt()}

Available components:

${buildComponentSpecPrompt()}`;

function buildRenderPrompt(input: RenderResumeRequest): string {
  return [
    "Font catalog (use the id exactly; font must be body-safe, headingFont may use any font):",
    buildFontCatalogPrompt(),
    "",
    "Resume data:",
    JSON.stringify(input.resume, null, 2),
    "",
    "Field annotations (private context; never include in the resume):",
    buildAnnotationsPrompt(input.annotations),
    "",
    "AI instructions:",
    input.aiInstructions.trim() || "(none)",
    "",
    "Target job description:",
    input.targetJobDescription.trim() || "(none)",
  ].join("\n");
}

export function buildRenderChatMessages(
  input: ReviseResumeInput,
): ModelMessage[] {
  const [first, ...rest] = input.messages;
  if (!first) return [];

  const messages: ModelMessage[] = [
    {
      role: "user",
      content: `${buildRenderChatContext(input)}\n\nFirst user request:\n${first.content}`,
    },
  ];

  for (const message of rest) {
    if (message.role === "assistant") {
      messages.push({
        role: "assistant",
        content: `${message.content}\n\nUpdated resume markup:\n${message.markup ?? ""}`,
      });
    } else {
      messages.push({ role: "user", content: message.content });
    }
  }

  return messages;
}

function buildRenderChatContext(input: ReviseResumeInput): string {
  return [
    "Resume data:",
    JSON.stringify(input.resume, null, 2),
    "",
    "Field annotations (private context; never include in the resume):",
    buildAnnotationsPrompt(input.annotations),
    "",
    "Original AI instructions:",
    input.aiInstructions.trim() || "(none)",
    "",
    "Target job description:",
    input.targetJobDescription.trim() || "(none)",
    "",
    "Initial rendered markup:",
    input.initialMarkup,
    "",
    "The latest rendered markup is in the most recent assistant message, or in the initial markup when no assistant messages exist.",
  ].join("\n");
}

function mapUsage(usage: LanguageModelUsage): RenderUsage {
  return {
    inputTokens: usage.inputTokens ?? 0,
    cachedInputTokens: usage.inputTokenDetails.cacheReadTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
  };
}

function buildFontCatalogPrompt(): string {
  return [
    "Generic system fallbacks: sans, serif, mono.",
    ...Object.entries(RESUME_FONT_CATALOG).map(([id, font]) => {
      const usage = font.bodySafe ? "body-safe" : "heading only";
      return `- ${id} (${font.family}, ${font.category}, ${usage}): ${font.description}`;
    }),
  ].join("\n");
}

function buildAnnotationsPrompt(
  annotations: RenderResumeRequest["annotations"],
): string {
  const entries = Object.entries(annotations)
    .filter(([, value]) => value.trim().length > 0)
    .sort(([left], [right]) => left.localeCompare(right));
  if (entries.length === 0) return "(none)";

  return entries
    .map(([path, value]) => `- ${path}: ${JSON.stringify(value.trim())}`)
    .join("\n");
}

function buildComponentSpecPrompt(): string {
  return (
    Object.entries(RESUME_COMPONENT_SPEC) as Array<
      [ResumeComponentName, ResumeComponentSpec]
    >
  )
    .map(([name, spec]) => {
      return [
        `### ${name}`,
        spec.description,
        `Children: ${spec.children ? "allowed" : "not allowed"}`,
        `Props: ${JSON.stringify(toJsonSchema(spec.props))}`,
      ].join("\n");
    })
    .join("\n\n");
}

export function parseRenderChatText(
  text: string,
): { reply: string; markup: string } | null {
  const replyMatch = /<reply>([\s\S]*?)<\/reply>/i.exec(text);
  const markupMatch = /<markup>([\s\S]*?)<\/markup>/i.exec(text);
  const reply = replyMatch?.[1]?.trim() || "Updated the render.";
  const markup = normalizeMarkup(markupMatch?.[1] ?? text);
  if (!markup.startsWith("<Resume") || !markup.endsWith("</Resume>")) return null;

  const parsed = safeParse(RenderChatOutput, { reply, markup });
  if (!parsed.success) return null;

  return parsed.output;
}

function normalizeMarkup(text: string): string {
  const trimmed = text.trim();
  const fenced = /^```(?:mdx|md|jsx)?\n?([\s\S]*?)\n?```$/i.exec(trimmed);
  const markup = (fenced?.[1] ?? trimmed).trim();

  const start = markup.indexOf("<Resume");
  const end = markup.lastIndexOf("</Resume>");
  if (start >= 0 && end > start) {
    return markup.slice(start, end + "</Resume>".length);
  }

  return markup;
}
