import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  DEFAULT_RESUME_THEME,
  FONT_FAMILIES,
  ResumeThemeProvider,
  type ResumeTheme,
} from "./theme";

export type ResumeProps = ResumeComponentProps<"Resume"> & {
  children?: ReactNode;
};

export function Resume({ children, ...props }: ResumeProps) {
  const theme: ResumeTheme = { ...DEFAULT_RESUME_THEME, ...props };
  const style = {
    backgroundColor: theme.background,
    color: theme.text,
    fontFamily: FONT_FAMILIES[theme.font],
    "--resume-accent": theme.accent,
    "--resume-muted": theme.muted,
    "--resume-heading-font": FONT_FAMILIES[theme.headingFont],
  } as CSSProperties;

  return (
    <ResumeThemeProvider value={theme}>
      <article
        aria-label="Rendered resume"
        style={style}
        className={cn(
          "@container mx-auto w-full min-w-0 max-w-[210mm] rounded-sm border border-border shadow-sm",
          theme.density === "compact" && "px-8 py-7",
          theme.density === "comfortable" && "px-10 py-9",
          theme.density === "airy" && "px-12 py-11",
        )}
      >
        <div className={cn("grid min-w-0", densityGap(theme.density))}>{children}</div>
      </article>
    </ResumeThemeProvider>
  );
}

function densityGap(density: ResumeTheme["density"]): string {
  switch (density) {
    case "compact":
      return "gap-3";
    case "airy":
      return "gap-6";
    default:
      return "gap-5";
  }
}
