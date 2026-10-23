import { inject, injectable } from "@needle-di/core";
import {
  RenderChatParams,
  RenderResumeRequest,
  SendRenderMessageRequest,
  renderContract,
} from "@resume-optimzer-app/common";
import { Hono } from "hono";
import { parse } from "valibot";
import { requireTurnstile, TurnstileService } from "@/features/turnstile";
import { RenderInvalidRequestError } from "./error/RenderInvalidRequestError";
import { RenderService } from "./RenderService";

@injectable()
export class RenderApi {
  constructor(
    private readonly service = inject(RenderService),
    private readonly turnstile = inject(TurnstileService),
  ) {}

  build(): Hono {
    const api = new Hono();

    api.post(renderContract.render.path, async (c) => {
      await requireTurnstile(c, this.turnstile);

      let input: RenderResumeRequest;
      try {
        input = parse(RenderResumeRequest, await c.req.json());
      } catch {
        throw new RenderInvalidRequestError();
      }

      return c.json(await this.service.render(input));
    });

    api.get(renderContract.getChat.path, async (c) => {
      let params: RenderChatParams;
      try {
        params = parse(RenderChatParams, c.req.param());
      } catch {
        throw new RenderInvalidRequestError();
      }

      return c.json(await this.service.getChat(params.chatId));
    });

    api.post(renderContract.sendMessage.path, async (c) => {
      let params: RenderChatParams;
      let input: SendRenderMessageRequest;
      try {
        params = parse(RenderChatParams, c.req.param());
        input = parse(SendRenderMessageRequest, await c.req.json());
      } catch {
        throw new RenderInvalidRequestError();
      }

      return c.json(await this.service.sendMessage(params.chatId, input.content));
    });

    return api;
  }
}