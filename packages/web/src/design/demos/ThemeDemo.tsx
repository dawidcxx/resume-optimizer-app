import { Code, Heading, Text, ThemeSwitcher, useTheme } from "@/ui";
import { DemoBlock, DemoPage, DemoRow } from "../DemoPage";

const tokens = [
  { name: "background", className: "bg-background" },
  { name: "surface", className: "bg-surface" },
  { name: "subtle", className: "bg-subtle" },
  { name: "muted", className: "bg-muted" },
  { name: "border", className: "bg-border" },
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "accent", className: "bg-accent" },
  { name: "danger", className: "bg-danger" },
  { name: "success", className: "bg-success" },
  { name: "warning", className: "bg-warning" },
];

export function ThemeDemo() {
  const { theme } = useTheme();

  return (
    <DemoPage
      title="Theme"
      description="ThemeProvider writes a class and color-scheme onto the document element and persists the choice to localStorage. Light is the default."
    >
      <DemoBlock title="Current theme">
        <DemoRow>
          <Text>
            Active: <Code>{theme}</Code>
          </Text>
          <ThemeSwitcher />
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Tokens" note="Tailwind utilities bound to CSS variables">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tokens.map((token) => (
            <div key={token.name} className="rounded-ui border border-border">
              <div className={`h-10 rounded-t-[3px] ${token.className}`} />
              <div className="border-t border-border px-2 py-1.5">
                <Text variant="subtle" className="font-mono">
                  {token.name}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="Usage">
        <Text>
          Wrap the app once, then read or mutate the theme anywhere with the <Code>useTheme</Code>{" "}
          hook. An inline script in <Code>design.html</Code> applies the stored theme before first
          paint to avoid a flash of the wrong theme.
        </Text>
        <Heading level={4} className="mt-4 mb-2">
          Layout tokens
        </Heading>
        <Text variant="muted">
          Radii default to <Code>4px</Code> via <Code>--radius-ui</Code>; fonts are exposed as{" "}
          <Code>font-sans</Code>, <Code>font-serif</Code> and <Code>font-mono</Code>.
        </Text>
      </DemoBlock>
    </DemoPage>
  );
}
