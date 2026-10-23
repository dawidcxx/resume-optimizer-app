import { InferOutput, maxLength, object, pipe, string } from "valibot";
import {
  RENDER_AI_INSTRUCTIONS_MAX_LENGTH,
  RENDER_TARGET_JOB_DESCRIPTION_MAX_LENGTH,
} from "../consts/render";
import { ImportedResumeSchema } from "../domain/resume/ImportedResume";
import { ResumeAnnotations } from "../domain/resume/ResumeAnnotations";

export const RenderResumeRequest = object({
  resume: ImportedResumeSchema,
  annotations: ResumeAnnotations,
  aiInstructions: pipe(string(), maxLength(RENDER_AI_INSTRUCTIONS_MAX_LENGTH)),
  targetJobDescription: pipe(string(), maxLength(RENDER_TARGET_JOB_DESCRIPTION_MAX_LENGTH)),
});

export type RenderResumeRequest = InferOutput<typeof RenderResumeRequest>;

export const renderContract = {
  render: {
    method: "POST",
    path: "/renders",
    request: RenderResumeRequest,
    response: object({ markup: string() }),
  },
} as const;