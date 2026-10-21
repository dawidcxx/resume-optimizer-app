import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useResumeTheme } from "./theme";

export type ResumeTextProps = ResumeComponentProps<"Text"> & {
  children?: ReactNode;
};

const SIZE_CLASSES = {
  xs: "text-[10px]",
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
} as const;

const WEIGHT_CLASSES = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

const ALIGN_CLASSES = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function ResumeText({
  size,
  weight,
  align,
  color,
  background,
  children,
}: ResumeTextProps) {
  const theme = useResumeTheme();
  const verticalInset = "0.375rem";
  const horizontalInset =
    "min(0.25rem, calc(var(--resume-column-gap, 1rem) / 2))";
  const style: CSSProperties = {
    color: color ?? theme.text,
    backgroundColor: background,
    ...(background
      ? {
          borderRadius: "0.25rem",
          marginInline: `calc(-1 * ${horizontalInset})`,
          paddingBlock: verticalInset,
          paddingInline: horizontalInset,
        }
      : {}),
  };

  return (
    <div
      className={cn(
        "min-w-0 leading-relaxed [overflow-wrap:anywhere]",
        SIZE_CLASSES[size],
        WEIGHT_CLASSES[weight],
        ALIGN_CLASSES[align],
      )}
      style={style}
    >
      {children}
    </div>
  );
}
