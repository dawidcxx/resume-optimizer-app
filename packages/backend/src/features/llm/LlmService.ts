import { InjectionToken } from "@needle-di/core";
import type { ImportedResume } from "@resume-optimzer-app/common";

export interface ImportResumeInput {
  text: string;
}

export interface LlmService {
  importResume(input: ImportResumeInput): Promise<ImportedResume>;
}

export const LlmService = new InjectionToken<LlmService>("LlmService");
