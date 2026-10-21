import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DENSITY_GAPS, useResumeTheme } from "./theme";

export type SectionProps = ResumeComponentProps<"Section"> & {
  children?: ReactNode;
};

export function Section({ title, accent, background, children }: SectionProps) {
  const theme = useResumeTheme();
  const color = accent ?? theme.accent;
  const verticalInset = "0.375rem";
  const horizontalInset =
    "min(0.25rem, calc(var(--resume-column-gap, 1rem) / 2))";
  const style: CSSProperties | undefined = background
    ? {
        backgroundColor: background,
        borderRadius: "0.25rem",
        marginBlockStart: `calc(-1 * ${verticalInset})`,
        marginInline: `calc(-1 * ${horizontalInset})`,
        paddingBlock: verticalInset,
        paddingInline: horizontalInset,
      }
    : undefined;

  return (
    <section className="grid min-w-0 content-start gap-2.5" style={style}>
      {title ? (
        <div
          className="min-w-0 border-b pb-1 print:break-after-avoid"
          style={{ borderColor: color }}
        >
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.18em] [overflow-wrap:anywhere]"
            style={{ color, fontFamily: "var(--resume-heading-font)" }}
          >
            {title}
          </h2>
        </div>
      ) : null}
      <div className={cn("grid min-w-0", DENSITY_GAPS[theme.density])}>{children}</div>
    </section>
  );
}
