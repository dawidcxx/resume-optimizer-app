import { useState } from "react";
import { Button, Input, Label, Text } from "@/ui";
import { DemoBlock, DemoPage } from "../DemoPage";

export function InputDemo() {
  const [name, setName] = useState("Ada Lovelace");

  return (
    <DemoPage
      title="Input"
      description="A single-line text input with three sizes and native attribute pass-through. It accepts value/onChange from any form library and forwards its ref."
    >
      <DemoBlock title="Sizes">
        <div className="grid max-w-sm gap-3">
          <Input inputSize="sm" id="size-sm" name="size-sm" placeholder="Small" />
          <Input inputSize="md" id="size-md" name="size-md" placeholder="Medium" />
          <Input inputSize="lg" id="size-lg" name="size-lg" placeholder="Large" />
        </div>
      </DemoBlock>

      <DemoBlock title="States">
        <div className="grid max-w-sm gap-3">
          <Input id="state-default" name="state-default" placeholder="Default" />
          <Input
            id="state-readonly"
            name="state-readonly"
            placeholder="Read only"
            readOnly
            defaultValue="Locked value"
          />
          <Input id="state-disabled" name="state-disabled" placeholder="Disabled" disabled />
          <Input
            id="state-invalid"
            name="state-invalid"
            type="email"
            autoComplete="email"
            invalid
            defaultValue="not-an-email"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="Controlled">
        <div className="grid max-w-sm gap-1.5">
          <Label htmlFor="full-name">Full name</Label>
          <Input
            id="full-name"
            name="full-name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Text variant="subtle">Value: {name || "—"}</Text>
        </div>
      </DemoBlock>

      <DemoBlock title="Dense form" note="label · input · action">
        <form
          className="flex max-w-lg items-end gap-2 border border-border bg-subtle p-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid flex-1 gap-1.5">
            <Label htmlFor="company" required>
              Company
            </Label>
            <Input id="company" name="company" autoComplete="organization" placeholder="Acme Inc." />
          </div>
          <div className="grid flex-1 gap-1.5">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" placeholder="Engineer" />
          </div>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </form>
      </DemoBlock>
    </DemoPage>
  );
}
