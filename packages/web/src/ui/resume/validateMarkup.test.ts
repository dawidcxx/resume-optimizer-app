import { describe, expect, it } from "vitest";
import { validateResumeMarkup } from "./validateMarkup";

describe("validateResumeMarkup", () => {
  it("accepts a valid resume document", () => {
    const markup = `<Resume accent="#e88ab5" background="#fff9f9" text="#2e2a2b" muted="#8a7f82" font="serif" headingFont="serif" density="comfortable">
      <Header name="Ada Lovelace" title="Mathematician" email="ada@example.com" />
      <Columns ratio="2:1">
        <Section title="Experience">
          <Entry title="Analyst" subtitle="Analytical Engines" meta="1842">
            Wrote the first algorithm.
          </Entry>
        </Section>
        <Section title="Skills">
          <Stars label="Mathematics" value="5" max="5" />
        </Section>
      </Columns>
    </Resume>`;

    expect(validateResumeMarkup(markup)).toBeNull();
  });

  it("accepts decimal star ratings and data tables", () => {
    const markup = `<Section title="Skills">
      <Stars label="React" value="3.5" max="5" format="stars-value" />
      <DataTable headers="Skill|Years" rows="React|6;TypeScript|5" />
    </Section>`;

    expect(validateResumeMarkup(markup)).toBeNull();
  });

  it("accepts custom body and heading fonts", () => {
    const markup = `<Resume font="source-serif-4" headingFont="fraunces"></Resume>`;

    expect(validateResumeMarkup(markup)).toBeNull();
  });

  it("rejects display fonts as the body font", () => {
    expect(validateResumeMarkup(`<Resume font="fraunces"></Resume>`)).toContain(
      "Invalid props",
    );
  });

  it("rejects script tags", () => {
    expect(validateResumeMarkup(`<script>alert("nope")</script>`)).toContain(
      "Unsupported component",
    );
  });

  it("rejects unknown components", () => {
    expect(validateResumeMarkup(`<Marquee>Hello</Marquee>`)).toContain(
      "Unsupported component",
    );
  });

  it("rejects invalid props", () => {
    expect(validateResumeMarkup(`<Resume accent="pink"></Resume>`)).toContain(
      "Invalid props",
    );
  });

  it("rejects children on components that do not accept them", () => {
    expect(validateResumeMarkup(`<Divider>oops</Divider>`)).toContain(
      "does not accept children",
    );
  });

  it("rejects styling props", () => {
    expect(validateResumeMarkup(`<Section title="Experience" className="foo" />`)).toContain(
      "Invalid props",
    );
  });
});
