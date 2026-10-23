import { generateId, type Uuid } from "@resume-optimzer-app/common";
import { resumeRenderToRow, type ResumeRender } from "./mappers";
import { store } from "./store";
import { RESUME_RENDER_CELLS, RESUME_RENDERS_TABLE } from "./tables";

export function saveResumeRender(input: {
  projectId: Uuid;
  chatId: Uuid;
  markup: string;
}): ResumeRender {
  const render: ResumeRender = {
    id: generateId(),
    projectId: input.projectId,
    chatId: input.chatId,
    createdAt: new Date(),
    markup: input.markup,
  };

  store.setRow(RESUME_RENDERS_TABLE, render.id, resumeRenderToRow(render));
  return render;
}

export function updateResumeRender(input: { id: Uuid; markup: string }): void {
  if (!store.hasRow(RESUME_RENDERS_TABLE, input.id)) return;

  store.setPartialRow(RESUME_RENDERS_TABLE, input.id, {
    [RESUME_RENDER_CELLS.markup]: input.markup,
    [RESUME_RENDER_CELLS.createdAt]: Date.now(),
  });
}