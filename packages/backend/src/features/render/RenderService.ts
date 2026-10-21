import { inject, injectable } from "@needle-di/core";
import type { RenderResumeRequest } from "@resume-optimzer-app/common";
import { serializeError } from "serialize-error";
import { LlmService } from "@/features/llm/LlmService";
import { Logger } from "@/lib/Logger";
import { RenderGenerationError } from "./error/RenderGenerationError";

@injectable()
export class RenderService {
  constructor(private readonly llm = inject(LlmService)) {}

  async render(input: RenderResumeRequest): Promise<string> {
    try {
      return await this.llm.renderResume(input);
    } catch (error) {
      logger.error("Resume render failed", { error: serializeError(error) });
      throw new RenderGenerationError();
    }
  }
}

const logger = Logger.for(RenderService);
