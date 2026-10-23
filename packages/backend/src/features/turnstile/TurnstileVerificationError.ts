import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.FORBIDDEN })
export class TurnstileVerificationError extends Error {
  constructor(message = "We couldn't verify this browser. Please try again.") {
    super(message);
  }
}
