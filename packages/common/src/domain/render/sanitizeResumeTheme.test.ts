import { describe, expect, it } from "bun:test";
import { sanitizeResumeTheme } from "./sanitizeResumeTheme";

describe("sanitizeResumeTheme", () => {
  it("drops theme props that would fail validation", () => {
    expect(
      sanitizeResumeTheme(
        '<Resume font="jetbrains-mono" headingFont="fraunces" accent="pink" density="tight"><Header name="Ada" /></Resume>',
      ),
    ).toBe('<Resume headingFont="fraunces"><Header name="Ada" /></Resume>');
  });

  it("leaves valid theme props alone", () => {
    const markup =
      '<Resume font="inter" headingFont="jetbrains-mono" accent="#112233" density="compact" />';
    expect(sanitizeResumeTheme(markup)).toBe(markup);
  });
});