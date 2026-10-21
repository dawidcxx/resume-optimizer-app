import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";
import { useResumeTheme } from "./theme";

export type TimelineItemProps = ResumeComponentProps<"TimelineItem"> & {
  children?: ReactNode;
};

export function TimelineItem({ title, meta, accent, children }: TimelineItemProps) {
  const theme = useResumeTheme();

  return (
    <section className="relative grid min-w-0 gap-1 print:break-inside-avoid">
      <span
        aria-hidden="true"
        className="absolute -left-[1.32rem] top-1.5 h-2 w-2 rounded-full"
        style={{ backgroundColor: accent ?? theme.accent }}
      />
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
      {children ? (
        <div className="min-w-0 text-[11px] leading-relaxed [overflow-wrap:anywhere]">
          {children}
        </div>
      ) : null}
    </section>
  );
}
