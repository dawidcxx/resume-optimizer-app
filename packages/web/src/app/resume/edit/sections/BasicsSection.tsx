import type { Resume } from "@resume-optimzer-app/common";
import { Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/ui";
import { AnnotatedField } from "../../annotations";

export type BasicsSectionProps = {
  value: Pick<Resume, "fullName" | "careerName" | "aboutMe">;
  onChange: (patch: Partial<Pick<Resume, "fullName" | "careerName" | "aboutMe">>) => void;
};

export function BasicsSection({ value, onChange }: BasicsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <AnnotatedField id="fullName" label="Full name" annotationPath="fullName">
          <Input
            id="fullName"
            autoComplete="name"
            value={value.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
            placeholder="Ada Lovelace"
          />
        </AnnotatedField>
        <AnnotatedField id="careerName" label="Career title" annotationPath="careerName">
          <Input
            id="careerName"
            autoComplete="organization-title"
            value={value.careerName}
            onChange={(event) => onChange({ careerName: event.target.value })}
            placeholder="Senior Frontend Engineer"
          />
        </AnnotatedField>
        <AnnotatedField
          id="aboutMe"
          label="About me"
          className="sm:col-span-2"
          annotationPath="aboutMe"
        >
          <Textarea
            id="aboutMe"
            rows={4}
            value={value.aboutMe}
            onChange={(event) => onChange({ aboutMe: event.target.value })}
            placeholder="A short summary of who you are, what you do, and what you're looking for."
          />
        </AnnotatedField>
      </CardContent>
    </Card>
  );
}