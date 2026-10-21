import { InjectionToken } from "@needle-di/core";

export interface LlmService {
  importResume(): Promise<void>;
}

export const LlmService = new InjectionToken<LlmService>("LlmService");
