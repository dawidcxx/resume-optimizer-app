import { array, InferOutput, literal, nullable, object, picklist, string, variant } from "valibot";
import { Email } from "../core/Email";
import { PlainDate } from "../core/PlainDate";
import { Uuid } from "../core/Uuid";

export const Resume = object({
  version: literal("v1"),
  id: Uuid,

  fullName: string(),
  careerName: string(),

  contact: object({
    email: Email,
    phone: string(),
    address: object({
      line1: string(),
      line2: string(),
    }),
    socials: array(
      variant("type", [
        object({ type: literal("github"), link: string() }),
        object({ type: literal("facebook"), link: string() }),
        object({ type: literal("x"), link: string() }),
        object({ type: literal("linkedin"), link: string() }),
        object({ type: literal("youtube"), link: string() }),
      ]),
    ),
    website: string(),
  }),

  experience: array(
    object({
      from: PlainDate,
      to: nullable(PlainDate),
      workType: picklist(["onsite", "hybrid", "remote"]),
      company: object({
        name: string(),
        city: string(),
        description: string(),
      }),
    }),
  ),
});

export type Resume = InferOutput<typeof Resume>;