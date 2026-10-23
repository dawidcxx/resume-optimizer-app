import { InjectionToken } from "@needle-di/core";
import type {
  ImportedResume,
  RenderRole,
  RenderUsage,
  RenderResumeRequest,
  ResumeAnnotations,
} from "@resume-optimzer-app/common";

export interface ImportResumeInput {
  text: string;
}

export interface RenderChatPromptMessage {
  role: RenderRole;
  content: string;
  markup: string | null;
}

export interface ReviseResumeInput {
  resume: ImportedResume;
  annotations: ResumeAnnotations;
  aiInstructions: string;
  targetJobDescription: string;
  initialMarkup: string;
  messages: RenderChatPromptMessage[];
}

export interface RenderResumeResult {
  reply: string | null;
  markup: string;
  usage: RenderUsage;
}

export interface LlmService {
  importResume(input: ImportResumeInput): Promise<ImportedResume>;
  renderResume(input: RenderResumeRequest): Promise<RenderResumeResult>;
  reviseResume(input: ReviseResumeInput): Promise<RenderResumeResult>;
}

export const LlmService = new InjectionToken<LlmService>("LlmService");
