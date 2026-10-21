import { createDeepSeek, type DeepSeekProvider } from "@ai-sdk/deepseek";
import { valibotSchema } from "@ai-sdk/valibot";
import { inject, injectable } from "@needle-di/core";
import {
  ImportedResumeSchema,
  toImportedResume,
  type ImportedResume,
} from "@resume-optimzer-app/common";
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
- Include responsibilities, achievements, and technologies listed under a role in that experience entry's company.description.
- Project icon may be github or linkedin only when the project URL matches; otherwise use null.
- aboutMe should use an explicit summary or objective section. Otherwise use an empty string.`;
