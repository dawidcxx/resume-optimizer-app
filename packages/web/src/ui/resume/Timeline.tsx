import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DENSITY_GAPS, useResumeTheme } from "./theme";

export type TimelineProps = ResumeComponentProps<"Timeline"> & {
  children?: ReactNode;
};

export function Timeline({ children }: TimelineProps) {
  const theme = useResumeTheme();

  return (
    <div
      className={cn(
        "relative ml-1.5 grid min-w-0 content-start border-l pl-4",
        DENSITY_GAPS[theme.density],
      )}
      style={{ borderColor: `color-mix(in srgb, ${theme.accent} 35%, transparent)` }}
    >
      {children}
    </div>
  );
}