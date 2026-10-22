import {
  RESUME_FONT_CATALOG,
  type ResumeComponentProps,
} from "@resume-optimzer-app/common";
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

const GENERIC_FONT_FAMILIES = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, monospace",
} as const;

export const FONT_FAMILIES = {
  ...GENERIC_FONT_FAMILIES,
  ...Object.fromEntries(
    Object.entries(RESUME_FONT_CATALOG).map(([id, font]) => [
      id,
      `"${font.cssFamily}", ${GENERIC_FONT_FAMILIES[font.fallback]}`,
    ]),
  ),
} as Record<ResumeTheme["font"] | ResumeTheme["headingFont"], string>;

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
