import { generateId, type RenderDocument, type Uuid } from "@resume-optimzer-app/common";
import { resumeRenderToRow, type ResumeRender } from "./mappers";
import { store } from "./store";
import { RESUME_RENDERS_TABLE } from "./tables";

export function saveResumeRender(input: {
  projectId: Uuid;
  spec: RenderDocument;
}): ResumeRender {
  const render: ResumeRender = {
    id: generateId(),
    projectId: input.projectId,
    createdAt: new Date(),
    spec: input.spec,
  };

  store.setRow(RESUME_RENDERS_TABLE, render.id, resumeRenderToRow(render));
  return render;
}
