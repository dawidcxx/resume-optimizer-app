import { afterEach, describe, expect, it } from "bun:test";
import { Config } from "./Config";

const previousNodeEnv = process.env["NODE_ENV"];

afterEach(() => {
  if (previousNodeEnv === undefined) {
    delete process.env["NODE_ENV"];
  } else {
    process.env["NODE_ENV"] = previousNodeEnv;
  }
});

describe("Config", () => {
  it("rejects Cloudflare's test secret in production", () => {
    process.env["NODE_ENV"] = "production";
    const config = new Config({
      databaseUrl: "postgresql://localhost/test",
      deepseekApiKey: "test-key",
      turnstileSiteKey: "real-site-key",
      turnstileSecretKey: "1x0000000000000000000000000000000AA",
    });

    expect(() => config.checkConfig()).toThrow("TURNSTILE_SECRET_KEY must use a production key");
  });

  it("rejects Cloudflare's test sitekey in production", () => {
    process.env["NODE_ENV"] = "production";
    const config = new Config({
      databaseUrl: "postgresql://localhost/test",
      deepseekApiKey: "test-key",
      turnstileSiteKey: "1x00000000000000000000AA",
      turnstileSecretKey: "real-secret-key",
    });

    expect(() => config.checkConfig()).toThrow("VITE_TURNSTILE_SITE_KEY must use a production key");
  });
});
