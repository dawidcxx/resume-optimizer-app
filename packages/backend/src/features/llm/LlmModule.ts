import { defineProviders } from "@needle-di/core";
import { DeepseekLlmService } from "./DeepseekLlmService";
import { LlmService } from "./LlmService";

export const llmModule = defineProviders({
  provide: LlmService,
  useClass: DeepseekLlmService,
});
