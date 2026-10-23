import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { useResumeTheme } from "./theme";

export type StatProps = ResumeComponentProps<"Stat">;

export function Stat({ value, label, accent, background }: StatProps) {
  const theme = useResumeTheme();
  const color = accent ?? theme.accent;

  return (
    <div
      className="grid min-w-0 flex-1 basis-24 content-start gap-0.5 rounded border px-2 py-1.5 print:break-inside-avoid"
      style={{
        borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
        backgroundColor: background ?? `color-mix(in srgb, ${color} 7%, transparent)`,
      }}
    >
      <span
        className="text-base font-semibold leading-none [overflow-wrap:anywhere]"
        style={{ color, fontFamily: "var(--resume-heading-font)" }}
      >
        {value}
      </span>
      <span
        className="text-[9px] uppercase tracking-wide [overflow-wrap:anywhere]"
        style={{ color: theme.muted }}
      >
        {label}
      </span>
    </div>
  );
}