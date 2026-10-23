import { describe, expect, it } from "bun:test";
import type { ImportedResume } from "@resume-optimzer-app/common";
import { buildRenderChatMessages, parseRenderChatText } from "./DeepseekLlmService";
import type { ReviseResumeInput } from "./LlmService";

const resume: ImportedResume = {
  fullName: "Ada Lovelace",
  careerName: "Software Engineer",
  aboutMe: "Builds reliable systems.",
  contact: {
    email: "ada@example.com" as ImportedResume["contact"]["email"],
    phone: "",
    address: { line1: "", line2: "" },
    socials: [],
    website: "",
  },
  experience: [],
  education: [],
  skills: { listed: [], categorized: [] },
  projects: [],
};

const input: ReviseResumeInput = {
  resume,
  annotations: {
    "experience[0].role": "Use a more senior title.",
    "experience[1].role": "Keep this private.",
  },
  aiInstructions: "Warm and editorial.",
  targetJobDescription: "Senior platform engineer.",
  initialMarkup: '<Resume density="compact"><Header name="Ada" /></Resume>',
  messages: [
    { role: "user", content: "Hide education dates.", markup: null },
    {
      role: "assistant",
      content: "Removed the education dates.",
      markup:
        '<Resume density="compact"><Header name="Ada" /><Section title="Education" /></Resume>',
    },
    { role: "user", content: "Reword the summary.", markup: null },
  ],
};

function textAt(index: number): string {
  const message = buildRenderChatMessages(input)[index];
  if (!message || typeof message.content !== "string") {
    throw new Error("Expected a text message.");
  }
  return message.content;
}

describe("buildRenderChatMessages", () => {
  it("keeps the stable context and first request in one user message", () => {
    const content = textAt(0);

    expect(content).toContain("Resume data:");
    expect(content).toContain('"fullName": "Ada Lovelace"');
    expect(content).toContain("Hide education dates.");
    expect(content).toContain("Initial rendered markup:");
    expect(content).toContain(input.initialMarkup);
    expect(content).toContain("Original AI instructions:");
    expect(content).toContain("Warm and editorial.");
    expect(content).toContain("Target job description:");
    expect(content).toContain("Senior platform engineer.");
  });

  it("sorts annotations for a stable prefix", () => {
    const content = textAt(0);

    expect(content.indexOf("experience[0].role")).toBeLessThan(
      content.indexOf("experience[1].role"),
    );
  });

  it("serializes prior assistant revisions with their full markup", () => {
    const content = textAt(1);

    expect(content).toContain("Removed the education dates.");
    expect(content).toContain("Updated resume markup:");
    expect(content).toContain(input.messages[1]?.markup ?? "");
  });

  it("appends later user messages unchanged", () => {
    expect(textAt(2)).toBe("Reword the summary.");
  });

  it("builds the identical history on every call", () => {
    expect(buildRenderChatMessages(input)).toEqual(buildRenderChatMessages(input));
  });
});

describe("parseRenderChatText", () => {
  it("parses the reply and replacement markup blocks", () => {
    expect(
      parseRenderChatText(`<reply> Tightened the layout. </reply>
<markup>
<Resume density="compact"><Header name="Ada" /></Resume>
</markup>`),
    ).toEqual({
      reply: "Tightened the layout.",
      markup: '<Resume density="compact"><Header name="Ada" /></Resume>',
    });
  });

  it("falls back to raw markup and rejects empty output", () => {
    expect(parseRenderChatText("   ")).toBeNull();
    expect(parseRenderChatText("not markup")).toBeNull();
    expect(parseRenderChatText('<Resume><Header name="Ada" /></Resume>')).toEqual({
      reply: "Updated the render.",
      markup: '<Resume><Header name="Ada" /></Resume>',
    });
  });
});