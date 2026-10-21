import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { createContext, useContext } from "react";

export type ResumeTheme = ResumeComponentProps<"Resume">;

export const DEFAULT_RESUME_THEME: ResumeTheme = {
  accent: "#2563eb",
  background: "#ffffff",
  text: "#111827",
  muted: "#6b7280",
  font: "sans",
  headingFont: "serif",
  density: "comfortable",
};

export const FONT_FAMILIES = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, monospace",
} as const;

export const DENSITY_GAPS = {
  compact: "gap-2",
  comfortable: "gap-3",
  airy: "gap-4",
} as const;

const ResumeThemeContext = createContext<ResumeTheme>(DEFAULT_RESUME_THEME);

export const ResumeThemeProvider = ResumeThemeContext.Provider;

export function useResumeTheme(): ResumeTheme {
  return useContext(ResumeThemeContext);
}
