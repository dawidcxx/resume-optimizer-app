import { inject, injectable } from "@needle-di/core";
import { serializeError } from "serialize-error";
import { Logger } from "@/lib/Logger";
import { Config } from "@/shared/Config";
import { TurnstileUnavailableError } from "./TurnstileUnavailableError";
import { TurnstileVerificationError } from "./TurnstileVerificationError";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

type SiteverifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

@injectable()
export class TurnstileService {
  constructor(
    private readonly config = inject(Config),
    private readonly fetchFn: FetchFn = (input, init) => globalThis.fetch(input, init),
  ) {}

  async verify(token: string): Promise<void> {
    let result: SiteverifyResponse;

    try {
      const response = await this.fetchFn(SITEVERIFY_URL, {
        method: "POST",
        body: new URLSearchParams({
          secret: this.config.turnstileSecretKey,
          response: token,
        }),
        signal: AbortSignal.timeout(5_000),
      });

      if (!response.ok) {
        throw new Error(`Siteverify returned ${response.status}`);
      }

      result = (await response.json()) as SiteverifyResponse;
    } catch (error) {
      logger.error("Turnstile verification request failed", { error: serializeError(error) });
      throw new TurnstileUnavailableError();
    }

    if (result.success) {
      return;
    }

    const errorCodes = result["error-codes"] ?? [];
    if (errorCodes.some((code) => SERVER_ERROR_CODES.includes(code))) {
      logger.error("Turnstile siteverify configuration error", { errorCodes });
      throw new TurnstileUnavailableError();
    }

    logger.warn("Turnstile token rejected", { errorCodes });
    throw new TurnstileVerificationError();
  }
}

const SERVER_ERROR_CODES = ["missing-input-secret", "invalid-input-secret", "internal-error"];

const logger = Logger.for(TurnstileService);
