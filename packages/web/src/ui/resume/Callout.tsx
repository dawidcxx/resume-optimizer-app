import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";
import { useResumeTheme } from "./theme";

export type CalloutProps = ResumeComponentProps<"Callout"> & {
  children?: ReactNode;
};

export function Callout({ title, accent, background, children }: CalloutProps) {
  const theme = useResumeTheme();
  const color = accent ?? theme.accent;

  return (
    <aside
      className="grid min-w-0 gap-1 border-l-2 py-2 pl-3 [overflow-wrap:anywhere] print:break-inside-avoid"
      style={{
        borderColor: color,
        backgroundColor: background ?? `color-mix(in srgb, ${color} 8%, transparent)`,
      }}
    >
      {title ? (
        <h3
          className="text-[11px] font-semibold uppercase tracking-wide"
          style={{ color, fontFamily: "var(--resume-heading-font)" }}
        >
          {title}
        </h3>
      ) : null}
      <div className="min-w-0 text-[11px] leading-relaxed">{children}</div>
    </aside>
  );
}