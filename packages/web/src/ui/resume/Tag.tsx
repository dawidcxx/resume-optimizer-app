import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";
import { useResumeTheme } from "./theme";

export type TagProps = ResumeComponentProps<"Tag"> & {
  children?: ReactNode;
};

export function Tag({ accent, background, children }: TagProps) {
  const theme = useResumeTheme();
  const color = accent ?? theme.accent;

  return (
    <span
      className="inline-block max-w-full rounded-full border px-2 py-0.5 align-top text-[10px] font-medium leading-snug [overflow-wrap:anywhere]"
      style={{ borderColor: color, color, backgroundColor: background }}
    >
      {children}
    </span>
  );
}
