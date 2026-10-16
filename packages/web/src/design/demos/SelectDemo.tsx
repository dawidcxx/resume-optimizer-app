import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button, Select, Text, type SelectItem } from "@/ui";
import { SelectField, TextField } from "@/ui/form";
import { DemoBlock, DemoPage } from "../DemoPage";

const roles = [
  "Frontend Engineer",
  "Backend Engineer",
  "Product Designer",
  "Product Manager",
  "Engineering Manager",
];

function Dot({ className }: { className?: string }) {
  return <span className={cn("h-2 w-2 shrink-0 rounded-full", className)} />;
}

const statuses: SelectItem[] = [
  { label: "Applied", value: "applied", icon: <Dot className="bg-muted-foreground" /> },
  { label: "Interview", value: "interview", icon: <Dot className="bg-warning" /> },
  { label: "Offer", value: "offer", icon: <Dot className="bg-success" /> },
  { label: "Rejected", value: "rejected", icon: <Dot className="bg-danger" /> },
];

export function SelectDemo() {
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>("offer");
  const [skills, setSkills] = useState<SelectItem[]>([
    { label: "TypeScript", value: "TypeScript" },
    { label: "React", value: "React" },
  ]);
  const [skill, setSkill] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { seniority: null as string | null, location: "" },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSaved(`${value.seniority ?? "—"} · ${value.location || "—"}`);
    },
  });

  return (
    <DemoPage
      title="Select"
      description="A filterable combobox: type to filter, arrow keys to move, Enter to confirm, and an optional create-in-place mode. The dumb component lives in @/ui; the form-bound SelectField lives in @/ui/form."
    >
      <DemoBlock title="Basic">
        <div className="max-w-sm">
          <Select
            value={role}
            onChange={setRole}
            options={roles}
            placeholder="Select a role…"
            aria-label="Role"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="With icons">
        <div className="max-w-sm">
          <Select
            value={status}
            onChange={setStatus}
            options={statuses}
            placeholder="Select a status…"
            aria-label="Status"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="Create in place" note="localOptions + onLocalOptionsChange">
        <div className="max-w-sm">
          <Select
            value={skill}
            onChange={setSkill}
            options={[]}
            localOptions={skills}
            onLocalOptionsChange={setSkills}
            placeholder="Add a skill…"
            emptyMessage="No skills yet"
            createMessage={(input) => `Add "${input}"`}
            aria-label="Skill"
          />
          <Text variant="subtle" className="mt-1.5">
            Options: {skills.map((entry) => entry.label).join(", ") || "—"}
          </Text>
        </div>
      </DemoBlock>

      <DemoBlock title="Sizes">
        <div className="grid max-w-sm gap-3">
          <Select
            value={null}
            onChange={() => {}}
            options={roles}
            size="sm"
            placeholder="Small"
            aria-label="Small"
          />
          <Select
            value={null}
            onChange={() => {}}
            options={roles}
            size="md"
            placeholder="Medium"
            aria-label="Medium"
          />
          <Select
            value={null}
            onChange={() => {}}
            options={roles}
            size="lg"
            placeholder="Large"
            aria-label="Large"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="States">
        <div className="grid max-w-sm gap-3">
          <Select
            value={null}
            onChange={() => {}}
            options={roles}
            disabled
            placeholder="Disabled"
            aria-label="Disabled"
          />
          <Select
            value="unknown"
            onChange={() => {}}
            options={roles}
            invalid
            placeholder="Invalid"
            aria-label="Invalid"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="Form field" note="SelectField · @/ui/form">
        <div className="max-w-md">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
            className="grid gap-4 rounded-ui border border-border bg-surface p-4"
          >
            <form.Field
              name="seniority"
              validators={{
                onChange: ({ value }) => (value ? undefined : "Please pick a seniority"),
              }}
              children={(field) => (
                <SelectField
                  field={field}
                  label="Seniority"
                  required
                  options={["Junior", "Mid", "Senior", "Staff", "Principal"]}
                  placeholder="Select seniority…"
                />
              )}
            />

            <form.Field
              name="location"
              validators={{
                onChange: ({ value }) => (value ? undefined : "Location is required"),
              }}
              children={(field) => (
                <TextField field={field} label="Location" required placeholder="Berlin" />
              )}
            />

            <div className="flex items-center gap-2 pt-1">
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" variant="primary" disabled={!canSubmit}>
                    {isSubmitting ? "Saving…" : "Save"}
                  </Button>
                )}
              </form.Subscribe>
              <Button
                type="reset"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSaved(null);
                }}
              >
                Reset
              </Button>
            </div>

            {saved ? <Text variant="subtle">Saved: {saved}</Text> : null}
          </form>
        </div>
      </DemoBlock>
    </DemoPage>
  );
}