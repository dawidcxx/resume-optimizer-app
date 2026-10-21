import type { Resume, ResumeProject } from "@resume-optimzer-app/common";
import type { Store } from "tinybase";
import {
  rowToResume,
  rowToResumeProject,
  rowToResumeRender,
  type ResumeRender,
} from "./mappers";
import {
  RESUMES_TABLE,
  RESUME_PROJECTS_TABLE,
  RESUME_RENDERS_TABLE,
} from "./tables";

export function readResumeProjects(store: Store): ResumeProject[] {
  return Object.entries(store.getTable(RESUME_PROJECTS_TABLE))
    .map(([id, row]) => rowToResumeProject(id, row))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function readResumeProject(store: Store, id: string): ResumeProject | undefined {
  if (!store.hasRow(RESUME_PROJECTS_TABLE, id)) return undefined;
  return rowToResumeProject(id, store.getRow(RESUME_PROJECTS_TABLE, id));
}

export function readResume(store: Store, id: string): Resume | undefined {
  if (!store.hasRow(RESUMES_TABLE, id)) return undefined;
  return rowToResume(id, store.getRow(RESUMES_TABLE, id));
}

export function readResumeRenders(store: Store, projectId: string): ResumeRender[] {
  return Object.entries(store.getTable(RESUME_RENDERS_TABLE))
    .map(([id, row]) => rowToResumeRender(id, row))
    .filter((render) => render.projectId === projectId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export type ResumeBundle = {
  project: ResumeProject;
  resume: Resume | undefined;
};

export function readResumeBundle(store: Store, id: string): ResumeBundle | undefined {
  const project = readResumeProject(store, id);
  if (!project) return undefined;
  return { project, resume: readResume(store, id) };
}
