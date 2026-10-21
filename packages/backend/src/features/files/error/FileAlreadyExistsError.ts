import { HttpStatusCodes } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.CONFLICT })
export class FileAlreadyExistsError extends Error {
  constructor() {
    super("File already exists");
  }
}
