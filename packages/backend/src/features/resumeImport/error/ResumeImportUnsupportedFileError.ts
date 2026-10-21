import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.UNSUPPORTED_MEDIA_TYPE })
export class ResumeImportUnsupportedFileError extends Error {
  constructor() {
    super("Unsupported file type. Upload a PDF, DOCX, or text resume.");
  }
}
