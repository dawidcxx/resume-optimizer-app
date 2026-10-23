import { TURNSTILE_TOKEN_HEADER } from "@resume-optimzer-app/common";
import type { Context } from "hono";
import { TurnstileService } from "./TurnstileService";
import { TurnstileVerificationError } from "./TurnstileVerificationError";

export async function requireTurnstile(
  c: Context,
  turnstile: TurnstileService,
): Promise<void> {
  const token = c.req.header(TURNSTILE_TOKEN_HEADER)?.trim();
  if (!token) {
    throw new TurnstileVerificationError();
  }

  await turnstile.verify(token);
}
