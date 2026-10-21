import { array, InferOutput, literal, nullable, object, picklist, string, variant } from "valibot";
import { Uuid } from "../core";
import { Email } from "../core/Email";
import { KnownIcon } from "../core/KnownIcon";
import { PlainDate } from "../core/PlainDate";
import { Rating } from "../core/Rating";

export const Resume = object({
  id: Uuid, // 1:1 with ResumeProject
  fullName: string(),
  careerName: string(),
  aboutMe: string(),

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
        description: string(), // company description like Fintech startup etc
      }),
      role: string(), // like Full Stack software engineer etc
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
      startDate: PlainDate,
      endDate: nullable(PlainDate),
    }),
  ),

  skills: object({
    listed: array(
      object({
        rating: Rating, // For example 5/5
        name: string(), // for example: Javascript
      }),
    ),
    categorized: array(
      object({
        category: string(), // for example: build tools
        skill: string(), // for example: gradle
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

export type Resume = InferOutput<typeof Resume>;