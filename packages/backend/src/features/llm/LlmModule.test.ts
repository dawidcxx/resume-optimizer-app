import { describe, expect, it } from "bun:test";
import { Container } from "@needle-di/core";
import { Config } from "@/shared/Config";
import { DeepseekLlmService } from "./DeepseekLlmService";
import { LlmService } from "./LlmService";
import { llmModule } from "./LlmModule";

describe("llmModule", () => {
  it("resolves LlmService to the default DeepSeek implementation", () => {
    const container = new Container();
    container.bind(Config);
    container.bindAll(llmModule);

    expect(container.get(LlmService)).toBeInstanceOf(DeepseekLlmService);
  });
});
