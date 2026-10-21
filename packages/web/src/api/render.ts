import { createFetchClient, renderContract, type Resume } from "@resume-optimzer-app/common";

const client = createFetchClient(renderContract, { baseUrl: "/api" });

export async function renderResume(input: {
  resume: Resume;
  aiInstructions: string;
  targetJobDescription: string;
}): Promise<string> {
  const { markup } = await client.render({ body: input });
  return markup;
}
