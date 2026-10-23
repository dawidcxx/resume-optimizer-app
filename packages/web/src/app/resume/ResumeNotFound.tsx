import { Link } from "wouter";
import { Heading, Text } from "@/ui";

export function ResumeNotFound() {
  return (
    <div>
      <Heading level={2}>Resume not found</Heading>
      <Text variant="muted" className="mt-2">
        This resume doesn't exist on this device.
      </Text>
      <Link href="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
        Back to resumes
      </Link>
    </div>
  );
}