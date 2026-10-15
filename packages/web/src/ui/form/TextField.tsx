import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Input, Label } from "@/ui";
import { FieldMessages } from "./FieldMessages";
import { useFieldStatus } from "./field";

export type TextFieldProps = Omit<
  ComponentPropsWithRef<"input">,
  "value" | "defaultValue" | "onChange" | "onBlur" | "id" | "name"
> & {
  field: AnyFieldApi;
  label: ReactNode;
  description?: ReactNode;
  required?: boolean;
};

export function TextField({
  field,
  label,
  description,
  required = false,
  ...inputProps
}: TextFieldProps) {
  const { messages, showErrors, showValidating } = useFieldStatus(field);

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={field.name} required={required}>
        {label}
      </Label>
      <Input
        {...inputProps}
        id={field.name}
        name={field.name}
        aria-required={required || undefined}
        invalid={showErrors}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      <FieldMessages
        description={description}
        messages={messages}
        showErrors={showErrors}
        showValidating={showValidating}
      />
    </div>
  );
}
