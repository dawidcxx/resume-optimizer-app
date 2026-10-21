import type { Email, Resume } from "@resume-optimzer-app/common";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/ui";
import { Field } from "@/ui/form";

export type ContactSectionProps = {
  value: Resume["contact"];
  onChange: (value: Resume["contact"]) => void;
};

export function ContactSection({ value, onChange }: ContactSectionProps) {
  function updateAddress(patch: Partial<Resume["contact"]["address"]>) {
    onChange({ ...value, address: { ...value.address, ...patch } });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
        <CardDescription>Ways for a recruiter to reach you.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field id="email" label="Email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={value.email}
            onChange={(event) => onChange({ ...value, email: event.target.value as Email })}
            placeholder="ada@example.com"
          />
        </Field>
        <Field id="phone" label="Phone">
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={value.phone}
            onChange={(event) => onChange({ ...value, phone: event.target.value })}
            placeholder="+1 555 0100"
          />
        </Field>
        <Field id="website" label="Website" className="sm:col-span-2">
          <Input
            id="website"
            type="url"
            autoComplete="url"
            value={value.website}
            onChange={(event) => onChange({ ...value, website: event.target.value })}
            placeholder="https://ada.dev"
          />
        </Field>
        <Field id="address-line1" label="Address line 1">
          <Input
            id="address-line1"
            autoComplete="address-line1"
            value={value.address.line1}
            onChange={(event) => updateAddress({ line1: event.target.value })}
          />
        </Field>
        <Field id="address-line2" label="Address line 2">
          <Input
            id="address-line2"
            autoComplete="address-line2"
            value={value.address.line2}
            onChange={(event) => updateAddress({ line2: event.target.value })}
          />
        </Field>
      </CardContent>
    </Card>
  );
}
