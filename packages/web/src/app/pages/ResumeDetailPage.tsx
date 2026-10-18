import { isUuid } from "@resume-optimzer-app/common";
import { Link, useParams } from "wouter";
import { useResumeBundle } from "@/store";
import { Heading, Text } from "@/ui";

export function ResumeDetailPage() {
  const { id } = useParams<"/resume/:id">();
  const bundle = useResumeBundle(isUuid(id) ? id : "");

  if (!bundle) {
    return (
      <div>
        <Heading level={2}>Resume not found</Heading>
        <Text variant="muted" className="mt-2">
          This resume doesn't exist on this device.
        </Text>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to resumes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        ← Back to resumes
      </Link>
      <Heading level={2} className="mt-2">
        {bundle.project.name}
      </Heading>
      <pre className="mt-4 overflow-x-auto rounded-ui border border-border bg-subtle p-4 font-mono text-xs">
        {JSON.stringify(bundle, null, 2)}
      </pre>
    </div>
  );
}
