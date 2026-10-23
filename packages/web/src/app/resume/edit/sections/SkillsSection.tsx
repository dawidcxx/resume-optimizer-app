import type { Rating, Resume } from "@resume-optimzer-app/common";
import { useMemo, useState } from "react";
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
  Select,
  type SelectItem,
  Text,
} from "@/ui";
import { Field } from "@/ui/form";
import { AnnotationPopover, useAnnotations } from "../../annotations";

type ListedSkill = Resume["skills"]["listed"][number];
type CategorizedSkill = Resume["skills"]["categorized"][number];
type RatingValue = "1" | "2" | "3" | "4" | "5";

const RATING_VALUES = ["1", "2", "3", "4", "5"] as const;

export type SkillsSectionProps = {
  value: Resume["skills"];
  onChange: (value: Resume["skills"]) => void;
};

export function SkillsSection({ value, onChange }: SkillsSectionProps) {
  const { removeAnnotationsAt } = useAnnotations();
  const [localCategories, setLocalCategories] = useState<SelectItem[]>([]);

  const categoryOptions = useMemo(() => {
    const names = new Set(
      value.categorized
        .map((item) => item.category.trim())
        .filter((category) => category.length > 0),
    );
    return Array.from(names, (category) => ({ label: category, value: category }));
  }, [value.categorized]);

  const availableLocalCategories = localCategories.filter(
    (option) => !categoryOptions.some((category) => category.value === option.value),
  );

  function addLocalCategories(options: SelectItem[]) {
    setLocalCategories((current) => {
      const byValue = new Map(current.map((option) => [option.value, option]));
      for (const option of options) {
        byValue.set(option.value, option);
      }
      return Array.from(byValue.values());
    });
  }

  function updateListed(index: number, patch: Partial<ListedSkill>) {
    onChange({
      ...value,
      listed: value.listed.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  function updateCategorized(index: number, patch: Partial<CategorizedSkill>) {
    onChange({
      ...value,
      categorized: value.categorized.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Standalone skills and grouped categories.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <section className="grid gap-4">
          <Heading level={4}>Listed</Heading>

          {value.listed.length === 0 ? (
            <Text variant="muted">No standalone skills yet.</Text>
          ) : null}

          {value.listed.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-ui border border-border p-3.5 sm:grid-cols-[1fr_7rem_auto] sm:items-end"
            >
              <Field id={`skill-${index}-name`} label="Skill">
                <Input
                  id={`skill-${index}-name`}
                  value={item.name}
                  onChange={(event) => updateListed(index, { name: event.target.value })}
                  placeholder="TypeScript"
                />
              </Field>
              <Field id={`skill-${index}-rating`} label="Rating">
                <Select<RatingValue>
                  id={`skill-${index}-rating`}
                  options={RATING_VALUES}
                  value={String(item.rating) as RatingValue}
                  clearable={false}
                  onChange={(rating) => {
                    if (rating) updateListed(index, { rating: Number(rating) as Rating });
                  }}
                />
              </Field>
              <div className="flex items-center justify-self-end">
                <AnnotationPopover path={`skills.listed[${index}]`} label={`skill ${index + 1}`} />
                <IconButton
                  size="sm"
                  className="text-muted-foreground hover:bg-danger/10 hover:text-danger focus-visible:bg-danger/10 focus-visible:text-danger"
                  onClick={() => {
                    removeAnnotationsAt("skills.listed", index);
                    onChange({
                      ...value,
                      listed: value.listed.filter((_, itemIndex) => itemIndex !== index),
                    });
                  }}
                  aria-label={`Remove skill ${index + 1}`}
                  title="Remove skill"
                >
                  <TrashIcon />
                </IconButton>
              </div>
            </div>
          ))}

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...value,
                  listed: [...value.listed, { name: "", rating: 3 }],
                })
              }
            >
              Add skill
            </Button>
          </div>
        </section>

        <section className="grid gap-4">
          <Heading level={4}>Categorized</Heading>

          {value.categorized.length === 0 ? <Text variant="muted">No categories yet.</Text> : null}

          {value.categorized.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-ui border border-border p-3.5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            >
              <Field id={`category-${index}-category`} label="Category">
                <Select<string>
                  id={`category-${index}-category`}
                  value={item.category || null}
                  options={categoryOptions}
                  localOptions={availableLocalCategories}
                  onLocalOptionsChange={addLocalCategories}
                  onChange={(category) => updateCategorized(index, { category: category ?? "" })}
                  placeholder="Select or create a category"
                  emptyMessage="No categories yet"
                  createMessage={(input) => `Create "${input}"`}
                />
              </Field>
              <Field id={`category-${index}-skill`} label="Skill">
                <Input
                  id={`category-${index}-skill`}
                  value={item.skill}
                  onChange={(event) => updateCategorized(index, { skill: event.target.value })}
                  placeholder="Gradle"
                />
              </Field>
              <div className="flex items-center justify-self-end">
                <AnnotationPopover
                  path={`skills.categorized[${index}]`}
                  label={`skill category ${index + 1}`}
                />
                <IconButton
                  size="sm"
                  className="text-muted-foreground hover:bg-danger/10 hover:text-danger focus-visible:bg-danger/10 focus-visible:text-danger"
                  onClick={() => {
                    removeAnnotationsAt("skills.categorized", index);
                    onChange({
                      ...value,
                      categorized: value.categorized.filter((_, itemIndex) => itemIndex !== index),
                    });
                  }}
                  aria-label={`Remove category ${index + 1}`}
                  title="Remove category"
                >
                  <TrashIcon />
                </IconButton>
              </div>
            </div>
          ))}

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...value,
                  categorized: [...value.categorized, { category: "", skill: "" }],
                })
              }
            >
              Add category
            </Button>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

function TrashIcon() {
  return (
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
  );
}