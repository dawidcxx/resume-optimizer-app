import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import {
  generateId,
  type RenderResumeRequest,
  type RenderTurnResponse,
  type Uuid,
} from "@resume-optimzer-app/common";
import type {
  LlmService,
  ReviseResumeInput,
} from "@/features/llm/LlmService";
import { DB } from "@/shared/Db";
import {
  getIntegrationTestContext,
  type IntegrationTestCtx,
} from "@/test/utils/integrationTestContext";
import { RenderService } from "./RenderService";

const initialInput: RenderResumeRequest = {
  projectId: generateId(),
  resume: {
    fullName: "Ada Lovelace",
    careerName: "Software Engineer",
    aboutMe: "Builds reliable systems.",
    contact: {
      email: "ada@example.com",
      phone: "",
      address: { line1: "", line2: "" },
      socials: [],
      website: "",
    },
    experience: [],
    education: [],
    skills: { listed: [], categorized: [] },
    projects: [],
  },
  annotations: {},
  aiInstructions: "Warm and editorial.",
  targetJobDescription: "Senior platform engineer.",
};

describe("RenderService", () => {
  let ctx: IntegrationTestCtx;
  let service: RenderService;
  const revisions: ReviseResumeInput[] = [];

  beforeAll(async () => {
    ctx = await getIntegrationTestContext();

    const llm: LlmService = {
      importResume: async () => {
        throw new Error("Not used.");
      },
      renderResume: async () => ({
        reply: null,
        markup: '<Resume density="compact"><Header name="Ada" /></Resume>',
        usage: { inputTokens: 100, cachedInputTokens: 50, outputTokens: 20 },
      }),
      reviseResume: async (input) => {
        revisions.push(input);
        return {
          reply: `Revision ${revisions.length}`,
          markup: `<Resume density="compact"><Header name="Ada ${revisions.length}" /></Resume>`,
          usage: {
            inputTokens: 100 * revisions.length,
            cachedInputTokens: 50 * revisions.length,
            outputTokens: 20 * revisions.length,
          },
        };
      },
    };

    service = new RenderService(llm, ctx.container.get(DB));
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  it("creates a chat on the initial render and appends chat revisions", async () => {
    const initial = await service.render(initialInput);
    expect(initial.reply).toBeNull();
    expect(initial.markup).toContain("<Header");
    expect(initial.usage).toEqual({
      inputTokens: 100,
      cachedInputTokens: 50,
      outputTokens: 20,
    });

    const created = await service.getChat(initial.chatId);
    expect(created.chat.projectId).toBe(initialInput.projectId);
    expect(created.chat.initialMarkup).toBe(initial.markup);
    expect(created.messages).toEqual([]);

    const first = await service.sendMessage(
      initial.chatId,
      "Hide education dates.",
    );
    assertTurnShape(first, initial.chatId);
    expect(first.reply).toBe("Revision 1");
    expect(first.usage.inputTokens).toBe(100);

    const second = await service.sendMessage(
      initial.chatId,
      "Reword the summary.",
    );
    assertTurnShape(second, initial.chatId);
    expect(second.reply).toBe("Revision 2");

    expect(revisions[0]?.messages).toHaveLength(1);
    expect(revisions[0]?.messages[0]).toEqual({
      role: "user",
      content: "Hide education dates.",
      markup: null,
    });
    expect(revisions[1]?.messages).toHaveLength(3);
    expect(revisions[1]?.messages[1]).toEqual({
      role: "assistant",
      content: "Revision 1",
      markup: '<Resume density="compact"><Header name="Ada 1" /></Resume>',
    });

    const loaded = await service.getChat(initial.chatId);
    expect(loaded.messages).toHaveLength(4);
    expect(loaded.messages.map((message) => message.role)).toEqual([
      "user",
      "assistant",
      "user",
      "assistant",
    ]);
    expect(loaded.messages[3]?.markup).toBe(second.markup);
  });
});

function assertTurnShape(turn: RenderTurnResponse, chatId: Uuid) {
  expect(turn.chatId).toBe(chatId);
  expect(typeof turn.markup).toBe("string");
  expect(typeof turn.usage.inputTokens).toBe("number");
  expect(typeof turn.usage.cachedInputTokens).toBe("number");
  expect(typeof turn.usage.outputTokens).toBe("number");
}
