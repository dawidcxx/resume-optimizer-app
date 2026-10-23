import type { ResumeComponentProps } from "@resume-optimzer-app/common";

export type SpacerProps = ResumeComponentProps<"Spacer">;

const HEIGHTS = {
  xs: "h-1",
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
  xl: "h-8",
} as const;

export function Spacer({ size }: SpacerProps) {
  return <div aria-hidden="true" className={HEIGHTS[size]} />;
}