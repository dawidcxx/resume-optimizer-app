import { InferOutput, optional, picklist } from "valibot";

export const Rating = optional(picklist([1, 2, 3, 4, 5]), 3);
export type Rating = InferOutput<typeof Rating>;