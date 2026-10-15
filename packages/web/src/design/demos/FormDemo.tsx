import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button, Heading } from "@/ui";
import { TextField } from "@/ui/form";
import { DemoBlock, DemoPage } from "../DemoPage";

type RegistrationValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FormDemo() {
  const [created, setCreated] = useState<RegistrationValues | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies RegistrationValues,
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setCreated(value);
    },
  });

  return (
    <DemoPage
      title="Form"
      description="A registration form driven by TanStack Form. Fields come from @/ui/form and compose the core primitives; validation, async checks and submission live in the form."
    >
      <div className="max-w-md">
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="grid gap-4 rounded-ui border border-border bg-surface p-4"
        >
          <Heading level={3}>Create account</Heading>

          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Username is required"
                  : value.length < 3
                    ? "At least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 400,
              onChangeAsync: async ({ value }) => {
                if (value.length < 3) return undefined;
                await new Promise((resolve) => setTimeout(resolve, 400));
                return value === "admin" ? 'The username "admin" is taken' : undefined;
              },
            }}
            children={(field) => (
              <TextField
                field={field}
                label="Username"
                required
                autoComplete="username"
                placeholder="ada"
              />
            )}
          />

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Email is required"
                  : EMAIL_RE.test(value)
                    ? undefined
                    : "Enter a valid email address",
            }}
            children={(field) => (
              <TextField
                field={field}
                label="Email"
                required
                type="email"
                autoComplete="email"
                placeholder="ada@example.com"
              />
            )}
          />

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Password is required"
                  : value.length < 8
                    ? "At least 8 characters"
                    : undefined,
            }}
            children={(field) => (
              <TextField
                field={field}
                label="Password"
                required
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            )}
          />

          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) =>
                !value
                  ? "Please confirm your password"
                  : value !== fieldApi.form.getFieldValue("password")
                    ? "Passwords do not match"
                    : undefined,
            }}
            children={(field) => (
              <TextField
                field={field}
                label="Confirm password"
                required
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            )}
          />

          <div className="flex items-center gap-2 pt-1">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" variant="primary" disabled={!canSubmit}>
                  {isSubmitting ? "Creating…" : "Create account"}
                </Button>
              )}
            </form.Subscribe>
            <Button
              type="reset"
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                form.reset();
                setCreated(null);
              }}
            >
              Reset
            </Button>
          </div>
        </form>

        {created && (
          <div className="mt-4 rounded-ui border border-border bg-accent p-3 text-sm text-accent-foreground">
            Account created for <strong>{created.username}</strong> ({created.email}).
          </div>
        )}
      </div>

      <DemoBlock title="Live values" note="form.Subscribe">
        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <pre className="overflow-x-auto rounded-ui border border-border bg-subtle p-3 font-mono text-xs">
              {JSON.stringify(
                {
                  username: values.username,
                  email: values.email,
                  password: "•".repeat(values.password.length),
                  confirmPassword: "•".repeat(values.confirmPassword.length),
                },
                null,
                2,
              )}
            </pre>
          )}
        </form.Subscribe>
      </DemoBlock>
    </DemoPage>
  );
}
