import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.BAD_REQUEST })
export class RenderInvalidRequestError extends Error {
  constructor(message = "The render request is invalid.") {
    super(message);
  }
}
