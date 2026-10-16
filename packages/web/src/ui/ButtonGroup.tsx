import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export function ButtonGroup({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center",
        "[&>*]:rounded-none [&>*:first-child]:rounded-l-ui [&>*:last-child]:rounded-r-ui",
        "[&>*:not(:first-child)]:-ml-px",
        className,
      )}
      {...props}
    />
  );
}