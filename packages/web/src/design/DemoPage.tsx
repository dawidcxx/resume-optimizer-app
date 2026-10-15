import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Heading, Text } from "@/ui";

export function DemoPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-8">
      <header className="mb-8 border-b border-border pb-4">
        <Heading level={1}>{title}</Heading>
        {description && (
          <Text variant="muted" className="mt-1 max-w-prose">
            {description}
          </Text>
        )}
      </header>
      <div className="space-y-10">{children}</div>
    </article>
  );
}

export function DemoBlock({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-2">
        <Heading level={3}>{title}</Heading>
        {note && <Text variant="subtle">{note}</Text>}
      </div>
      {children}
    </section>
  );
}

export function DemoRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>;
}
