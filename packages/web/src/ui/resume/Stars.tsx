import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { useResumeTheme } from "./theme";

export type StarsProps = ResumeComponentProps<"Stars">;

export function Stars({ value, max, color, label }: StarsProps) {
  const theme = useResumeTheme();
  const total = Math.min(Math.max(Number.parseInt(max, 10), 1), 10);
  const filled = Math.min(Math.max(Number.parseInt(value, 10), 0), total);

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px]">
      {label ? (
        <span className="min-w-0 [overflow-wrap:anywhere]" style={{ color: theme.text }}>
          {label}
        </span>
      ) : null}
      <span
        className="shrink-0 whitespace-nowrap"
        aria-label={`${filled} out of ${total}`}
        style={{ color: color ?? theme.accent }}
      >
        {Array.from({ length: total }, (_, index) => (
          <span key={index}>{index < filled ? "★" : "☆"}</span>
        ))}
      </span>
    </div>
  );
}
