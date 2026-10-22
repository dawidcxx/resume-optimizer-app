import {
  createFetchClient,
  renderContract,
  type Resume,
  type ResumeAnnotations,
} from "@resume-optimzer-app/common";

const client = createFetchClient(renderContract, { baseUrl: "/api" });

export async function renderResume(input: {
  resume: Resume;
  annotations: ResumeAnnotations;
  aiInstructions: string;
  targetJobDescription: string;
}): Promise<string> {
  const { markup } = await client.render({ body: input });
  return markup;
}
