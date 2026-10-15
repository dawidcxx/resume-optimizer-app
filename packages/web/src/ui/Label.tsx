import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type LabelProps = ComponentPropsWithRef<"label"> & {
  required?: boolean;
};

export function Label({ required = false, className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-medium leading-none text-foreground select-none",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-danger">
          *
        </span>
      )}
    </label>
  );
}
