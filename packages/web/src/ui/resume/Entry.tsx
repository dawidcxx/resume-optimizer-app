import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";
import { useResumeTheme } from "./theme";

export type EntryProps = ResumeComponentProps<"Entry"> & {
  children?: ReactNode;
};

export function Entry({ title, subtitle, meta, accent, children }: EntryProps) {
  const theme = useResumeTheme();

  return (
    <article className="grid min-w-0 gap-1 print:break-inside-avoid">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3">
        <h3
          className="min-w-0 text-[13px] font-semibold [overflow-wrap:anywhere]"
          style={{ fontFamily: "var(--resume-heading-font)" }}
        >
          {title}
        </h3>
        {meta ? (
          <span
            className="min-w-0 text-right text-[10px] uppercase tracking-wide [overflow-wrap:anywhere]"
            style={{ color: theme.muted }}
          >
            {meta}
          </span>
        ) : null}
      </div>
      {subtitle ? (
        <p
          className="min-w-0 text-[11px] font-medium [overflow-wrap:anywhere]"
          style={{ color: accent ?? theme.accent }}
        >
          {subtitle}
        </p>
      ) : null}
      {children ? (
        <div className="min-w-0 text-[11px] leading-relaxed [overflow-wrap:anywhere]">
          {children}
        </div>
      ) : null}
    </article>
  );
}