import { inject, injectable } from "@needle-di/core";
import { renderContract, RenderResumeRequest } from "@resume-optimzer-app/common";
import { Hono } from "hono";
import { parse } from "valibot";
import { RenderInvalidRequestError } from "./error/RenderInvalidRequestError";
import { RenderService } from "./RenderService";

@injectable()
export class RenderApi {
  constructor(private readonly service = inject(RenderService)) {}

  build(): Hono {
    const api = new Hono();

    api.post(renderContract.render.path, async (c) => {
      let input: RenderResumeRequest;
      try {
        input = parse(RenderResumeRequest, await c.req.json());
      } catch {
        throw new RenderInvalidRequestError();
      }

      const render = await this.service.render(input);
      return c.json({ render });
    });

    return api;
  }
}
