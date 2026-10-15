import { List, ListItem, OrderedList, Text, UnorderedList } from "@/ui";
import { DemoBlock, DemoPage } from "../DemoPage";

export function ListDemo() {
  return (
    <DemoPage
      title="List"
      description="Ordered and unordered lists share the same density and marker treatment. Compose them with ListItem."
    >
      <DemoBlock title="Unordered">
        <UnorderedList>
          <ListItem>Parsing and normalization</ListItem>
          <ListItem>Keyword coverage</ListItem>
          <ListItem>Tone and readability</ListItem>
        </UnorderedList>
      </DemoBlock>

      <DemoBlock title="Ordered">
        <OrderedList>
          <ListItem>Paste the job description</ListItem>
          <ListItem>Upload the current resume</ListItem>
          <ListItem>Review the generated suggestions</ListItem>
        </OrderedList>
      </DemoBlock>

      <DemoBlock title="Generic List" note="ordered prop">
        <List ordered>
          <ListItem>One component, two semantics</ListItem>
          <ListItem>
            Nested lists keep their own marker
            <List>
              <ListItem>disc marker</ListItem>
              <ListItem>tight spacing</ListItem>
            </List>
          </ListItem>
        </List>
      </DemoBlock>

      <DemoBlock title="Rich content">
        <UnorderedList>
          <ListItem>
            <Text variant="body" className="font-medium">
              Senior Frontend Engineer
            </Text>
            <Text variant="subtle">8+ years · React, TypeScript, design systems</Text>
          </ListItem>
          <ListItem>
            <Text variant="body" className="font-medium">
              Staff Software Engineer
            </Text>
            <Text variant="subtle">Platform, tooling, performance</Text>
          </ListItem>
        </UnorderedList>
      </DemoBlock>
    </DemoPage>
  );
}
