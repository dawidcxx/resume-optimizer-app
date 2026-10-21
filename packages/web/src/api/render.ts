import {
  createFetchClient,
  renderContract,
  type RenderDocument,
  type Resume,
} from "@resume-optimzer-app/common";

const client = createFetchClient(renderContract, { baseUrl: "/api" });

export async function renderResume(input: {
  resume: Resume;
  aiInstructions: string;
  targetJobDescription: string;
}): Promise<RenderDocument> {
  const { render } = await client.render({ body: input });
  return render;
}
