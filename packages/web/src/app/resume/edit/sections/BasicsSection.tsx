import type { Resume } from "@resume-optimzer-app/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/ui";
import { Field } from "@/ui/form";

export type BasicsSectionProps = {
  value: Pick<Resume, "fullName" | "careerName" | "aboutMe">;
  onChange: (patch: Partial<Pick<Resume, "fullName" | "careerName" | "aboutMe">>) => void;
};

export function BasicsSection({ value, onChange }: BasicsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basics</CardTitle>
        <CardDescription>How you appear at the top of the resume.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field id="fullName" label="Full name">
          <Input
            id="fullName"
            autoComplete="name"
            value={value.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
            placeholder="Ada Lovelace"
          />
        </Field>
        <Field id="careerName" label="Career title">
          <Input
            id="careerName"
            autoComplete="organization-title"
            value={value.careerName}
            onChange={(event) => onChange({ careerName: event.target.value })}
            placeholder="Senior Frontend Engineer"
          />
        </Field>
        <Field id="aboutMe" label="About me" className="sm:col-span-2">
          <Textarea
            id="aboutMe"
            rows={4}
            value={value.aboutMe}
            onChange={(event) => onChange({ aboutMe: event.target.value })}
            placeholder="A short summary of who you are, what you do, and what you're looking for."
          />
        </Field>
      </CardContent>
    </Card>
  );
}
