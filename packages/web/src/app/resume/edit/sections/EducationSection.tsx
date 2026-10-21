import {
  plainDateFromString,
  type PlainDate,
  type Resume,
} from "@resume-optimzer-app/common";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Text,
} from "@/ui";
import { Field } from "@/ui/form";

type Education = Resume["education"][number];
type InstituteType = Education["institute"]["type"];

const INSTITUTE_TYPES = ["collage", "school", "training"] as const;
const INSTITUTE_TYPE_LABELS: Record<InstituteType, string> = {
  collage: "College",
  school: "School",
  training: "Training",
};
const INSTITUTE_TYPE_OPTIONS = INSTITUTE_TYPES.map((value) => ({
  value,
  label: INSTITUTE_TYPE_LABELS[value],
}));

function emptyEducation(): Education {
  return {
    institute: { name: "", type: "collage" },
    degree: "",
    startDate: plainDateFromString(""),
    endDate: null,
  };
}

export type EducationSectionProps = {
  value: Resume["education"];
  onChange: (value: Resume["education"]) => void;
};

export function EducationSection({ value, onChange }: EducationSectionProps) {
  function update(index: number, patch: Partial<Education>) {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function updateInstitute(index: number, patch: Partial<Education["institute"]>) {
    const item = value[index];
    if (!item) return;
    update(index, { institute: { ...item.institute, ...patch } });
  }

  function toPlainDate(input: string): PlainDate {
    return plainDateFromString(input);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <CardTitle>Education</CardTitle>
            <CardDescription>Degrees, schools, and training.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onChange([...value, emptyEducation()])}>
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {value.length === 0 ? <Text variant="muted">No education added yet.</Text> : null}

        {value.map((item, index) => (
          <fieldset key={index} className="grid gap-3 rounded-ui border border-border p-3">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Education {index + 1}
            </legend>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field id={`education-${index}-institute`} label="Institute">
                <Input
                  id={`education-${index}-institute`}
                  value={item.institute.name}
                  onChange={(event) => updateInstitute(index, { name: event.target.value })}
                  placeholder="University of London"
                />
              </Field>
              <Field id={`education-${index}-type`} label="Type">
                <Select<InstituteType>
                  id={`education-${index}-type`}
                  options={INSTITUTE_TYPE_OPTIONS}
                  value={item.institute.type}
                  clearable={false}
                  onChange={(type) => {
                    if (type) updateInstitute(index, { type });
                  }}
                />
              </Field>
              <Field id={`education-${index}-degree`} label="Degree" className="sm:col-span-2">
                <Input
                  id={`education-${index}-degree`}
                  value={item.degree}
                  onChange={(event) => update(index, { degree: event.target.value })}
                  placeholder="BSc Computer Science"
                />
              </Field>
              <Field id={`education-${index}-start`} label="Start date">
                <Input
                  id={`education-${index}-start`}
                  type="date"
                  value={item.startDate}
                  onChange={(event) =>
                    update(index, { startDate: toPlainDate(event.target.value) })
                  }
                />
              </Field>
              <Field id={`education-${index}-end`} label="End date">
                <Input
                  id={`education-${index}-end`}
                  type="date"
                  value={item.endDate ?? ""}
                  onChange={(event) =>
                    update(index, {
                      endDate: event.target.value ? toPlainDate(event.target.value) : null,
                    })
                  }
                />
              </Field>
            </div>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                aria-label={`Remove education ${index + 1}`}
              >
                Remove
              </Button>
            </div>
          </fieldset>
        ))}
      </CardContent>
    </Card>
  );
}
