import { InferOutput, nullable, number, object, string } from "valibot";
import { JsDate } from "../core/JsDate";
import { Uuid } from "../core/Uuid";

export const FileDetails = object({
  id: Uuid,
  filename: string(),
  sizeBytes: number(),
  mimeType: string(),
  createdAt: JsDate,
  expiresAt: nullable(JsDate),
});

export type FileDetails = InferOutput<typeof FileDetails>;