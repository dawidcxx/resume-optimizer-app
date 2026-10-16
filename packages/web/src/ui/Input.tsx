import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export const inputBase = [
  "flex w-full rounded-ui border border-border bg-background px-2.5 text-sm text-foreground",
  "transition-colors placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
  "disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted/50",
].join(" ");

export const inputSizes = {
  sm: "h-7 text-xs",
  md: "h-8 text-sm",
  lg: "h-9 text-sm",
} as const;

export type InputSize = keyof typeof inputSizes;

export type InputProps = ComponentPropsWithRef<"input"> & {
  inputSize?: InputSize;
  invalid?: boolean;
};

export function Input({ inputSize = "md", invalid = false, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        inputBase,
        inputSizes[inputSize],
        invalid && "border-danger focus-visible:border-danger focus-visible:ring-danger",
        className,
      )}
      {...props}
    />
  );
}