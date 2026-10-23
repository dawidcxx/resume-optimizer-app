import {
  resumeImportContract,
  toImportedResume,
  type ImportedResume,
} from "@resume-optimzer-app/common";
import { parse } from "valibot";

export async function importResumeFile(file: File): Promise<ImportedResume> {
  const response = await fetch(`/api${resumeImportContract.importResume.path}`, {
    method: resumeImportContract.importResume.method,
    headers: {
      "content-type": file.type || "application/octet-stream",
      "x-file-name": encodeURIComponent(file.name),
    },
    body: file,
  });

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(getErrorMessage(body) ?? "Could not import the resume.");
  }

  return toImportedResume(parse(resumeImportContract.importResume.response, body).resume);
}

function getErrorMessage(body: unknown): string | null {
  if (body === null || typeof body !== "object" || !("message" in body)) {
    return null;
  }
  return typeof body.message === "string" ? body.message : null;
}