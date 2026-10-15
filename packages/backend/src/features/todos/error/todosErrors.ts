import { HttpStatusCodes, Uuid } from "@resume-optimzer-app/common";
import { HttpError } from "@/lib/HttpErrorMetadata";

@HttpError({ status: HttpStatusCodes.NOT_FOUND })
export class TodoNotFoundError extends Error {
  constructor(
    private readonly params: {
      id: Uuid;
    },
  ) {
    super(`Todo with id '${params.id}' not found`);
  }
}