import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DENSITY_GAPS, useResumeTheme } from "./theme";

export type ColumnProps = ResumeComponentProps<"Column"> & {
  children?: ReactNode;
};

export function Column({ children }: ColumnProps) {
  const theme = useResumeTheme();

  return (
    <div
      className={cn(
        "grid min-w-0 content-start [overflow-wrap:anywhere]",
        DENSITY_GAPS[theme.density],
      )}
    >
      {children}
    </div>
  );
}
