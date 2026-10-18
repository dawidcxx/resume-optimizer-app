import {
  generateId,
  type Email,
  type Resume,
  type ResumeProject,
} from "@resume-optimzer-app/common";
import { resumeProjectToRow, resumeToRow } from "./mappers";
import { store } from "./store";
import { RESUMES_TABLE, RESUME_PROJECTS_TABLE } from "./tables";

export type CreateResumeProjectInput = {
  name: string;
  fullName?: string;
  careerName?: string;
};

export const DEFAULT_RESUME_PROJECT_NAME = "My Resume";

export function nextResumeProjectName(
  existingNames: Iterable<string>,
  baseName = DEFAULT_RESUME_PROJECT_NAME,
): string {
  const taken = new Set(existingNames);
  if (!taken.has(baseName)) return baseName;

  let suffix = 1;
  while (taken.has(`${baseName} (${suffix})`)) {
    suffix += 1;
  }
  return `${baseName} (${suffix})`;
}

export function createEmptyResume(input: Omit<CreateResumeProjectInput, "name"> = {}): Omit<
  Resume,
  "id"
> {
  return {
    fullName: input.fullName ?? "",
    careerName: input.careerName ?? "",
    contact: {
      email: "" as Email,
      phone: "",
      address: { line1: "", line2: "" },
      socials: [],
      website: "",
    },
    experience: [],
    education: [],
    skills: { listed: [], categorized: [] },
    projects: [],
  };
}

export function createResumeProject(input: CreateResumeProjectInput): ResumeProject {
  const id = generateId();
  const now = new Date();

  const project: ResumeProject = {
    id,
    version: "v1",
    name: input.name.trim(),
    createdAt: now,
    updatedAt: now,
  };
  const resume: Resume = { id, ...createEmptyResume(input) };

  store.setRow(RESUME_PROJECTS_TABLE, id, resumeProjectToRow(project));
  store.setRow(RESUMES_TABLE, id, resumeToRow(resume));

  return project;
}

export function deleteResumeProject(id: string): void {
  store.delRow(RESUME_PROJECTS_TABLE, id);
  store.delRow(RESUMES_TABLE, id);
}
