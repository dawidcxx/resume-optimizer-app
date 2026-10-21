import { object } from "valibot";
import { ImportedResumeSchema } from "../domain/resume/ImportedResume";

export const resumeImportContract = {
  importResume: {
    method: "POST",
    path: "/resumes/import",
    response: object({ resume: ImportedResumeSchema }),
  },
} as const;
