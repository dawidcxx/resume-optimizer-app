import { Code, Heading, Link, Text } from "@/ui";
import { DemoBlock, DemoPage } from "../DemoPage";

export function TypographyDemo() {
  return (
    <DemoPage
      title="Typography"
      description="Inter for interface copy, Source Serif 4 for document prose, and IBM Plex Mono for data. Fonts load asynchronously with a preconnect and a system fallback."
    >
      <DemoBlock title="Headings">
        <div className="space-y-3">
          <Heading level={1}>Heading one</Heading>
          <Heading level={2}>Heading two</Heading>
          <Heading level={3}>Heading three</Heading>
          <Heading level={4}>Heading four</Heading>
        </div>
      </DemoBlock>

      <DemoBlock title="Text variants">
        <div className="space-y-3">
          <Text variant="lead">
            Lead — a slightly larger, muted introduction used at the top of a section.
          </Text>
          <Text variant="body">
            Body — the default paragraph style. It is set at 14px with relaxed leading so dense
            screens stay readable without becoming airy.
          </Text>
          <Text variant="muted">Muted — secondary supporting copy.</Text>
          <Text variant="subtle">Subtle — captions, timestamps, metadata.</Text>
          <Text variant="mono">mono — 0123456789 · const value = true;</Text>
        </div>
      </DemoBlock>

      <DemoBlock title="Inline">
        <Text>
          Use <Code>Code</Code> for inline tokens and{" "}
          <Link href="https://tailwindcss.com">links</Link> for navigation. Paths such as{" "}
          <Code>src/ui/Button.tsx</Code> read cleanly inline.
        </Text>
      </DemoBlock>

      <DemoBlock title="Serif prose" note="document-like">
        <article className="max-w-prose">
          <Heading level={2} className="mb-2">
            On useful interfaces
          </Heading>
          <Text variant="serif">
            Good tools stay out of the way. A dense, predictable layout lets the work — the resume,
            the diff, the decision — take centre stage. Serif prose is reserved for reading, while
            the interface itself remains in a neutral sans so the two never compete.
          </Text>
        </article>
      </DemoBlock>
    </DemoPage>
  );
}