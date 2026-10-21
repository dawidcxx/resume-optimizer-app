import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import type { ReactNode } from "react";
import { useResumeTheme } from "./theme";

export type HeaderProps = ResumeComponentProps<"Header"> & {
  children?: ReactNode;
};

export function Header({
  name,
  title,
  email,
  phone,
  website,
  location,
  children,
}: HeaderProps) {
  const theme = useResumeTheme();
  const contacts = [email, phone, location, website].filter((value) => value.length > 0);

  return (
    <header className="grid min-w-0 gap-1.5">
      <h1
        className="min-w-0 text-2xl font-semibold tracking-tight [overflow-wrap:anywhere]"
        style={{ fontFamily: "var(--resume-heading-font)" }}
      >
        {name}
      </h1>
      {title ? (
        <p
          className="min-w-0 text-xs font-medium [overflow-wrap:anywhere]"
          style={{ color: theme.accent }}
        >
          {title}
        </p>
      ) : null}
      {contacts.length > 0 || children ? (
        <div
          className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] [overflow-wrap:anywhere]"
          style={{ color: theme.muted }}
        >
          {contacts.map((value, index) => (
            <span key={`${value}-${index}`}>{value}</span>
          ))}
          {children}
        </div>
      ) : null}
    </header>
  );
}
