import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.BAD_GATEWAY })
export class ResumeImportAnalysisError extends Error {
  constructor() {
    super("The resume could not be analyzed. Please try again.");
  }
}