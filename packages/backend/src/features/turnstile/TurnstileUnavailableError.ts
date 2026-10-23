import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.SERVICE_UNAVAILABLE })
export class TurnstileUnavailableError extends Error {
  constructor(message = "Verification is temporarily unavailable. Please try again.") {
    super(message);
  }
}
