import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Label } from "../Label";
import { Text } from "../Typography";

export type FieldProps = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function Field({
  id,
  label,
  description,
  error,
  required = false,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
      {error ? (
        <Text variant="subtle" className="text-danger">
          {error}
        </Text>
      ) : description ? (
        <Text variant="subtle">{description}</Text>
      ) : null}
    </div>
  );
}
