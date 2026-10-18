import type { ReactNode } from "react";
import { Link } from "wouter";
import { ThemeSwitcher } from "@/ui";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-ui bg-primary text-[10px] font-semibold text-primary-foreground">
            R
          </span>
          <span className="text-sm font-medium">Resume Optimizer</span>
        </Link>
        <ThemeSwitcher />
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl p-6">{children}</div>
      </main>
    </div>
  );
}
