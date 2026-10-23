import { plainDateFromString, type PlainDate, type Resume } from "@resume-optimzer-app/common";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/cn";
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
import { AnnotatedField, useAnnotations } from "../../annotations";

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

function parseDate(value: string): Date | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
}

function getEducationPreview(item: Education) {
  const start = parseDate(item.startDate);
  const end = item.endDate ? parseDate(item.endDate) : null;

  if (!start) {
    return {
      range: end ? format(end, "yyyy") : "Add dates",
      invalid: false,
    };
  }

  if (item.endDate && !end) {
    return { range: "Check end date", invalid: true };
  }

  if (end && end < start) {
    return { range: "Check date range", invalid: true };
  }

  const startYear = format(start, "yyyy");
  if (!end) {
    return { range: `${startYear} – Present`, invalid: false };
  }

  const endYear = format(end, "yyyy");
  return {
    range: startYear === endYear ? startYear : `${startYear} – ${endYear}`,
    invalid: false,
  };
}

export type EducationSectionProps = {
  value: Resume["education"];
  onChange: (value: Resume["education"]) => void;
};

export function EducationSection({ value, onChange }: EducationSectionProps) {
  const { removeAnnotationsAt } = useAnnotations();

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange([...value, emptyEducation()])}
          >
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        {value.length === 0 ? <Text variant="muted">No education added yet.</Text> : null}

        {value.map((item, index) => {
          const preview = getEducationPreview(item);

          return (
            <div key={index} className="relative pl-9">
              {index < value.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-5 left-3 top-9 w-px bg-border"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="absolute left-0 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-accent text-[11px] font-semibold text-accent-foreground ring-4 ring-surface"
              >
                {index + 1}
              </span>
              <fieldset className="grid gap-4 rounded-ui border border-border bg-background/60 p-4">
                <legend className="sr-only">Education {index + 1}</legend>

                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
                  <div className="grid min-w-0 gap-0.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.degree.trim() || "Degree not set"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.institute.name.trim() || "Institute not set"}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium tabular-nums",
                      preview.invalid ? "text-warning" : "text-foreground",
                    )}
                  >
                    {preview.range}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <AnnotatedField
                    id={`education-${index}-institute`}
                    label="Institute"
                    annotationPath={`education[${index}].institute.name`}
                  >
                    <Input
                      id={`education-${index}-institute`}
                      value={item.institute.name}
                      onChange={(event) => updateInstitute(index, { name: event.target.value })}
                      placeholder="University of London"
                    />
                  </AnnotatedField>
                  <AnnotatedField
                    id={`education-${index}-type`}
                    label="Type"
                    annotationPath={`education[${index}].institute.type`}
                  >
                    <Select<InstituteType>
                      id={`education-${index}-type`}
                      options={INSTITUTE_TYPE_OPTIONS}
                      value={item.institute.type}
                      clearable={false}
                      onChange={(type) => {
                        if (type) updateInstitute(index, { type });
                      }}
                    />
                  </AnnotatedField>
                  <AnnotatedField
                    id={`education-${index}-degree`}
                    label="Degree"
                    className="sm:col-span-2"
                    annotationPath={`education[${index}].degree`}
                  >
                    <Input
                      id={`education-${index}-degree`}
                      value={item.degree}
                      onChange={(event) => update(index, { degree: event.target.value })}
                      placeholder="BSc Computer Science"
                    />
                  </AnnotatedField>
                  <AnnotatedField
                    id={`education-${index}-start`}
                    label="Start date"
                    annotationPath={`education[${index}].startDate`}
                  >
                    <Input
                      id={`education-${index}-start`}
                      type="date"
                      value={item.startDate}
                      onChange={(event) =>
                        update(index, {
                          startDate: toPlainDate(event.target.value),
                        })
                      }
                    />
                  </AnnotatedField>
                  <AnnotatedField
                    id={`education-${index}-end`}
                    label="End date"
                    annotationPath={`education[${index}].endDate`}
                  >
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
                  </AnnotatedField>
                  <Text variant="subtle" className="sm:col-span-2">
                    Leave the end date empty if you're still studying.
                  </Text>
                </div>

                <div className="flex justify-end border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    onClick={() => {
                      removeAnnotationsAt("education", index);
                      onChange(value.filter((_, itemIndex) => itemIndex !== index));
                    }}
                    aria-label={`Remove education ${index + 1}`}
                  >
                    Remove
                  </Button>
                </div>
              </fieldset>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}