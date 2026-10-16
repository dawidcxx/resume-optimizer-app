import { Code, List, ListItem, Text } from "@/ui";
import { DemoBlock, DemoPage } from "../DemoPage";

export function OverviewDemo() {
  return (
    <DemoPage
      title="Overview"
      description="A dependency-free React UI layer. Styling is Tailwind v4 driven by CSS custom properties, with a light theme by default and an opt-in dark theme."
    >
      <DemoBlock title="Principles">
        <List>
          <ListItem>No third-party UI libraries — composition over configuration.</ListItem>
          <ListItem>
            Form-library agnostic. Controls forward refs and spread native attributes, so any form
            library can drive them.
          </ListItem>
          <ListItem>Desktop-first, dense, document-like defaults.</ListItem>
          <ListItem>
            Semantic tokens (<Code>bg-background</Code>, <Code>text-muted-foreground</Code>,{" "}
            <Code>border-border</Code>) that flip with the theme.
          </ListItem>
        </List>
      </DemoBlock>

      <DemoBlock title="Included" note="v0">
        <List>
          <ListItem>
            <Code>Button</Code>, <Code>IconButton</Code>, <Code>ButtonGroup</Code>
          </ListItem>
          <ListItem>
            <Code>Input</Code>, <Code>Label</Code>
          </ListItem>
          <ListItem>
            <Code>Heading</Code>, <Code>Text</Code>, <Code>Code</Code>, <Code>Link</Code>
          </ListItem>
          <ListItem>
            <Code>List</Code>, <Code>OrderedList</Code>, <Code>UnorderedList</Code>,{" "}
            <Code>ListItem</Code>
          </ListItem>
          <ListItem>
            <Code>Table</Code> and friends: <Code>TableHeader</Code>, <Code>TableRow</Code>,{" "}
            <Code>TableCell</Code>…
          </ListItem>
          <ListItem>
            <Code>ThemeProvider</Code>, <Code>useTheme</Code>, <Code>ThemeSwitcher</Code>
          </ListItem>
        </List>
      </DemoBlock>

      <DemoBlock title="Theming">
        <Text>
          Colors, radii and fonts are declared as CSS variables in <Code>:root</Code> and overridden
          under <Code>.dark</Code>. The dark variant is wired through Tailwind with{" "}
          <Code>@custom-variant dark</Code>, so utilities such as <Code>bg-background</Code> respond
          automatically. Use the switcher in the top bar to preview both themes.
        </Text>
      </DemoBlock>
    </DemoPage>
  );
}