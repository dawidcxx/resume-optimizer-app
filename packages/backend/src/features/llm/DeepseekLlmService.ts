import { inject, injectable } from "@needle-di/core";
import { Config } from "@/shared/Config";
import type { LlmService as LlmServiceContract } from "./LlmService";

@injectable()
export class DeepseekLlmService implements LlmServiceContract {
  constructor(private readonly config = inject(Config)) {}

  async importResume(): Promise<void> {
    throw new Error("DeepseekLlmService.importResume is not implemented yet");
  }
}
