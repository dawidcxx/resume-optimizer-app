import {
  plainDateFromString,
  type PlainDate,
  type Resume,
} from "@resume-optimzer-app/common";
import {
  differenceInMonths,
  format,
  isValid,
  parseISO,
  startOfMonth,
} from "date-fns";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  IconButton,
  Input,
  MoveButtons,
  Select,
  Text,
  Textarea,
} from "@/ui";
import { Field } from "@/ui/form";
import { cn } from "@/lib/cn";
import { moveItem } from "@/lib/moveItem";
import {
  AnnotatedField,
  AnnotationPopover,
  useAnnotations,
} from "../../annotations";

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
    role: "",
    bulletPoints: [],
  };
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? startOfMonth(date) : null;
}

function formatDuration(months: number) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} mo${remainingMonths === 1 ? "" : "s"}`);
  }

  return parts.join(" ");
}

function getExperiencePreview(item: Experience) {
  const start = parseDate(item.from);
  const end = item.to ? parseDate(item.to) : startOfMonth(new Date());

  if (!start) {
    return { range: "Add a start date", duration: null, invalid: false };
  }

  if (!end) {
    return { range: "Check end date", duration: null, invalid: true };
  }

  if (end < start) {
    return { range: "Check date range", duration: null, invalid: true };
  }

  return {
    range: `${format(start, "MMM yyyy")} – ${item.to ? format(end, "MMM yyyy") : "Present"}`,
    duration: formatDuration(differenceInMonths(end, start) + 1),
    invalid: false,
  };
}

export type ExperienceSectionProps = {
  value: Resume["experience"];
  onChange: (value: Resume["experience"]) => void;
};

export function ExperienceSection({ value, onChange }: ExperienceSectionProps) {
  const { moveAnnotationsAt, removeAnnotationsAt } = useAnnotations();

  function update(index: number, patch: Partial<Experience>) {
    onChange(
      value.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function updateCompany(index: number, patch: Partial<Experience["company"]>) {
    const item = value[index];
    if (!item) return;
    update(index, { company: { ...item.company, ...patch } });
  }

  function updateBullet(index: number, bulletIndex: number, bullet: string) {
    const item = value[index];
    if (!item) return;
    update(index, {
      bulletPoints: (item.bulletPoints ?? []).map((current, currentIndex) =>
        currentIndex === bulletIndex ? bullet : current,
      ),
    });
  }

  function removeBullet(index: number, bulletIndex: number) {
    const item = value[index];
    if (!item) return;
    removeAnnotationsAt(`experience[${index}].bulletPoints`, bulletIndex);
    update(index, {
      bulletPoints: (item.bulletPoints ?? []).filter(
        (_, currentIndex) => currentIndex !== bulletIndex,
      ),
    });
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange([...value, emptyExperience()])}
          >
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        {value.length === 0 ? (
          <Text variant="muted">No experience added yet.</Text>
        ) : null}

        {value.map((item, index) => {
          const preview = getExperiencePreview(item);
          const company = [item.company.name.trim(), item.company.city.trim()]
            .filter(Boolean)
            .join(" · ");

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
                <legend className="sr-only">Experience {index + 1}</legend>

                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
                  <div className="grid min-w-0 gap-0.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.role.trim() || "Untitled role"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {company || "Company not set"}
                    </p>
                  </div>
                  <div className="grid justify-items-end gap-0.5 text-right">
                    <p
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        preview.invalid ? "text-warning" : "text-foreground",
                      )}
                    >
                      {preview.range}
                    </p>
                    {preview.duration ? (
                      <p className="text-[11px] text-muted-foreground">
                        {preview.duration}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id={`experience-${index}-company`} label="Company">
                    <Input
                      id={`experience-${index}-company`}
                      value={item.company.name}
                      onChange={(event) =>
                        updateCompany(index, { name: event.target.value })
                      }
                      placeholder="Analytical Engines Ltd."
                    />
                  </Field>
                  <AnnotatedField
                    id={`experience-${index}-role`}
                    label="Role"
                    annotationPath={`experience[${index}].role`}
                  >
                    <Input
                      id={`experience-${index}-role`}
                      value={item.role ?? ""}
                      onChange={(event) =>
                        update(index, { role: event.target.value })
                      }
                      placeholder="Senior Frontend Engineer"
                    />
                  </AnnotatedField>
                  <Field id={`experience-${index}-city`} label="City">
                    <Input
                      id={`experience-${index}-city`}
                      value={item.company.city}
                      onChange={(event) =>
                        updateCompany(index, { city: event.target.value })
                      }
                      placeholder="London"
                    />
                  </Field>
                  <AnnotatedField
                    id={`experience-${index}-work-type`}
                    label="Work type"
                    annotationPath={`experience[${index}].workType`}
                  >
                    <Select<WorkType>
                      id={`experience-${index}-work-type`}
                      options={WORK_TYPE_OPTIONS}
                      value={item.workType}
                      clearable={false}
                      onChange={(workType) => {
                        if (workType) update(index, { workType });
                      }}
                    />
                  </AnnotatedField>
                  <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                    <AnnotatedField
                      id={`experience-${index}-from`}
                      label="From"
                      annotationPath={`experience[${index}].from`}
                    >
                      <Input
                        id={`experience-${index}-from`}
                        type="date"
                        value={item.from}
                        onChange={(event) =>
                          update(index, {
                            from: toPlainDate(event.target.value),
                          })
                        }
                      />
                    </AnnotatedField>
                    <AnnotatedField
                      id={`experience-${index}-to`}
                      label="To"
                      annotationPath={`experience[${index}].to`}
                    >
                      <Input
                        id={`experience-${index}-to`}
                        type="date"
                        value={item.to ?? ""}
                        onChange={(event) =>
                          update(index, {
                            to: event.target.value
                              ? toPlainDate(event.target.value)
                              : null,
                          })
                        }
                      />
                    </AnnotatedField>
                  </div>
                  <Text variant="subtle">
                    Leave the end date empty if this is your current role.
                  </Text>
                </div>

                <AnnotatedField
                  id={`experience-${index}-description`}
                  label="Company description"
                  description="A short description of the company, not your responsibilities."
                  annotationPath={`experience[${index}].company.description`}
                >
                  <Textarea
                    id={`experience-${index}-description`}
                    value={item.company.description}
                    onChange={(event) =>
                      updateCompany(index, { description: event.target.value })
                    }
                    placeholder="Fintech startup building payment infrastructure."
                  />
                </AnnotatedField>

                <section className="grid gap-3">
                  <div className="grid gap-1">
                    <Heading level={4}>Bullet points</Heading>
                    <Text variant="subtle">
                      One responsibility or achievement per bullet.
                    </Text>
                  </div>

                  {(item.bulletPoints ?? []).length === 0 ? (
                    <Text variant="muted">No bullet points yet.</Text>
                  ) : null}

                  {(item.bulletPoints ?? []).map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start gap-2">
                      <Textarea
                        aria-label={`Experience ${index + 1} bullet ${bulletIndex + 1}`}
                        className="min-w-0 flex-1"
                        rows={2}
                        value={bullet}
                        onChange={(event) =>
                          updateBullet(index, bulletIndex, event.target.value)
                        }
                        placeholder="Shipped a design system used by every product team."
                      />
                      <AnnotationPopover
                        path={`experience[${index}].bulletPoints[${bulletIndex}]`}
                        label={`experience ${index + 1} bullet ${bulletIndex + 1}`}
                      />
                      <MoveButtons
                        index={bulletIndex}
                        count={(item.bulletPoints ?? []).length}
                        onMove={(from, to) => {
                          moveAnnotationsAt(
                            `experience[${index}].bulletPoints`,
                            from,
                            to,
                          );
                          update(index, {
                            bulletPoints: moveItem(
                              item.bulletPoints ?? [],
                              from,
                              to,
                            ),
                          });
                        }}
                        label={`experience ${index + 1} bullet ${bulletIndex + 1}`}
                      />
                      <IconButton
                        size="sm"
                        className="shrink-0 text-muted-foreground hover:bg-danger/10 hover:text-danger focus-visible:bg-danger/10 focus-visible:text-danger"
                        onClick={() => removeBullet(index, bulletIndex)}
                        aria-label={`Remove bullet ${bulletIndex + 1}`}
                        title="Remove bullet"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                        </svg>
                      </IconButton>
                    </div>
                  ))}

                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        update(index, {
                          bulletPoints: [...(item.bulletPoints ?? []), ""],
                        })
                      }
                    >
                      Add bullet
                    </Button>
                  </div>
                </section>

                <div className="flex justify-end border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    onClick={() => {
                      removeAnnotationsAt("experience", index);
                      onChange(
                        value.filter((_, itemIndex) => itemIndex !== index),
                      );
                    }}
                    aria-label={`Remove experience ${index + 1}`}
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
