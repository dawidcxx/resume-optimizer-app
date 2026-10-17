import type { Email, Resume, ResumeProject, Uuid } from "@resume-optimzer-app/common";
import type { Cell, Row } from "tinybase";
import { RESUME_CELLS, RESUME_PROJECT_CELLS } from "./tables";

function asString(value: Cell | undefined, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: Cell | undefined, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asObject<T>(value: Cell | undefined, fallback: T): T {
  return value !== null && typeof value === "object" ? (value as T) : fallback;
}

export function rowToResumeProject(id: string, row: Row): ResumeProject {
  return {
    id: id as Uuid,
    version: "v1",
    name: asString(row[RESUME_PROJECT_CELLS.name]),
    createdAt: new Date(asNumber(row[RESUME_PROJECT_CELLS.createdAt])),
    updatedAt: new Date(asNumber(row[RESUME_PROJECT_CELLS.updatedAt])),
  };
}

export function rowToResume(id: string, row: Row): Resume {
  return {
    id: id as Uuid,
    fullName: asString(row[RESUME_CELLS.fullName]),
    careerName: asString(row[RESUME_CELLS.careerName]),
    contact: asObject<Resume["contact"]>(row[RESUME_CELLS.contact], {
      email: "" as Email,
      phone: "",
      address: { line1: "", line2: "" },
      socials: [],
      website: "",
    }),
    experience: asObject<Resume["experience"]>(row[RESUME_CELLS.experience], []),
    education: asObject<Resume["education"]>(row[RESUME_CELLS.education], []),
    skills: asObject<Resume["skills"]>(row[RESUME_CELLS.skills], {
      listed: [],
      categorized: [],
    }),
    projects: asObject<Resume["projects"]>(row[RESUME_CELLS.projects], []),
  };
}

export function resumeProjectToRow(project: ResumeProject): Row {
  return {
    [RESUME_PROJECT_CELLS.version]: project.version,
    [RESUME_PROJECT_CELLS.name]: project.name,
    [RESUME_PROJECT_CELLS.createdAt]: project.createdAt.getTime(),
    [RESUME_PROJECT_CELLS.updatedAt]: project.updatedAt.getTime(),
  };
}

export function resumeToRow(resume: Resume): Row {
  return {
    [RESUME_CELLS.fullName]: resume.fullName,
    [RESUME_CELLS.careerName]: resume.careerName,
    [RESUME_CELLS.contact]: resume.contact,
    [RESUME_CELLS.experience]: resume.experience,
    [RESUME_CELLS.education]: resume.education,
    [RESUME_CELLS.skills]: resume.skills,
    [RESUME_CELLS.projects]: resume.projects,
  };
}
