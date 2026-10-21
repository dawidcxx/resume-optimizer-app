import { describe, expect, it } from "vitest";
import { normalizeMarkup } from "./normalizeMarkup";

describe("normalizeMarkup", () => {
  it("expands self-closing resume components", () => {
    expect(normalizeMarkup(`<Stars label="React" value="5" max="5" />`)).toBe(
      `<Stars label="React" value="5" max="5"></Stars>`,
    );
  });

  it("leaves non-resume self-closing tags alone", () => {
    expect(normalizeMarkup(`<img src="x" />`)).toBe(`<img src="x" />`);
  });

  it("separates a component from a preceding paragraph", () => {
    expect(
      normalizeMarkup(
        `<Section title="Experience">\nText\n<Entry title="Role"></Entry>\n</Section>`,
      ),
    ).toBe(
      `<Section title="Experience">\nText\n\n<Entry title="Role"></Entry>\n</Section>`,
    );
  });

  it("unwraps BulletList so its items parse as markdown", () => {
    const normalized = normalizeMarkup(
      `<Entry title="Role">\nText\n<BulletList>\n- a\n- b\n</BulletList>\n</Entry>`,
    );

    expect(normalized).not.toContain("BulletList");
    expect(normalized).toContain("- a\n- b");
  });

  it("keeps stacked components on adjacent lines", () => {
    expect(
      normalizeMarkup(
        `<Section title="Skills">\n<TagList>\n<Tag>React</Tag>\n<Tag>TypeScript</Tag>\n</TagList>\n</Section>`,
      ),
    ).toBe(
      `<Section title="Skills">\n<TagList>\n<Tag>React</Tag>\n<Tag>TypeScript</Tag>\n</TagList>\n</Section>`,
    );
  });
});
