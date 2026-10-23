import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { useResumeTheme } from "./theme";

export type DividerProps = ResumeComponentProps<"Divider">;

const WEIGHT_VALUES = {
  thin: "1px",
  medium: "2px",
  thick: "3px",
} as const;

export function Divider({ color, weight }: DividerProps) {
  const theme = useResumeTheme();

  return (
    <hr
      className="border-0 border-t"
      style={{
        borderColor: color ?? theme.accent,
        borderTopWidth: WEIGHT_VALUES[weight],
        opacity: 0.5,
      }}
    />
  );
}