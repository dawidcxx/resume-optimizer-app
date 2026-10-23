import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.BAD_GATEWAY })
export class RenderGenerationError extends Error {
  constructor() {
    super("The resume could not be rendered. Please try again.");
  }
}