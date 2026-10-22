import { maxLength, pipe, record, string, type InferOutput } from "valibot";
import { RESUME_ANNOTATION_MAX_LENGTH } from "../../consts/resume";

export const ResumeAnnotations = record(
  string(),
  pipe(string(), maxLength(RESUME_ANNOTATION_MAX_LENGTH)),
);

export type ResumeAnnotations = InferOutput<typeof ResumeAnnotations>;
