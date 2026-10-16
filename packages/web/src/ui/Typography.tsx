import type { ComponentPropsWithRef, ElementType } from "react";
import { cn } from "@/lib/cn";

const headingTags = { 1: "h1", 2: "h2", 3: "h3", 4: "h4" } as const;

const headingClasses = {
  1: "text-3xl font-semibold tracking-tight",
  2: "text-2xl font-semibold tracking-tight",
  3: "text-lg font-semibold",
  4: "text-sm font-semibold",
} as const;

export type HeadingLevel = keyof typeof headingClasses;

export type HeadingProps = ComponentPropsWithRef<"h1"> & {
  level?: HeadingLevel;
  as?: ElementType;
};

export function Heading({ level = 2, as, className, ...props }: HeadingProps) {
  const Component = as ?? headingTags[level];
  return (
    <Component
      className={cn("font-sans text-balance text-foreground", headingClasses[level], className)}
      {...props}
    />
  );
}

const textClasses = {
  body: "text-sm leading-relaxed",
  lead: "text-base leading-relaxed text-muted-foreground",
  muted: "text-sm leading-relaxed text-muted-foreground",
  subtle: "text-xs leading-relaxed text-muted-foreground",
  serif: "font-serif text-[15px] leading-relaxed",
  mono: "font-mono text-xs leading-relaxed",
} as const;

export type TextVariant = keyof typeof textClasses;

export type TextProps = ComponentPropsWithRef<"p"> & {
  variant?: TextVariant;
  as?: ElementType;
};

export function Text({ variant = "body", as: Component = "p", className, ...props }: TextProps) {
  return (
    <Component className={cn("text-foreground", textClasses[variant], className)} {...props} />
  );
}

export function Code({ className, ...props }: ComponentPropsWithRef<"code">) {
  return (
    <code
      className={cn(
        "rounded-[3px] bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function Link({ className, ...props }: ComponentPropsWithRef<"a">) {
  return (
    <a
      className={cn("font-medium text-primary underline-offset-2 hover:underline", className)}
      {...props}
    />
  );
}