import { generateId, type Uuid } from "@resume-optimzer-app/common";
import { resumeRenderToRow, type ResumeRender } from "./mappers";
import { store } from "./store";
import { RESUME_RENDERS_TABLE } from "./tables";

export function saveResumeRender(input: {
  projectId: Uuid;
  markup: string;
}): ResumeRender {
  const render: ResumeRender = {
    id: generateId(),
    projectId: input.projectId,
    createdAt: new Date(),
    markup: input.markup,
  };

  store.setRow(RESUME_RENDERS_TABLE, render.id, resumeRenderToRow(render));
  return render;
}
