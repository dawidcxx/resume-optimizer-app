import { RESUME_BODY_FONT_IDS, RESUME_HEADING_FONT_IDS } from "./resumeFonts";

const OPEN_RESUME = /<Resume\b([^>]*)>/;
const BODY_FONTS = new Set<string>(RESUME_BODY_FONT_IDS);
const HEADING_FONTS = new Set<string>(RESUME_HEADING_FONT_IDS);
const DENSITIES = new Set(["compact", "comfortable", "airy"]);
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function sanitizeResumeTheme(markup: string): string {
  return markup.replace(OPEN_RESUME, (_match, attrs: string) => {
    let next = attrs;
    next = dropInvalidAttr(next, "font", (value) => BODY_FONTS.has(value));
    next = dropInvalidAttr(next, "headingFont", (value) => HEADING_FONTS.has(value));
    next = dropInvalidAttr(next, "accent", (value) => HEX_COLOR.test(value));
    next = dropInvalidAttr(next, "background", (value) => HEX_COLOR.test(value));
    next = dropInvalidAttr(next, "text", (value) => HEX_COLOR.test(value));
    next = dropInvalidAttr(next, "muted", (value) => HEX_COLOR.test(value));
    next = dropInvalidAttr(next, "density", (value) => DENSITIES.has(value));
    return `<Resume${next}>`;
  });
}

function dropInvalidAttr(attrs: string, name: string, isValid: (value: string) => boolean): string {
  const pattern = new RegExp(`\\s+${name}\\s*=\\s*(["'])(.*?)\\1`);
  const match = pattern.exec(attrs);
  if (!match || isValid(match[2] ?? "")) return attrs;
  return attrs.replace(pattern, "");
}