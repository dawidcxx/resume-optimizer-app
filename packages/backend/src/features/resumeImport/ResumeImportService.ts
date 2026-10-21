import { addDays } from "date-fns";
import { inject, injectable } from "@needle-di/core";
import type { ImportedResume } from "@resume-optimzer-app/common";
import { serializeError } from "serialize-error";
import { FileService } from "@/features/files";
import { LlmService } from "@/features/llm/LlmService";
import { Logger } from "@/lib/Logger";
import { ResumeImportAnalysisError } from "./error/ResumeImportAnalysisError";
import { ResumeImportNoTextError } from "./error/ResumeImportNoTextError";
import { ResumeImportUnsupportedFileError } from "./error/ResumeImportUnsupportedFileError";
import { extractResumeText } from "./extractResumeText";

export interface ResumeImportFile {
  content: Uint8Array;
  filename: string;
  mimeType: string;
}

@injectable()
export class ResumeImportService {
  constructor(
    private readonly files = inject(FileService),
    private readonly llm = inject(LlmService),
  ) {}

  async importResume(file: ResumeImportFile): Promise<ImportedResume> {
    const uploaded = await this.files.uploadFile({
      content: file.content,
      filename: file.filename,
      mimeType: file.mimeType,
      expiresAt: addDays(new Date(), 1),
    });

    try {
      const text = await this.extractText(file);
      if (!text.trim()) {
        throw new ResumeImportNoTextError();
      }

      try {
        return await this.llm.importResume({ text });
      } catch (error) {
        logger.error("Resume analysis failed", { error: serializeError(error) });
        throw new ResumeImportAnalysisError();
      }
    } finally {
      try {
        await this.files.deleteFile(uploaded.id);
      } catch (error) {
        logger.error("Failed to delete imported resume file", {
          error: serializeError(error),
        });
      }
    }
  }

  private async extractText(file: ResumeImportFile): Promise<string> {
    try {
      return await extractResumeText(file.content, file.mimeType, file.filename);
    } catch (error) {
      if (error instanceof ResumeImportUnsupportedFileError) {
        throw error;
      }
      logger.error("Failed to extract resume text", { error: serializeError(error) });
      throw new ResumeImportNoTextError();
    }
  }
}

const logger = Logger.for(ResumeImportService);
