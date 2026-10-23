import { injectable } from "@needle-di/core";
import { invariant, isNil } from "@resume-optimzer-app/common";
import { LOG_LEVELS, type LogLevel } from "@/lib/Logger";

@injectable()
export class Config {
  constructor(private readonly overridesMap: Partial<Config> = {}) {}

  public get ttlCacheSize(): number {
    return this.overridesMap.ttlCacheSize ?? 10000;
  }

  public get logLevel(): LogLevel {
    if (!isNil(this.overridesMap.logLevel)) {
      return this.overridesMap.logLevel;
    }
    const fromEnv = process.env["LOG_LEVEL"]?.toLowerCase();
    if (!isNil(fromEnv) && LOG_LEVELS.includes(fromEnv as LogLevel)) {
      return fromEnv as LogLevel;
    } else {
      return "debug";
    }
  }

  public get httpHost(): string {
    return this.overridesMap.httpHost ?? process.env["HOST"] ?? "0.0.0.0";
  }

  public get httpPort(): string {
    return this.overridesMap.httpPort ?? process.env["PORT"] ?? "8080";
  }

  public get maxRequestBodyBytes(): number {
    if (!isNil(this.overridesMap.maxRequestBodyBytes)) {
      return this.overridesMap.maxRequestBodyBytes;
    }
    const fromEnv = process.env["MAX_REQUEST_BODY_BYTES"];
    const parsed = isNil(fromEnv) ? NaN : Number.parseInt(fromEnv, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1024 * 1024;
  }

  public get corsOrigins(): string[] {
    if (!isNil(this.overridesMap.corsOrigins)) {
      return this.overridesMap.corsOrigins;
    }
    const fromEnv = process.env["CORS_ORIGINS"];
    if (isNil(fromEnv)) {
      return [];
    }
    return fromEnv
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  }

  public get fsStoragePath(): string {
    return this.overridesMap.fsStoragePath ?? process.env["FS_STORAGE_PATH"] ?? ".storage";
  }

  public get cronEnabled(): boolean {
    if (!isNil(this.overridesMap.cronEnabled)) {
      return this.overridesMap.cronEnabled;
    }
    const fromEnv = process.env["CRON_ENABLED"]?.trim().toLowerCase();
    if (isNil(fromEnv)) {
      return true;
    }
    return !["false", "0", "no", "off"].includes(fromEnv);
  }

  public get databaseUrl(): string {
    const url = this.overridesMap.databaseUrl ?? process.env["DATABASE_URL"];
    invariant(!isNil(url) && url.trim().length > 0, "DATABASE_URL is required");
    return url.trim();
  }

  public get deepseekApiKey(): string {
    const key = this.overridesMap.deepseekApiKey ?? process.env["DEEPSEEK_API_KEY"];
    invariant(
      !isNil(key) && key.trim().length > 0,
      "DEEPSEEK_API_KEY is required to use the LLM service",
    );
    return key.trim();
  }

  public get deepseekModel(): string {
    return this.overridesMap.deepseekModel ?? process.env["DEEPSEEK_MODEL"] ?? "deepseek-v4-flash";
  }

  public checkConfig(): void {
    const issues: string[] = [];

    const databaseUrl = this.overridesMap.databaseUrl ?? process.env["DATABASE_URL"];
    if (isNil(databaseUrl) || databaseUrl.trim().length === 0) {
      issues.push("DATABASE_URL is required");
    }

    const apiKey = this.overridesMap.deepseekApiKey ?? process.env["DEEPSEEK_API_KEY"];
    if (isNil(apiKey) || apiKey.trim().length === 0) {
      issues.push("DEEPSEEK_API_KEY is required to use the LLM service");
    }

    const port = Number.parseInt(this.httpPort, 10);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      issues.push(`PORT must be an integer between 1 and 65535 (received "${this.httpPort}")`);
    }

    if (this.httpHost.trim().length === 0) {
      issues.push("HOST must not be empty");
    }

    const logLevel = this.overridesMap.logLevel ?? process.env["LOG_LEVEL"];
    if (!isNil(logLevel) && !LOG_LEVELS.includes(logLevel.toLowerCase() as LogLevel)) {
      issues.push(`LOG_LEVEL must be one of: ${LOG_LEVELS.join(", ")}`);
    }

    const maxBodyBytes =
      this.overridesMap.maxRequestBodyBytes ?? process.env["MAX_REQUEST_BODY_BYTES"];
    if (!isNil(maxBodyBytes)) {
      const parsed = Number.parseInt(String(maxBodyBytes), 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        issues.push("MAX_REQUEST_BODY_BYTES must be a positive integer");
      }
    }

    const cronEnabled = this.overridesMap.cronEnabled ?? process.env["CRON_ENABLED"];
    if (
      typeof cronEnabled === "string" &&
      !CRON_ENABLED_VALUES.includes(cronEnabled.trim().toLowerCase())
    ) {
      issues.push(`CRON_ENABLED must be one of: ${CRON_ENABLED_VALUES.join(", ")}`);
    }

    if (this.fsStoragePath.trim().length === 0) {
      issues.push("FS_STORAGE_PATH must not be empty");
    }

    if (this.deepseekModel.trim().length === 0) {
      issues.push("DEEPSEEK_MODEL must not be empty");
    }

    if (issues.length > 0) {
      throw new Error(`Invalid configuration:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
    }
  }
}

const CRON_ENABLED_VALUES = ["true", "false", "1", "0", "yes", "no", "on", "off"];