import {
  array,
  check,
  integer,
  maxLength,
  minLength,
  minValue,
  nullable,
  number,
  object,
  picklist,
  pipe,
  string,
  type InferOutput,
} from "valibot";
import {
  RENDER_AI_INSTRUCTIONS_MAX_LENGTH,
  RENDER_CHAT_ASSISTANT_REPLY_MAX_LENGTH,
  RENDER_CHAT_MARKUP_MAX_LENGTH,
  RENDER_CHAT_USER_MESSAGE_MAX_LENGTH,
  RENDER_TARGET_JOB_DESCRIPTION_MAX_LENGTH,
} from "../consts/render";
import { JsDate } from "../domain/core/JsDate";
import { Uuid } from "../domain/core/Uuid";
import { ImportedResumeSchema } from "../domain/resume/ImportedResume";
import { ResumeAnnotations } from "../domain/resume/ResumeAnnotations";

export const RenderRole = picklist(["user", "assistant"]);

export const RenderUsage = object({
  inputTokens: number(),
  cachedInputTokens: number(),
  outputTokens: number(),
});

export const RenderMessage = object({
  id: Uuid,
  chatId: Uuid,
  seq: pipe(number(), integer(), minValue(1)),
  role: RenderRole,
  content: string(),
  markup: nullable(string()),
  usage: nullable(RenderUsage),
  createdAt: JsDate,
});

export const RenderChat = object({
  id: Uuid,
  projectId: Uuid,
  aiInstructions: string(),
  targetJobDescription: string(),
  initialMarkup: string(),
  createdAt: JsDate,
  updatedAt: JsDate,
});

export const RenderTurnResponse = object({
  chatId: Uuid,
  reply: nullable(string()),
  markup: string(),
  usage: RenderUsage,
});

export const RenderResumeRequest = object({
  projectId: Uuid,
  resume: ImportedResumeSchema,
  annotations: ResumeAnnotations,
  aiInstructions: pipe(string(), maxLength(RENDER_AI_INSTRUCTIONS_MAX_LENGTH)),
  targetJobDescription: pipe(string(), maxLength(RENDER_TARGET_JOB_DESCRIPTION_MAX_LENGTH)),
});

export const RenderChatParams = object({
  chatId: Uuid,
});

export const SendRenderMessageRequest = object({
  content: pipe(
    string(),
    check((value) => value.trim().length > 0, "Message cannot be empty."),
    maxLength(RENDER_CHAT_USER_MESSAGE_MAX_LENGTH),
  ),
});

export const GetRenderChatResponse = object({
  chat: RenderChat,
  messages: array(RenderMessage),
});

export const RenderChatOutput = object({
  reply: pipe(string(), minLength(1), maxLength(RENDER_CHAT_ASSISTANT_REPLY_MAX_LENGTH)),
  markup: pipe(string(), minLength(1), maxLength(RENDER_CHAT_MARKUP_MAX_LENGTH)),
});

export type RenderRole = InferOutput<typeof RenderRole>;
export type RenderUsage = InferOutput<typeof RenderUsage>;
export type RenderMessage = InferOutput<typeof RenderMessage>;
export type RenderChat = InferOutput<typeof RenderChat>;
export type RenderTurnResponse = InferOutput<typeof RenderTurnResponse>;
export type RenderResumeRequest = InferOutput<typeof RenderResumeRequest>;
export type RenderChatParams = InferOutput<typeof RenderChatParams>;
export type SendRenderMessageRequest = InferOutput<typeof SendRenderMessageRequest>;
export type GetRenderChatResponse = InferOutput<typeof GetRenderChatResponse>;
export type RenderChatOutput = InferOutput<typeof RenderChatOutput>;

export const renderContract = {
  render: {
    method: "POST",
    path: "/renders",
    request: RenderResumeRequest,
    response: RenderTurnResponse,
  },
  getChat: {
    method: "GET",
    path: "/renders/:chatId",
    params: RenderChatParams,
    response: GetRenderChatResponse,
  },
  sendMessage: {
    method: "POST",
    path: "/renders/:chatId/messages",
    params: RenderChatParams,
    request: SendRenderMessageRequest,
    response: RenderTurnResponse,
  },
} as const;