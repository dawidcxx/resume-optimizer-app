import { array, InferOutput, literal, nullable, object, picklist, string, variant } from "valibot";
import { Email } from "../core/Email";
import { KnownIcon } from "../core/KnownIcon";
import { PlainDate } from "../core/PlainDate";
import { Rating } from "../core/Rating";
import type { Resume } from "./Resume";

export const ImportedResumeSchema = object({
  fullName: string(),
  careerName: string(),
  aboutMe: string(),

  contact: object({
    email: string(),
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
      from: string(),
      to: nullable(string()),
      workType: picklist(["onsite", "hybrid", "remote"]),
      company: object({
        name: string(),
        city: string(),
        description: string(),
      }),
      role: string(),
      bulletPoints: array(string()),
    }),
  ),

  education: array(
    object({
      institute: object({
        name: string(),
        type: picklist(["collage", "school", "training"]),
      }),
      degree: string(),
      startDate: string(),
      endDate: nullable(string()),
    }),
  ),

  skills: object({
    listed: array(
      object({
        rating: Rating,
        name: string(),
      }),
    ),
    categorized: array(
      object({
        category: string(),
        skill: string(),
      }),
    ),
  }),

  projects: array(
    object({
      icon: nullable(KnownIcon),
      name: string(),
      url: string(),
      description: string(),
    }),
  ),
});

export type ImportedResume = Omit<Resume, "id">;

export function toImportedResume(value: InferOutput<typeof ImportedResumeSchema>): ImportedResume {
  return {
    ...value,
    contact: {
      ...value.contact,
      email: value.contact.email as Email,
    },
    experience: value.experience.map((item) => ({
      ...item,
      from: item.from as PlainDate,
      to: item.to as PlainDate | null,
    })),
    education: value.education.map((item) => ({
      ...item,
      startDate: item.startDate as PlainDate,
      endDate: item.endDate as PlainDate | null,
    })),
  };
}