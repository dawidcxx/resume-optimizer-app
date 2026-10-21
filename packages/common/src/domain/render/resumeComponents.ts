import {
  InferOutput,
  optional,
  picklist,
  pipe,
  regex,
  strictObject,
  string,
} from "valibot";

const HexColor = pipe(string(), regex(/^#[0-9a-fA-F]{6}$/));
const NumericString = pipe(string(), regex(/^\d+$/));
const Ratio = pipe(string(), regex(/^[1-9]\d*:[1-9]\d*(:[1-9]\d*)?$/));
const Size = picklist(["xs", "sm", "md", "lg", "xl"]);
const Font = picklist(["sans", "serif", "mono"]);

export const RESUME_COMPONENT_SPEC = {
  Resume: {
    description: "Root container. Sets page colors, fonts, and spacing.",
    children: true,
    props: strictObject({
      accent: optional(HexColor, "#2563eb"),
      background: optional(HexColor, "#ffffff"),
      text: optional(HexColor, "#111827"),
      muted: optional(HexColor, "#6b7280"),
      font: optional(Font, "sans"),
      headingFont: optional(Font, "serif"),
      density: optional(picklist(["compact", "comfortable", "airy"]), "comfortable"),
    }),
  },
  Header: {
    description: "Candidate name, title, and contact details. Use once at the top.",
    children: true,
    props: strictObject({
      name: optional(string(), ""),
      title: optional(string(), ""),
      email: optional(string(), ""),
      phone: optional(string(), ""),
      website: optional(string(), ""),
      location: optional(string(), ""),
    }),
  },
  Section: {
    description: "A titled group of content.",
    children: true,
    props: strictObject({
      title: optional(string(), ""),
      accent: optional(HexColor),
      background: optional(HexColor),
    }),
  },
  Columns: {
    description:
      "Lays content out in two or three columns. Pass one child per column, or wrap each column's blocks in a Column.",
    children: true,
    props: strictObject({
      ratio: optional(Ratio, "1:1"),
      gap: optional(Size, "md"),
    }),
  },
  Column: {
    description:
      "A vertical stack for one column. Use inside Columns to group several blocks in the same column.",
    children: true,
    props: strictObject({}),
  },
  Entry: {
    description: "A role, degree, or project heading with markdown content below.",
    children: true,
    props: strictObject({
      title: optional(string(), ""),
      subtitle: optional(string(), ""),
      meta: optional(string(), ""),
      accent: optional(HexColor),
    }),
  },
  Text: {
    description: "A paragraph or short block of markdown text.",
    children: true,
    props: strictObject({
      size: optional(picklist(["xs", "sm", "md", "lg", "xl"]), "sm"),
      weight: optional(picklist(["normal", "medium", "semibold", "bold"]), "normal"),
      align: optional(picklist(["left", "center", "right"]), "left"),
      color: optional(HexColor),
      background: optional(HexColor),
    }),
  },
  BulletList: {
    description:
      "A standalone markdown bullet list. Prefer writing plain `- item` bullets directly inside Entry, Section, or Column.",
    children: true,
    props: strictObject({}),
  },
  TagList: {
    description: "A wrapping list of Tag components.",
    children: true,
    props: strictObject({}),
  },
  Tag: {
    description: "A small pill for a skill, tool, or keyword.",
    children: true,
    props: strictObject({
      accent: optional(HexColor),
      background: optional(HexColor),
    }),
  },
  Divider: {
    description: "A horizontal rule.",
    children: false,
    props: strictObject({
      color: optional(HexColor),
      weight: optional(picklist(["thin", "medium", "thick"]), "thin"),
    }),
  },
  Callout: {
    description: "A highlighted note, summary, or quote block.",
    children: true,
    props: strictObject({
      title: optional(string(), ""),
      accent: optional(HexColor),
      background: optional(HexColor),
    }),
  },
  Stars: {
    description: "A star rating. Value and max are digit strings.",
    children: false,
    props: strictObject({
      value: optional(NumericString, "3"),
      max: optional(NumericString, "5"),
      color: optional(HexColor),
      label: optional(string(), ""),
    }),
  },
  ProgressBar: {
    description: "A labelled progress bar. Value and max are digit strings.",
    children: false,
    props: strictObject({
      label: optional(string(), ""),
      value: optional(NumericString, "0"),
      max: optional(NumericString, "100"),
      color: optional(HexColor),
    }),
  },
  Timeline: {
    description: "A vertical timeline wrapper for TimelineItem children.",
    children: true,
    props: strictObject({}),
  },
  TimelineItem: {
    description: "One timeline entry with a title and optional meta.",
    children: true,
    props: strictObject({
      title: optional(string(), ""),
      meta: optional(string(), ""),
      accent: optional(HexColor),
    }),
  },
  Spacer: {
    description: "Vertical space between blocks.",
    children: false,
    props: strictObject({
      size: optional(Size, "md"),
    }),
  },
} as const;

export type ResumeComponentName = keyof typeof RESUME_COMPONENT_SPEC;
export type ResumeComponentSpec = (typeof RESUME_COMPONENT_SPEC)[ResumeComponentName];
export type ResumeComponentProps<K extends ResumeComponentName> = InferOutput<
  (typeof RESUME_COMPONENT_SPEC)[K]["props"]
>;
