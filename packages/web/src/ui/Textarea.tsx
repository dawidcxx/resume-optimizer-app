import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export const textareaBase = [
  "flex w-full resize-y rounded-ui border border-border bg-background px-2.5 py-2 text-sm text-foreground",
  "transition-colors placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
  "disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted/50",
].join(" ");

export type TextareaProps = ComponentPropsWithRef<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({ invalid = false, className, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        textareaBase,
        invalid && "border-danger focus-visible:border-danger focus-visible:ring-danger",
        className,
      )}
      {...props}
    />
  );
}