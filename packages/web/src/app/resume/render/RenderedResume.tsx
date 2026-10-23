import { RESUME_COMPONENT_SPEC } from "@resume-optimzer-app/common";
import { Markdown, parser, RuleType, type MarkdownToJSX } from "markdown-to-jsx";
import type { ReactNode } from "react";
import { parse } from "valibot";
import {
  DEFAULT_RESUME_THEME,
  Resume,
  resumeComponentOverrides,
  validateResumeMarkup,
} from "@/ui/resume";
import { normalizeMarkup } from "./normalizeMarkup";

type MarkdownProps = {
  children?: ReactNode;
} & Record<string, unknown>;

function MarkdownWrapper({ children }: { children?: ReactNode }) {
  return <div className="grid min-w-0 gap-4">{children}</div>;
}

function getResumeRoot(markup: string): {
  attrs: Record<string, unknown>;
  innerMarkup: string;
} | null {
  const nodes = parser(markup);
  const root = nodes.find(
    (node): node is MarkdownToJSX.HTMLNode | MarkdownToJSX.HTMLSelfClosingNode =>
      (node.type === RuleType.htmlBlock || node.type === RuleType.htmlSelfClosing) &&
      node.tag === "Resume",
  );

  if (!root) return null;

  const openTag = /<Resume\b[^>]*>/.exec(markup);
  if (!openTag) return null;

  const openEnd = openTag.index + openTag[0].length;
  const closeStart = markup.lastIndexOf("</Resume>");
  const innerMarkup = closeStart >= openEnd ? markup.slice(openEnd, closeStart) : "";

  return {
    attrs: root.attrs ?? {},
    innerMarkup,
  };
}

const safeHref = (value: unknown): string | undefined => {
  return typeof value === "string" && /^https?:\/\//i.test(value) ? value : undefined;
};

const markdownOverrides: MarkdownToJSX.Overrides = {
  h1: ({ children }: MarkdownProps) => (
    <h1
      className="min-w-0 text-xl font-semibold tracking-tight [overflow-wrap:anywhere]"
      style={{ fontFamily: "var(--resume-heading-font)" }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }: MarkdownProps) => (
    <h2
      className="min-w-0 text-[13px] font-semibold uppercase tracking-[0.16em] [overflow-wrap:anywhere]"
      style={{ color: "var(--resume-accent)", fontFamily: "var(--resume-heading-font)" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: MarkdownProps) => (
    <h3
      className="min-w-0 text-xs font-semibold [overflow-wrap:anywhere]"
      style={{ fontFamily: "var(--resume-heading-font)" }}
    >
      {children}
    </h3>
  ),
  p: ({ children }: MarkdownProps) => (
    <p className="min-w-0 text-[11px] leading-relaxed [overflow-wrap:anywhere]">{children}</p>
  ),
  a: ({ href, children }: MarkdownProps) => {
    const safe = safeHref(href);
    return safe ? (
      <a
        href={safe}
        target="_blank"
        rel="noreferrer"
        className="[overflow-wrap:anywhere] underline decoration-[var(--resume-accent)] underline-offset-2"
      >
        {children}
      </a>
    ) : (
      <span>{children}</span>
    );
  },
  ul: ({ children }: MarkdownProps) => (
    <ul className="min-w-0 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed [overflow-wrap:anywhere]">
      {children}
    </ul>
  ),
  ol: ({ children }: MarkdownProps) => (
    <ol className="min-w-0 list-decimal space-y-0.5 pl-4 text-[11px] leading-relaxed [overflow-wrap:anywhere]">
      {children}
    </ol>
  ),
  li: ({ children }: MarkdownProps) => <li className="min-w-0">{children}</li>,
  strong: ({ children }: MarkdownProps) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }: MarkdownProps) => <em className="italic">{children}</em>,
  blockquote: ({ children }: MarkdownProps) => (
    <blockquote
      className="min-w-0 border-l-2 pl-3 text-[11px] italic [overflow-wrap:anywhere]"
      style={{ borderColor: "var(--resume-accent)", color: "var(--resume-muted)" }}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      className="border-0 border-t"
      style={{ borderColor: "var(--resume-accent)", opacity: 0.4 }}
    />
  ),
  table: ({ children }: MarkdownProps) => (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-[10px]">{children}</table>
    </div>
  ),
  th: ({ children }: MarkdownProps) => (
    <th
      className="border-b px-2 py-1 text-left font-semibold [overflow-wrap:anywhere]"
      style={{ borderColor: "var(--resume-accent)" }}
    >
      {children}
    </th>
  ),
  td: ({ children }: MarkdownProps) => (
    <td
      className="border-b px-2 py-1 align-top [overflow-wrap:anywhere]"
      style={{ borderColor: "var(--resume-muted)" }}
    >
      {children}
    </td>
  ),
  code: ({ children }: MarkdownProps) => (
    <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.9em]">{children}</code>
  ),
  pre: ({ children }: MarkdownProps) => (
    <pre className="max-w-full overflow-x-auto rounded bg-black/5 p-2 font-mono text-[10px]">
      {children}
    </pre>
  ),
  img: () => null,
};

export function RenderedResume({ markup }: { markup: string }) {
  const normalizedMarkup = normalizeMarkup(markup);
  const error = validateResumeMarkup(normalizedMarkup);
  if (error) {
    return (
      <div className="grid min-h-52 place-items-center rounded-ui border border-dashed border-danger/40 bg-danger/5 p-6 text-center">
        <p className="max-w-md text-sm text-danger">{error}</p>
      </div>
    );
  }

  const root = getResumeRoot(normalizedMarkup);
  const theme = root ? parse(RESUME_COMPONENT_SPEC.Resume.props, root.attrs) : DEFAULT_RESUME_THEME;

  return (
    <Resume {...theme}>
      <Markdown
        options={{
          overrides: { ...resumeComponentOverrides, ...markdownOverrides },
          forceBlock: true,
          wrapper: MarkdownWrapper,
        }}
      >
        {root?.innerMarkup ?? normalizedMarkup}
      </Markdown>
    </Resume>
  );
}