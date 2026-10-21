import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { Heading, Text } from "./Typography";

export function Card({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div className={cn("rounded-ui border border-border bg-surface", className)} {...props} />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 border-b border-border px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentPropsWithRef<"h3">) {
  return <Heading level={3} className={cn("text-base", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <Text variant="subtle" className={className} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}
