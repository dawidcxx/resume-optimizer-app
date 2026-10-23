import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";

export type BulletListProps = ResumeComponentProps<"BulletList"> & {
  children?: ReactNode;
};

export function BulletList({ children }: BulletListProps) {
  return (
    <div className="min-w-0 text-[11px] leading-relaxed [overflow-wrap:anywhere] [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-4">
      {children}
    </div>
  );
}