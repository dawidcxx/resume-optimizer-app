import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.NOT_FOUND })
export class RenderNotFoundError extends Error {
  constructor() {
    super("The render chat could not be found.");
  }
}