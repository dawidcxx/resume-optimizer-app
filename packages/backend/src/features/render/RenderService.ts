import { inject, injectable } from "@needle-di/core";
import {
  RENDER_CHAT_MAX_MESSAGES,
  RENDER_CHAT_MAX_TOTAL_CHARS,
  generateId,
  toImportedResume,
  type GetRenderChatResponse,
  type RenderChat,
  type RenderMessage,
  type RenderResumeRequest,
  type RenderTurnResponse,
  type RenderUsage,
  type Uuid,
} from "@resume-optimzer-app/common";
import { asc, eq, max, sql } from "drizzle-orm";
import { serializeError } from "serialize-error";
import { LlmService } from "@/features/llm/LlmService";
import { Logger } from "@/lib/Logger";
import { DB, type DrizzleDb } from "@/shared/Db";
import { RenderGenerationError } from "./error/RenderGenerationError";
import { RenderInvalidRequestError } from "./error/RenderInvalidRequestError";
import { RenderNotFoundError } from "./error/RenderNotFoundError";
import { renderChatMessages, renderChats } from "./model/renderChats";

type RenderChatRow = typeof renderChats.$inferSelect;
type RenderMessageRow = typeof renderChatMessages.$inferSelect;

@injectable()
export class RenderService {
  constructor(
    private readonly llm = inject(LlmService),
    private readonly db: DrizzleDb = inject(DB),
  ) {}

  async render(input: RenderResumeRequest): Promise<RenderTurnResponse> {
    try {
      const result = await this.llm.renderResume(input);
      const chatId = generateId();
      const now = new Date();

      await this.db.insert(renderChats).values({
        id: chatId,
        projectId: input.projectId,
        resumeSnapshot: toImportedResume(input.resume),
        annotationsSnapshot: input.annotations,
        aiInstructions: input.aiInstructions,
        targetJobDescription: input.targetJobDescription,
        initialMarkup: result.markup,
        createdAt: now,
        updatedAt: now,
      });

      return {
        chatId,
        reply: null,
        markup: result.markup,
        usage: result.usage,
      };
    } catch (error) {
      logger.error("Resume render failed", { error: serializeError(error) });
      throw new RenderGenerationError();
    }
  }

  async sendMessage(chatId: Uuid, contentInput: string): Promise<RenderTurnResponse> {
    const content = contentInput.trim();
    if (content.length === 0) {
      throw new RenderInvalidRequestError("The message cannot be empty.");
    }

    const { chat, messages } = await this.loadChat(chatId);
    const existingCharacters = messages.reduce(
      (total, message) => total + message.content.length + (message.markup?.length ?? 0),
      0,
    );

    if (
      messages.length + 2 > RENDER_CHAT_MAX_MESSAGES ||
      existingCharacters + content.length > RENDER_CHAT_MAX_TOTAL_CHARS
    ) {
      throw new RenderInvalidRequestError(
        "This render chat has reached its context limit. Start a new chat.",
      );
    }

    let revision;
    try {
      revision = await this.llm.reviseResume({
        resume: chat.resumeSnapshot,
        annotations: chat.annotationsSnapshot,
        aiInstructions: chat.aiInstructions,
        targetJobDescription: chat.targetJobDescription,
        initialMarkup: chat.initialMarkup,
        messages: [
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
            markup: message.markup,
          })),
          { role: "user", content, markup: null },
        ],
      });
    } catch (error) {
      logger.error("Resume revision failed", {
        chatId,
        error: serializeError(error),
      });
      throw new RenderGenerationError();
    }

    const reply = revision.reply;
    if (reply === null) {
      throw new RenderGenerationError();
    }

    const userMessageId = generateId();
    const assistantMessageId = generateId();
    const now = new Date();

    const inserted = await this.db.transaction(async (tx) => {
      await tx.execute(sql`SELECT id FROM render_chats WHERE id = ${chatId} FOR UPDATE`);

      const [latest] = await tx
        .select({ seq: max(renderChatMessages.seq) })
        .from(renderChatMessages)
        .where(eq(renderChatMessages.chatId, chatId));
      const nextSeq = (latest?.seq ?? 0) + 1;

      const rows = await tx
        .insert(renderChatMessages)
        .values([
          {
            id: userMessageId,
            chatId,
            seq: nextSeq,
            role: "user",
            content,
            markup: null,
            createdAt: now,
          },
          {
            id: assistantMessageId,
            chatId,
            seq: nextSeq + 1,
            role: "assistant",
            content: reply,
            markup: revision.markup,
            inputTokens: revision.usage.inputTokens,
            cachedTokens: revision.usage.cachedInputTokens,
            outputTokens: revision.usage.outputTokens,
            createdAt: new Date(now.getTime() + 1),
          },
        ])
        .returning();

      await tx.update(renderChats).set({ updatedAt: now }).where(eq(renderChats.id, chatId));

      return rows;
    });

    const assistantMessage = inserted.find((message) => message.id === assistantMessageId);
    if (!assistantMessage) {
      throw new Error("Render chat messages could not be persisted.");
    }

    logger.info("Render revision completed", {
      chatId,
      seq: assistantMessage.seq,
      inputTokens: revision.usage.inputTokens,
      cachedInputTokens: revision.usage.cachedInputTokens,
      outputTokens: revision.usage.outputTokens,
    });

    return {
      chatId,
      reply,
      markup: revision.markup,
      usage: revision.usage,
    };
  }

  async getChat(chatId: Uuid): Promise<GetRenderChatResponse> {
    const { chat, messages } = await this.loadChat(chatId);
    return {
      chat: mapChat(chat),
      messages: messages.map(mapMessage),
    };
  }

  private async loadChat(chatId: Uuid): Promise<{
    chat: RenderChatRow;
    messages: RenderMessageRow[];
  }> {
    const [chat] = await this.db.select().from(renderChats).where(eq(renderChats.id, chatId));
    if (!chat) {
      throw new RenderNotFoundError();
    }

    const messages = await this.db
      .select()
      .from(renderChatMessages)
      .where(eq(renderChatMessages.chatId, chatId))
      .orderBy(asc(renderChatMessages.seq));

    return { chat, messages };
  }
}

const logger = Logger.for(RenderService);

function mapChat(row: RenderChatRow): RenderChat {
  return {
    id: row.id as Uuid,
    projectId: row.projectId as Uuid,
    aiInstructions: row.aiInstructions,
    targetJobDescription: row.targetJobDescription,
    initialMarkup: row.initialMarkup,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapMessage(row: RenderMessageRow): RenderMessage {
  return {
    id: row.id as Uuid,
    chatId: row.chatId as Uuid,
    seq: row.seq,
    role: row.role,
    content: row.content,
    markup: row.markup,
    usage: mapMessageUsage(row),
    createdAt: row.createdAt,
  };
}

function mapMessageUsage(row: RenderMessageRow): RenderUsage | null {
  if (row.inputTokens === null && row.cachedTokens === null && row.outputTokens === null) {
    return null;
  }

  return {
    inputTokens: row.inputTokens ?? 0,
    cachedInputTokens: row.cachedTokens ?? 0,
    outputTokens: row.outputTokens ?? 0,
  };
}