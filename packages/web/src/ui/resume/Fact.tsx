import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { useResumeTheme } from "./theme";

export type FactProps = ResumeComponentProps<"Fact">;

export function Fact({ label, value, accent }: FactProps) {
  const theme = useResumeTheme();

  return (
    <div
      className="grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-baseline gap-x-3 border-b py-0.5 text-[10px]"
      style={{
        borderColor: `color-mix(in srgb, ${theme.muted} 25%, transparent)`,
      }}
    >
      <span
        className="min-w-0 uppercase tracking-wide [overflow-wrap:anywhere]"
        style={{ color: theme.muted }}
      >
        {label}
      </span>
      <span
        className="min-w-0 text-right font-medium [overflow-wrap:anywhere]"
        style={{ color: accent ?? theme.text }}
      >
        {value}
      </span>
    </div>
  );
}
