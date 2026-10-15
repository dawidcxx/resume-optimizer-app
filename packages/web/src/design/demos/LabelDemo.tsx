import { Input, Label, Text } from "@/ui";
import { DemoBlock, DemoPage } from "../DemoPage";

export function LabelDemo() {
  return (
    <DemoPage
      title="Label"
      description="A thin wrapper around the native label element. It pairs with inputs via htmlFor/id and supports a required marker."
    >
      <DemoBlock title="Basic">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          placeholder="ada"
          className="mt-1.5 max-w-sm"
        />
      </DemoBlock>

      <DemoBlock title="Required">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ada@example.com"
          className="mt-1.5 max-w-sm"
        />
      </DemoBlock>

      <DemoBlock title="Field group" note="label + input + hint">
        <div className="grid max-w-sm gap-1.5">
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            defaultValue="correcthorse"
          />
          <Text variant="subtle">At least 12 characters.</Text>
        </div>
      </DemoBlock>

      <DemoBlock title="Disabled field">
        <div className="grid max-w-sm gap-1.5">
          <Label htmlFor="legacy" className="opacity-60">
            Legacy field
          </Label>
          <Input id="legacy" name="legacy" placeholder="Unavailable" disabled />
        </div>
      </DemoBlock>
    </DemoPage>
  );
}
