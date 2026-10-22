import { Field, type FieldProps } from "@/ui/form";
import { AnnotationPopover } from "./AnnotationPopover";

export type AnnotatedFieldProps = Omit<FieldProps, "action"> & {
  annotationPath: string;
};

export function AnnotatedField({
  annotationPath,
  ...fieldProps
}: AnnotatedFieldProps) {
  const label =
    typeof fieldProps.label === "string" ? fieldProps.label : "this field";

  return (
    <Field
      {...fieldProps}
      action={
        <div className="flex h-6 items-center">
          <AnnotationPopover path={annotationPath} label={label} />
        </div>
      }
    />
  );
}
