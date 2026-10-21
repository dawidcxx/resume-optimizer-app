import { createDeepSeek, type DeepSeekProvider } from "@ai-sdk/deepseek";
import { valibotSchema } from "@ai-sdk/valibot";
import { inject, injectable } from "@needle-di/core";
import {
  RESUME_COMPONENT_SPEC,
  ImportedResumeSchema,
  toImportedResume,
  type ImportedResume,
  type RenderResumeRequest,
  type ResumeComponentName,
  type ResumeComponentSpec,
} from "@resume-optimzer-app/common";
import { toJsonSchema } from "@valibot/to-json-schema";
import { generateText, Output } from "ai";
import { Config } from "@/shared/Config";
import type { ImportResumeInput, LlmService as LlmServiceContract } from "./LlmService";

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

  async renderResume(input: RenderResumeRequest): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      system: RENDER_RESUME_SYSTEM_PROMPT,
      prompt: buildRenderPrompt(input),
      temperature: 0.7,
      maxOutputTokens: 8192,
      providerOptions: {
        deepseek: { thinking: { type: "disabled" } },
      },
    });
    return normalizeMarkup(text);
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

const RENDER_RESUME_SYSTEM_PROMPT = `You design a resume as MDX-lite markup using only the components below.

Output only the markup. Do not wrap it in code fences and do not add explanations.

Rules:
- Use only facts from the resume data. Never invent experience, dates, skills, education, projects, links, or contact details.
- Do not add personality traits, interests, or claims that are not present in the resume data.
- You may reorder, summarize, rephrase, and re-emphasize existing facts to match the target job description and AI instructions, but preserve their meaning.
- Do not include the target job description in the resume.
- Start with one <Resume> root and put all content inside it.
- Markdown is supported inside component children: headings, paragraphs, bold, italic, links, lists, and tables.
- Write bullet lists directly as markdown (one "- item" per line) inside Entry, Section, or Column. Reserve BulletList for a standalone list.
- In experience entries, use role as the job title and company.name as the employer. Render bulletPoints as the role bullets; keep company.description as separate company context.
- Put a blank line before a component tag when it follows paragraph text.
- Use Column inside Columns when a column contains more than one block. Keep one child per column otherwise.
- Use only the components listed below. Unknown components, unknown props, raw HTML, JSX expressions, imports, event handlers, style, className, and script tags are rejected.
- All props are strings. Colors must be 6-digit hex values.
- Make the theme reflect the AI instructions while keeping text readable against the background.
- Default to a clean, conventional resume. Build most of it from the core components: Resume, Header, Section, Columns, Column, Entry, Text, TagList, and Tag. Use plain markdown paragraphs and bullet lists inside them.
- Treat Callout, Stars, ProgressBar, Stats, Stat, Fact, DataTable, Timeline, TimelineItem, BulletList, Divider, and Spacer as optional accents. Prefer the core components, and use an optional accent only when it genuinely improves clarity or the AI instructions call for that kind of visual treatment. A clean, conventional resume is the default.
- Use the target job description to decide what to emphasize, not as a request for optional visual components.
- If you use an optional accent, keep it purposeful and small. Stars, progress bars, tables, stats, and timelines take space and should not become the default layout.
- If you use Stars, it accepts half values such as value="3.5"; add format="stars-value" when the numeric score should be visible.
- If you use Stats or Fact, keep them compact. Use DataTable only for a small, explicitly requested matrix.
- Keep the result suitable for one page.
- If AI instructions or the target job description are empty, use a clean, professional default and avoid optional accents.

Available components:

${buildComponentSpecPrompt()}`;

function buildRenderPrompt(input: RenderResumeRequest): string {
  return [
    "Resume data:",
    JSON.stringify(input.resume, null, 2),
    "",
    "AI instructions:",
    input.aiInstructions.trim() || "(none)",
    "",
    "Target job description:",
    input.targetJobDescription.trim() || "(none)",
  ].join("\n");
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
