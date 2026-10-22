import {
  generateId,
  type Email,
  type ImportedResume,
  type Resume,
  type ResumeProject,
} from "@resume-optimzer-app/common";
import { resumeProjectToRow, resumeToRow } from "./mappers";
import { store } from "./store";
import {
  RESUMES_TABLE,
  RESUME_ANNOTATIONS_TABLE,
  RESUME_PROJECTS_TABLE,
  RESUME_PROJECT_CELLS,
  RESUME_RENDERS_TABLE,
  RESUME_RENDER_CELLS,
} from "./tables";

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
    aboutMe: "",
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

export function createResumeProjectFromImport(input: {
  name: string;
  resume: ImportedResume;
}): ResumeProject {
  const id = generateId();
  const now = new Date();

  const project: ResumeProject = {
    id,
    version: "v1",
    name: input.name.trim(),
    createdAt: now,
    updatedAt: now,
  };
  const resume: Resume = { id, ...input.resume };

  store.setRow(RESUME_PROJECTS_TABLE, id, resumeProjectToRow(project));
  store.setRow(RESUMES_TABLE, id, resumeToRow(resume));

  return project;
}

export function saveResumeDraft(resume: Resume): void {
  store.setRow(RESUMES_TABLE, resume.id, resumeToRow(resume));
  store.setCell(
    RESUME_PROJECTS_TABLE,
    resume.id,
    RESUME_PROJECT_CELLS.updatedAt,
    Date.now(),
  );
}

export function deleteResumeProject(id: string): void {
  store.delRow(RESUME_PROJECTS_TABLE, id);
  store.delRow(RESUMES_TABLE, id);
  store.delRow(RESUME_ANNOTATIONS_TABLE, id);

  for (const renderId of store.getRowIds(RESUME_RENDERS_TABLE)) {
    const projectId = store.getCell(
      RESUME_RENDERS_TABLE,
      renderId,
      RESUME_RENDER_CELLS.projectId,
    );
    if (projectId === id) {
      store.delRow(RESUME_RENDERS_TABLE, renderId);
    }
  }
}
