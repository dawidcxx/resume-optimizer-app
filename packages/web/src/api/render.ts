import {
  TURNSTILE_TOKEN_HEADER,
  createFetchClient,
  renderContract,
  type GetRenderChatResponse,
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
  turnstileToken: string;
}): Promise<RenderTurnResponse> {
  const gatedClient = createFetchClient(renderContract, {
    baseUrl: "/api",
    headers: { [TURNSTILE_TOKEN_HEADER]: input.turnstileToken },
  });

  return gatedClient.render({
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

export async function getRenderChat(chatId: Uuid): Promise<GetRenderChatResponse> {
  return client.getChat({ params: { chatId } });
}
