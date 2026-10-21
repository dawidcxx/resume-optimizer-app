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
  Textarea,
} from "@/ui";
import { Field } from "@/ui/form";

type Experience = Resume["experience"][number];
type WorkType = Experience["workType"];

const WORK_TYPES = ["onsite", "hybrid", "remote"] as const;
const WORK_TYPE_LABELS: Record<WorkType, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};
const WORK_TYPE_OPTIONS = WORK_TYPES.map((value) => ({
  value,
  label: WORK_TYPE_LABELS[value],
}));

function emptyExperience(): Experience {
  return {
    from: plainDateFromString(""),
    to: null,
    workType: "onsite",
    company: { name: "", city: "", description: "" },
  };
}

export type ExperienceSectionProps = {
  value: Resume["experience"];
  onChange: (value: Resume["experience"]) => void;
};

export function ExperienceSection({ value, onChange }: ExperienceSectionProps) {
  function update(index: number, patch: Partial<Experience>) {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function updateCompany(index: number, patch: Partial<Experience["company"]>) {
    const item = value[index];
    if (!item) return;
    update(index, { company: { ...item.company, ...patch } });
  }

  function toPlainDate(input: string): PlainDate {
    return plainDateFromString(input);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <CardTitle>Experience</CardTitle>
            <CardDescription>Work history, most recent first.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onChange([...value, emptyExperience()])}>
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {value.length === 0 ? <Text variant="muted">No experience added yet.</Text> : null}

        {value.map((item, index) => (
          <fieldset key={index} className="grid gap-3 rounded-ui border border-border p-3">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Experience {index + 1}
            </legend>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field id={`experience-${index}-company`} label="Company">
                <Input
                  id={`experience-${index}-company`}
                  value={item.company.name}
                  onChange={(event) => updateCompany(index, { name: event.target.value })}
                  placeholder="Analytical Engines Ltd."
                />
              </Field>
              <Field id={`experience-${index}-city`} label="City">
                <Input
                  id={`experience-${index}-city`}
                  value={item.company.city}
                  onChange={(event) => updateCompany(index, { city: event.target.value })}
                  placeholder="London"
                />
              </Field>
              <Field id={`experience-${index}-work-type`} label="Work type">
                <Select<WorkType>
                  id={`experience-${index}-work-type`}
                  options={WORK_TYPE_OPTIONS}
                  value={item.workType}
                  clearable={false}
                  onChange={(workType) => {
                    if (workType) update(index, { workType });
                  }}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                <Field id={`experience-${index}-from`} label="From">
                  <Input
                    id={`experience-${index}-from`}
                    type="date"
                    value={item.from}
                    onChange={(event) => update(index, { from: toPlainDate(event.target.value) })}
                  />
                </Field>
                <Field id={`experience-${index}-to`} label="To">
                  <Input
                    id={`experience-${index}-to`}
                    type="date"
                    value={item.to ?? ""}
                    onChange={(event) =>
                      update(index, {
                        to: event.target.value ? toPlainDate(event.target.value) : null,
                      })
                    }
                  />
                </Field>
              </div>
              <Text variant="subtle">Leave the end date empty if this is your current role.</Text>
            </div>

            <Field id={`experience-${index}-description`} label="Description">
              <Textarea
                id={`experience-${index}-description`}
                value={item.company.description}
                onChange={(event) => updateCompany(index, { description: event.target.value })}
                placeholder="What you worked on and the impact it had."
              />
            </Field>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                aria-label={`Remove experience ${index + 1}`}
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
