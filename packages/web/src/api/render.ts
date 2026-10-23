import {
  createFetchClient,
  renderContract,
  type RenderTurnResponse,
  type Resume,
  type ResumeAnnotations,
  type Uuid,
} from "@resume-optimzer-app/common";

const client = createFetchClient(renderContract, { baseUrl: "/api" });

export async function renderResume(input: {
  resume: Resume;
  annotations: ResumeAnnotations;
  aiInstructions: string;
  targetJobDescription: string;
}): Promise<RenderTurnResponse> {
  return client.render({
    body: {
      projectId: input.resume.id,
      resume: input.resume,
      annotations: input.annotations,
      aiInstructions: input.aiInstructions,
      targetJobDescription: input.targetJobDescription,
    },
  });
}

export async function sendRenderMessage(
  chatId: Uuid,
  content: string,
): Promise<RenderTurnResponse> {
  return client.sendMessage({ params: { chatId }, body: { content } });
}
