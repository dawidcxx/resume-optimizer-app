import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";

export type TagListProps = ResumeComponentProps<"TagList"> & {
  children?: ReactNode;
};

export function TagList({ children }: TagListProps) {
  return <div className="flex min-w-0 flex-wrap gap-1.5 print:break-inside-avoid">{children}</div>;
}