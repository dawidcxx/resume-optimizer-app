import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";

export type StatsProps = ResumeComponentProps<"Stats"> & {
  children?: ReactNode;
};

export function Stats({ children }: StatsProps) {
  return <div className="flex min-w-0 flex-wrap gap-2 print:break-inside-avoid">{children}</div>;
}