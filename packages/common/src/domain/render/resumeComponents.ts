import {
  InferOutput,
  optional,
  picklist,
  pipe,
  regex,
  strictObject,
  string,
} from "valibot";
import { RESUME_BODY_FONT_IDS, RESUME_HEADING_FONT_IDS } from "./resumeFonts";

const HexColor = pipe(string(), regex(/^#[0-9a-fA-F]{6}$/));
const NumericString = pipe(string(), regex(/^\d+$/));
const DecimalString = pipe(string(), regex(/^\d+(\.\d+)?$/));
const Ratio = pipe(string(), regex(/^[1-9]\d*:[1-9]\d*(:[1-9]\d*)?$/));
const Size = picklist(["xs", "sm", "md", "lg", "xl"]);
const BodyFont = picklist(RESUME_BODY_FONT_IDS);
const HeadingFont = picklist(RESUME_HEADING_FONT_IDS);

export const RESUME_COMPONENT_SPEC = {
  Resume: {
    description:
      "Root container. Sets page colors, the body font, the heading font, and spacing.",
    children: true,
    props: strictObject({
      accent: optional(HexColor, "#2563eb"),
      background: optional(HexColor, "#ffffff"),
      text: optional(HexColor, "#111827"),
      muted: optional(HexColor, "#6b7280"),
      font: optional(BodyFont, "sans"),
      headingFont: optional(HeadingFont, "serif"),
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
  Fact: {
    description:
      "Optional compact label/value row for quick facts such as availability, clearance, or languages. Stack several in a Column.",
    children: false,
    props: strictObject({
      label: optional(string(), ""),
      value: optional(string(), ""),
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
      "Optional compatibility component for a standalone markdown bullet list. Prefer writing plain `- item` bullets directly inside Entry, Section, or Column.",
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
    description: "Optional horizontal rule.",
    children: false,
    props: strictObject({
      color: optional(HexColor),
      weight: optional(picklist(["thin", "medium", "thick"]), "thin"),
    }),
  },
  Callout: {
    description: "Optional highlighted note, summary, or quote block.",
    children: true,
    props: strictObject({
      title: optional(string(), ""),
      accent: optional(HexColor),
      background: optional(HexColor),
    }),
  },
  Stars: {
    description:
      "Optional accent. A compact star rating. value may be a decimal such as 3.5; max is an integer. Use sparingly because each star takes horizontal space.",
    children: false,
    props: strictObject({
      value: optional(DecimalString, "3"),
      max: optional(NumericString, "5"),
      color: optional(HexColor),
      label: optional(string(), ""),
      size: optional(Size, "sm"),
      format: optional(picklist(["stars", "stars-value"]), "stars"),
    }),
  },
  ProgressBar: {
    description:
      "Optional accent. A labelled progress bar. value and max may be decimals. Use for proficiency, completion, or allocation; each bar takes vertical space.",
    children: false,
    props: strictObject({
      label: optional(string(), ""),
      value: optional(DecimalString, "0"),
      max: optional(DecimalString, "100"),
      color: optional(HexColor),
    }),
  },
  Stats: {
    description:
      "Optional compact row of Stat highlights. Use two to four stats; each one takes horizontal space.",
    children: true,
    props: strictObject({}),
  },
  Stat: {
    description:
      "Optional single highlight metric, such as 6+ years, 40% growth, or 12 releases. Use inside Stats.",
    children: false,
    props: strictObject({
      value: optional(string(), ""),
      label: optional(string(), ""),
      accent: optional(HexColor),
      background: optional(HexColor),
    }),
  },
  DataTable: {
    description:
      "Optional compact table for a comparison or matrix. headers and rows are pipe-separated; separate rows with a semicolon. Example: headers='Skill|Years|Level' rows='React|6|Expert;TypeScript|5|Advanced'. Tables use a lot of space, so keep them small and only use one when the AI instructions explicitly request a table or matrix.",
    children: false,
    props: strictObject({
      headers: optional(string(), ""),
      rows: optional(string(), ""),
      caption: optional(string(), ""),
      accent: optional(HexColor),
    }),
  },
  Timeline: {
    description: "Optional vertical timeline wrapper for TimelineItem children.",
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
    description: "Optional vertical space between blocks.",
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
