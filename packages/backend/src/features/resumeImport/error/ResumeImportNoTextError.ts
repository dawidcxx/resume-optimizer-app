import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.UNPROCESSABLE_ENTITY })
export class ResumeImportNoTextError extends Error {
  constructor() {
    super("No readable text was found in that resume.");
  }
}
