import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.PAYLOAD_TOO_LARGE })
export class ResumeImportFileTooLargeError extends Error {
  constructor() {
    super("The resume file is too large. The maximum size is 1 MB.");
  }
}