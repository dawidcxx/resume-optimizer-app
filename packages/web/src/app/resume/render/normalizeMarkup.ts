import { RESUME_COMPONENT_SPEC } from "@resume-optimzer-app/common";

const SELF_CLOSING_COMPONENT =
  /<([A-Z][A-Za-z0-9]*)(\s(?:[^<>"']|"[^"]*"|'[^']*')*)?\/>/g;
const BULLET_LIST_TAG = /<\/?BulletList\s*>/g;
const OPENING_COMPONENT_LINE = /^\s*<([A-Z][A-Za-z0-9]*)\b/;
const ANY_COMPONENT_LINE = /^\s*<\/?([A-Z][A-Za-z0-9]*)\b/;
const FENCE_LINE = /^\s*```/;

function isResumeComponent(tag: string): boolean {
  return Object.hasOwn(RESUME_COMPONENT_SPEC, tag);
}

export function normalizeMarkup(markup: string): string {
  const expanded = markup.replace(
    SELF_CLOSING_COMPONENT,
    (match, tag: string, attrs = "") => {
      return isResumeComponent(tag)
        ? `<${tag}${attrs.trimEnd()}></${tag}>`
        : match;
    },
  );

  const lines: string[] = [];
  let inFence = false;

  for (const line of expanded.split("\n")) {
    if (FENCE_LINE.test(line)) {
      inFence = !inFence;
      lines.push(line);
      continue;
    }

    if (!inFence && OPENING_COMPONENT_LINE.test(line)) {
      const previous = lines.at(-1);
      const previousTrimmed = previous?.trim() ?? "";
      const previousIsComponent = ANY_COMPONENT_LINE.test(previous ?? "");

      if (previousTrimmed !== "" && !previousIsComponent) {
        lines.push("");
      }
    }

    lines.push(line);
  }

  return lines.join("\n").replace(BULLET_LIST_TAG, "\n");
}
