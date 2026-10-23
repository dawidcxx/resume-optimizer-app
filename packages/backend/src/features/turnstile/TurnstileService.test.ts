import { describe, expect, it } from "bun:test";
import { Config } from "@/shared/Config";
import { TurnstileService, type FetchFn } from "./TurnstileService";
import { TurnstileUnavailableError } from "./TurnstileUnavailableError";
import { TurnstileVerificationError } from "./TurnstileVerificationError";

const config = new Config({ turnstileSecretKey: "test-secret" });

function responseFetch(result: unknown): FetchFn {
  return async (_input: string, init?: RequestInit) => {
    const body = new URLSearchParams(init?.body as URLSearchParams);
    expect(body.get("secret")).toBe("test-secret");
    expect(body.get("response")).toBe("test-token");
    return Response.json(result);
  };
}

describe("TurnstileService", () => {
  it("accepts a valid token", async () => {
    const service = new TurnstileService(config, responseFetch({ success: true }));

    await expect(service.verify("test-token")).resolves.toBeUndefined();
  });

  it("rejects a token Cloudflare rejects", async () => {
    const service = new TurnstileService(
      config,
      responseFetch({ success: false, "error-codes": ["invalid-input-response"] }),
    );

    await expect(service.verify("test-token")).rejects.toBeInstanceOf(
      TurnstileVerificationError,
    );
  });

  it("treats network failures as unavailable", async () => {
    const fetchFn: FetchFn = async () => {
      throw new Error("network down");
    };
    const service = new TurnstileService(config, fetchFn);

    await expect(service.verify("test-token")).rejects.toBeInstanceOf(TurnstileUnavailableError);
  });

  it("treats secret configuration errors as unavailable", async () => {
    const service = new TurnstileService(
      config,
      responseFetch({ success: false, "error-codes": ["invalid-input-secret"] }),
    );

    await expect(service.verify("test-token")).rejects.toBeInstanceOf(TurnstileUnavailableError);
  });
});
