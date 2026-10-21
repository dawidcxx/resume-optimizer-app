import { Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from "@/ui";

export type StepPlaceholderProps = {
  title: string;
  description: string;
  children: string;
};

export function StepPlaceholder({ title, description, children }: StepPlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-52 place-items-center rounded-ui border border-dashed border-border-strong bg-subtle p-6 text-center">
          <Text variant="muted" className="max-w-sm">
            {children}
          </Text>
        </div>
      </CardContent>
    </Card>
  );
}
