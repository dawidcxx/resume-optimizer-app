import {
  array,
  InferOutput,
  literal,
  object,
  optional,
  picklist,
  pipe,
  regex,
  string,
  variant,
} from "valibot";

const HexColor = pipe(string(), regex(/^#[0-9a-fA-F]{6}$/));

const RenderLink = object({
  label: string(),
  url: string(),
});

const RenderHeaderBlock = object({
  type: literal("header"),
  name: string(),
  title: optional(string(), ""),
  email: optional(string(), ""),
  phone: optional(string(), ""),
  website: optional(string(), ""),
  location: optional(string(), ""),
  links: optional(array(RenderLink), []),
});

const RenderTextBlock = object({
  type: literal("text"),
  content: string(),
  variant: optional(picklist(["body", "lead", "muted"]), "body"),
});

const RenderBulletListBlock = object({
  type: literal("bullet-list"),
  items: array(string()),
});

const RenderTagListBlock = object({
  type: literal("tag-list"),
  tags: array(string()),
});

const RenderDividerBlock = object({
  type: literal("divider"),
});

const RenderEntryBlock = object({
  type: literal("entry"),
  title: string(),
  subtitle: optional(string(), ""),
  meta: optional(string(), ""),
  description: optional(string(), ""),
  bullets: optional(array(string()), []),
});

const RenderSectionItem = variant("type", [
  RenderEntryBlock,
  RenderTextBlock,
  RenderBulletListBlock,
  RenderTagListBlock,
  RenderDividerBlock,
]);

const RenderSectionBlock = object({
  type: literal("section"),
  title: optional(string(), ""),
  columns: optional(picklist(["single", "two"]), "single"),
  items: array(RenderSectionItem),
});

const RenderBlock = variant("type", [
  RenderHeaderBlock,
  RenderSectionBlock,
  RenderTextBlock,
  RenderBulletListBlock,
  RenderTagListBlock,
  RenderDividerBlock,
]);

export const RenderDocument = object({
  version: literal("v1"),
  theme: object({
    accent: HexColor,
    background: HexColor,
    text: HexColor,
    muted: HexColor,
    font: picklist(["sans", "serif", "mono"]),
    headingFont: picklist(["sans", "serif", "mono"]),
    density: picklist(["comfortable", "compact"]),
  }),
  blocks: array(RenderBlock),
});

export type RenderDocument = InferOutput<typeof RenderDocument>;
export type RenderBlock = InferOutput<typeof RenderBlock>;
export type RenderSectionItem = InferOutput<typeof RenderSectionItem>;
