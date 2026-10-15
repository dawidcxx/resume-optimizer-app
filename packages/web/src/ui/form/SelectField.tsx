import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { Label, Select, type SelectProps } from "@/ui";
import { FieldMessages } from "./FieldMessages";
import { useFieldStatus } from "./field";

export type SelectFieldProps<TValue extends string = string> = Omit<
  SelectProps<TValue>,
  "value" | "onChange" | "onBlur" | "id" | "name"
> & {
  field: AnyFieldApi;
  label: ReactNode;
  description?: ReactNode;
  required?: boolean;
};

export function SelectField<TValue extends string = string>({
  field,
  label,
  description,
  required = false,
  ...selectProps
}: SelectFieldProps<TValue>) {
  const { messages, showErrors, showValidating } = useFieldStatus(field);

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={field.name} required={required}>
        {label}
      </Label>
      <Select
        {...selectProps}
        id={field.name}
        name={field.name}
        invalid={showErrors}
        value={field.state.value}
        onChange={(next) => field.handleChange(next)}
        onBlur={field.handleBlur}
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
