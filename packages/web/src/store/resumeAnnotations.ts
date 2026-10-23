import type { ResumeAnnotations } from "@resume-optimzer-app/common";
import { resumeAnnotationsToRow } from "./mappers";
import { store } from "./store";
import { RESUME_ANNOTATIONS_TABLE, RESUME_PROJECTS_TABLE, RESUME_PROJECT_CELLS } from "./tables";

export function saveResumeAnnotations(projectId: string, annotations: ResumeAnnotations): void {
  if (!store.hasRow(RESUME_PROJECTS_TABLE, projectId)) return;

  if (Object.keys(annotations).length === 0) {
    store.delRow(RESUME_ANNOTATIONS_TABLE, projectId);
  } else {
    store.setRow(
      RESUME_ANNOTATIONS_TABLE,
      projectId,
      resumeAnnotationsToRow(projectId, annotations),
    );
  }

  if (store.hasRow(RESUME_PROJECTS_TABLE, projectId)) {
    store.setCell(RESUME_PROJECTS_TABLE, projectId, RESUME_PROJECT_CELLS.updatedAt, Date.now());
  }
}