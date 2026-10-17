import type { Resume, ResumeProject } from "@resume-optimzer-app/common";
import type { Store } from "tinybase";
import { rowToResume, rowToResumeProject } from "./mappers";
import { RESUMES_TABLE, RESUME_PROJECTS_TABLE } from "./tables";

export function readResumeProjects(store: Store): ResumeProject[] {
  return Object.entries(store.getTable(RESUME_PROJECTS_TABLE))
    .map(([id, row]) => rowToResumeProject(id, row))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function readResumeProject(store: Store, id: string): ResumeProject | undefined {
  const row = store.getRow(RESUME_PROJECTS_TABLE, id);
  return row ? rowToResumeProject(id, row) : undefined;
}

export function readResume(store: Store, id: string): Resume | undefined {
  const row = store.getRow(RESUMES_TABLE, id);
  return row ? rowToResume(id, row) : undefined;
}
