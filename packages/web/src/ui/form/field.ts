import { useStore, type AnyFieldApi } from "@tanstack/react-form";

function errorText(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "";
}

export function useFieldStatus(field: AnyFieldApi) {
  const attempted = useStore(field.form.store, (state) => state.submissionAttempts > 0);
  const meta = field.state.meta;
  const messages = meta.errors.map(errorText).filter(Boolean);

  return {
    messages,
    showErrors: messages.length > 0 && (attempted || meta.isTouched || meta.isDirty),
    showValidating: meta.isValidating && (meta.isDirty || attempted),
  };
}