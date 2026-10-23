import type { ResumeProject } from "@resume-optimzer-app/common";
import { useForm } from "@tanstack/react-form";
import { useEffect, useRef } from "react";
import { createResumeProject } from "@/store";
import { Button, Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/ui";
import { TextField } from "@/ui/form";

export type CreateResumeProjectDialogProps = {
  open: boolean;
  defaultName: string;
  onOpenChange: (open: boolean) => void;
  onCreated?: (project: ResumeProject) => void;
};

type CreateResumeProjectValues = {
  name: string;
  fullName: string;
  careerName: string;
};

export function CreateResumeProjectDialog({
  open,
  defaultName,
  onOpenChange,
  onCreated,
}: CreateResumeProjectDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      name: defaultName,
      fullName: "",
      careerName: "",
    } satisfies CreateResumeProjectValues,
    onSubmit: ({ value }) => {
      const project = createResumeProject({
        name: value.name,
        fullName: value.fullName,
        careerName: value.careerName,
      });
      onCreated?.(project);
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({ name: defaultName, fullName: "", careerName: "" });

    const frame = requestAnimationFrame(() => {
      const input = nameInputRef.current;
      if (!input) return;
      input.focus();
      const end = input.value.length;
      input.setSelectionRange(end, end);
    });

    return () => cancelAnimationFrame(frame);
  }, [open, defaultName, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>New resume</DialogTitle>
          <DialogDescription>
            Give the document a name. Everything else can be filled in later.
          </DialogDescription>
        </DialogHeader>

        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => (value.trim() ? undefined : "A name is required"),
          }}
          children={(field) => (
            <TextField
              ref={nameInputRef}
              field={field}
              label="Resume name"
              required
              autoComplete="off"
              placeholder="My Resume"
            />
          )}
        />

        <form.Field
          name="fullName"
          children={(field) => (
            <TextField
              field={field}
              label="Full name"
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
          )}
        />

        <form.Field
          name="careerName"
          children={(field) => (
            <TextField
              field={field}
              label="Career title"
              autoComplete="organization-title"
              placeholder="Senior Frontend Engineer"
            />
          )}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" variant="primary" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Creating…" : "Create resume"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </form>
    </Dialog>
  );
}