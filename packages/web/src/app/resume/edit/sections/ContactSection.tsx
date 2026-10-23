import type { Email, Resume } from "@resume-optimzer-app/common";
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
  SocialIcon,
  Text,
} from "@/ui";
import { Field } from "@/ui/form";

type Social = Resume["contact"]["socials"][number];
type SocialType = Social["type"];

const SOCIAL_PROVIDERS: {
  value: SocialType;
  label: string;
  placeholder: string;
}[] = [
  { value: "github", label: "GitHub", placeholder: "https://github.com/ada" },
  {
    value: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/ada",
  },
  {
    value: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/ada",
  },
  { value: "x", label: "X", placeholder: "https://x.com/ada" },
  {
    value: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@ada",
  },
];

const SOCIAL_OPTIONS = SOCIAL_PROVIDERS.map(({ value, label }) => ({
  value,
  label,
  icon: <SocialIcon provider={value} className="h-4 w-4" />,
}));

function socialPlaceholder(type: SocialType) {
  return (
    SOCIAL_PROVIDERS.find((provider) => provider.value === type)?.placeholder ??
    "https://"
  );
}

export type ContactSectionProps = {
  value: Resume["contact"];
  onChange: (value: Resume["contact"]) => void;
};

export function ContactSection({ value, onChange }: ContactSectionProps) {
  function updateAddress(patch: Partial<Resume["contact"]["address"]>) {
    onChange({ ...value, address: { ...value.address, ...patch } });
  }

  function updateSocial(index: number, patch: Partial<Social>) {
    onChange({
      ...value,
      socials: value.socials.map((social, socialIndex) =>
        socialIndex === index ? { ...social, ...patch } : social,
      ),
    });
  }

  function addSocial() {
    const usedProviders = new Set(value.socials.map((social) => social.type));
    const provider =
      SOCIAL_PROVIDERS.find(({ value: type }) => !usedProviders.has(type))
        ?.value ?? "github";

    onChange({
      ...value,
      socials: [...value.socials, { type: provider, link: "" }],
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
        <CardDescription>Ways for a recruiter to reach you.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field id="email" label="Email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={value.email}
            onChange={(event) =>
              onChange({ ...value, email: event.target.value as Email })
            }
            placeholder="ada@example.com"
          />
        </Field>
        <Field id="phone" label="Phone">
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={value.phone}
            onChange={(event) =>
              onChange({ ...value, phone: event.target.value })
            }
            placeholder="+1 555 0100"
          />
        </Field>
        <Field id="website" label="Website" className="sm:col-span-2">
          <Input
            id="website"
            type="url"
            autoComplete="url"
            value={value.website}
            onChange={(event) =>
              onChange({ ...value, website: event.target.value })
            }
            placeholder="https://ada.dev"
          />
        </Field>
        <Field id="address-line1" label="Address line 1">
          <Input
            id="address-line1"
            autoComplete="address-line1"
            value={value.address.line1}
            onChange={(event) => updateAddress({ line1: event.target.value })}
          />
        </Field>
        <Field id="address-line2" label="Address line 2">
          <Input
            id="address-line2"
            autoComplete="address-line2"
            value={value.address.line2}
            onChange={(event) => updateAddress({ line2: event.target.value })}
          />
        </Field>

        <section className="grid gap-3 sm:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <Heading level={4}>Social profiles</Heading>
              <Text variant="subtle">
                Public profiles recruiters can visit.
              </Text>
            </div>
            <Button variant="outline" size="sm" onClick={addSocial}>
              Add social
            </Button>
          </div>

          {value.socials.length === 0 ? (
            <Text variant="muted">No social profiles yet.</Text>
          ) : null}

          {value.socials.map((social, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-ui border border-border p-3 sm:grid-cols-[10rem_1fr_auto] sm:items-end"
            >
              <Field id={`social-${index}-provider`} label="Provider">
                <Select<SocialType>
                  id={`social-${index}-provider`}
                  options={SOCIAL_OPTIONS}
                  value={social.type}
                  clearable={false}
                  onChange={(type) => {
                    if (type) updateSocial(index, { type });
                  }}
                />
              </Field>
              <Field id={`social-${index}-link`} label="Link">
                <Input
                  id={`social-${index}-link`}
                  type="url"
                  autoComplete="url"
                  value={social.link}
                  onChange={(event) =>
                    updateSocial(index, { link: event.target.value })
                  }
                  placeholder={socialPlaceholder(social.type)}
                />
              </Field>
              <IconButton
                size="sm"
                className="justify-self-end text-muted-foreground hover:bg-danger/10 hover:text-danger focus-visible:bg-danger/10 focus-visible:text-danger"
                onClick={() =>
                  onChange({
                    ...value,
                    socials: value.socials.filter(
                      (_, socialIndex) => socialIndex !== index,
                    ),
                  })
                }
                aria-label={`Remove social profile ${index + 1}`}
                title="Remove social profile"
              >
                <TrashIcon />
              </IconButton>
            </div>
          ))}
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
