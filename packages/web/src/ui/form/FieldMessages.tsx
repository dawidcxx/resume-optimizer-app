import type { ReactNode } from "react";
import { Text } from "@/ui";

export function FieldMessages({
  description,
  messages,
  showErrors,
  showValidating,
}: {
  description?: ReactNode;
  messages: string[];
  showErrors: boolean;
  showValidating: boolean;
}) {
  if (showValidating) {
    return <Text variant="subtle">Checking…</Text>;
  }
  if (showErrors) {
    return (
      <Text variant="subtle" className="text-danger">
        {messages[0]}
      </Text>
    );
  }
  if (description) {
    return <Text variant="subtle">{description}</Text>;
  }
  return null;
}