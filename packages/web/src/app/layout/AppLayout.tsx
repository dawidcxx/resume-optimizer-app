import type { ReactNode } from "react";
import { Link } from "wouter";
import { ThemeSwitcher } from "@/ui";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="shrink-0 border-b border-border bg-surface px-6">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-ui bg-primary text-[11px] font-semibold text-primary-foreground">
              R
            </span>
            <span className="text-sm font-medium">Resume Optimizer</span>
          </Link>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 bg-subtle">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
