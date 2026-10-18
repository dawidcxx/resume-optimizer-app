import { Link } from "wouter";
import { Heading, Text } from "@/ui";

export function NotFoundPage() {
  return (
    <div>
      <Heading level={2}>Page not found</Heading>
      <Text variant="muted" className="mt-2">
        The page you were looking for doesn't exist.
      </Text>
      <Link href="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
        Back to resumes
      </Link>
    </div>
  );
}
