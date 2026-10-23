import { inject, injectable } from "@needle-di/core";
import { RESUME_IMPORT_MAX_BYTES, resumeImportContract } from "@resume-optimzer-app/common";
import { Hono } from "hono";
import { ResumeImportFileTooLargeError } from "./error/ResumeImportFileTooLargeError";
import { ResumeImportNoTextError } from "./error/ResumeImportNoTextError";
import { ResumeImportService } from "./ResumeImportService";

@injectable()
export class ResumeImportApi {
  constructor(private readonly service = inject(ResumeImportService)) {}

  build(): Hono {
    const api = new Hono();

    api.post(resumeImportContract.importResume.path, async (c) => {
      const content = new Uint8Array(await c.req.arrayBuffer());
      if (content.byteLength === 0) {
        throw new ResumeImportNoTextError();
      }
      if (content.byteLength > RESUME_IMPORT_MAX_BYTES) {
        throw new ResumeImportFileTooLargeError();
      }

      const encodedFilename = c.req.header("x-file-name");
      const filename = encodedFilename ? decodeURIComponent(encodedFilename) : "resume.txt";
      const mimeType = (c.req.header("content-type") ?? "application/octet-stream")
        .split(";")[0]!
        .trim();

      const resume = await this.service.importResume({ content, filename, mimeType });
      return c.json({ resume });
    });

    return api;
  }
}