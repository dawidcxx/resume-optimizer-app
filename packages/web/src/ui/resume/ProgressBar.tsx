import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { useResumeTheme } from "./theme";

export type ProgressBarProps = ResumeComponentProps<"ProgressBar">;

export function ProgressBar({ label, value, max, color }: ProgressBarProps) {
  const theme = useResumeTheme();
  const numericMax = Math.max(Number.parseInt(max, 10), 1);
  const numericValue = Math.min(Math.max(Number.parseInt(value, 10), 0), numericMax);
  const percent = Math.round((numericValue / numericMax) * 100);

  return (
    <div className="grid min-w-0 gap-1 text-[10px]">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <span className="min-w-0 [overflow-wrap:anywhere]" style={{ color: theme.text }}>
          {label}
        </span>
        <span className="shrink-0 tabular-nums" style={{ color: theme.muted }}>
          {percent}%
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full"
        style={{ backgroundColor: `color-mix(in srgb, ${theme.muted} 20%, transparent)` }}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={numericMax}
        aria-valuenow={numericValue}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color ?? theme.accent }}
        />
      </div>
    </div>
  );
}
