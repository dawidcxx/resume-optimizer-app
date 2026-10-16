import { InferOutput, literal, object, string } from "valibot";
import { JsDate } from "../core";
import { Uuid } from "../core/Uuid";

export const ResumeProject = object({
  id: Uuid, // 1:1 with Resume
  version: literal("v1"),
  name: string(),
  createdAt: JsDate,
  updatedAt: JsDate,
});

export type ResumeProject = InferOutput<typeof ResumeProject>;