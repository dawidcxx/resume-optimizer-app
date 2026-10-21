import type { Resume } from "@resume-optimzer-app/common";
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

type Project = Resume["projects"][number];
type ProjectIcon = NonNullable<Project["icon"]>;

const ICON_OPTIONS: { value: ProjectIcon; label: string }[] = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
];

function emptyProject(): Project {
  return { icon: null, name: "", url: "", description: "" };
}

export type ProjectsSectionProps = {
  value: Resume["projects"];
  onChange: (value: Resume["projects"]) => void;
};

export function ProjectsSection({ value, onChange }: ProjectsSectionProps) {
  function update(index: number, patch: Partial<Project>) {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <CardTitle>Projects</CardTitle>
            <CardDescription>Side projects and public work.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onChange([...value, emptyProject()])}>
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {value.length === 0 ? <Text variant="muted">No projects added yet.</Text> : null}

        {value.map((item, index) => (
          <fieldset key={index} className="grid gap-4 rounded-ui border border-border p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Project {index + 1}
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id={`project-${index}-name`} label="Name">
                <Input
                  id={`project-${index}-name`}
                  value={item.name}
                  onChange={(event) => update(index, { name: event.target.value })}
                  placeholder="Resume Optimizer"
                />
              </Field>
              <Field id={`project-${index}-icon`} label="Icon">
                <Select<ProjectIcon>
                  id={`project-${index}-icon`}
                  options={ICON_OPTIONS}
                  value={item.icon}
                  placeholder="None"
                  onChange={(icon) => update(index, { icon })}
                />
              </Field>
              <Field id={`project-${index}-url`} label="URL" className="sm:col-span-2">
                <Input
                  id={`project-${index}-url`}
                  type="url"
                  value={item.url}
                  onChange={(event) => update(index, { url: event.target.value })}
                  placeholder="https://github.com/ada/resume-optimizer"
                />
              </Field>
            </div>

            <Field id={`project-${index}-description`} label="Description">
              <Textarea
                id={`project-${index}-description`}
                value={item.description}
                onChange={(event) => update(index, { description: event.target.value })}
                placeholder="What it does and what you built."
              />
            </Field>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                aria-label={`Remove project ${index + 1}`}
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
