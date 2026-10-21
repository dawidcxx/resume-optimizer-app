import { InjectionToken } from "@needle-di/core";
import type {
  ImportedResume,
  RenderDocument,
  RenderResumeRequest,
} from "@resume-optimzer-app/common";

export interface ImportResumeInput {
  text: string;
}

export interface LlmService {
  importResume(input: ImportResumeInput): Promise<ImportedResume>;
  renderResume(input: RenderResumeRequest): Promise<RenderDocument>;
}

export const LlmService = new InjectionToken<LlmService>("LlmService");
