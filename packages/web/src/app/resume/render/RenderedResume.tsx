import type {
  RenderBlock,
  RenderDocument,
  RenderSectionItem,
} from "@resume-optimzer-app/common";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const FONT_FAMILIES = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, monospace",
} as const;

const TEXT_VARIANTS = {
  body: "text-[11px] leading-relaxed",
  lead: "text-[13px] leading-relaxed",
  muted: "text-[11px] leading-relaxed text-[var(--resume-muted)]",
} as const;

type HeaderBlock = Extract<RenderBlock, { type: "header" }>;
type SectionBlock = Extract<RenderBlock, { type: "section" }>;
type TextBlock = Extract<RenderBlock, { type: "text" }>;
type EntryBlock = Extract<RenderSectionItem, { type: "entry" }>;

export function RenderedResume({ document }: { document: RenderDocument }) {
  const { theme } = document;
  const style = {
    backgroundColor: theme.background,
    color: theme.text,
    fontFamily: FONT_FAMILIES[theme.font],
    "--resume-accent": theme.accent,
    "--resume-muted": theme.muted,
    "--resume-heading-font": FONT_FAMILIES[theme.headingFont],
  } as CSSProperties;

  return (
    <article
      aria-label="Rendered resume"
      style={style}
      className={cn(
        "mx-auto w-full max-w-[210mm] rounded-sm border border-border shadow-sm",
        theme.density === "compact" ? "px-8 py-7" : "px-10 py-9",
      )}
    >
      <div className={cn("grid", theme.density === "compact" ? "gap-4" : "gap-5")}>
        {document.blocks.map((block, index) => (
          <RenderedBlock key={index} block={block} />
        ))}
      </div>
    </article>
  );
}

function RenderedBlock({ block }: { block: RenderBlock }) {
  switch (block.type) {
    case "header":
      return <Header block={block} />;
    case "section":
      return <Section block={block} />;
    case "text":
      return <TextContent block={block} />;
    case "bullet-list":
      return <BulletList items={block.items} />;
    case "tag-list":
      return <TagList tags={block.tags} />;
    case "divider":
      return <Divider />;
    default:
      return null;
  }
}

function RenderedSectionItem({ item }: { item: RenderSectionItem }) {
  switch (item.type) {
    case "entry":
      return <Entry item={item} />;
    case "text":
      return <TextContent block={item} />;
    case "bullet-list":
      return <BulletList items={item.items} />;
    case "tag-list":
      return <TagList tags={item.tags} />;
    case "divider":
      return <Divider />;
    default:
      return null;
  }
}

function Header({ block }: { block: HeaderBlock }) {
  const contacts = [block.email, block.phone, block.location, block.website].filter(
    (value) => value.length > 0,
  );

  return (
    <header className="grid gap-1.5">
      <h1
        className="text-2xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--resume-heading-font)" }}
      >
        {block.name}
      </h1>
      {block.title ? (
        <p className="text-xs font-medium text-[var(--resume-accent)]">{block.title}</p>
      ) : null}
      {contacts.length > 0 || block.links.length > 0 ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--resume-muted)]">
          {contacts.map((value, index) => (
            <span key={`${value}-${index}`}>{value}</span>
          ))}
          {block.links.map((link, index) => {
            const href = safeHref(link.url);
            return href ? (
              <a
                key={`${link.label}-${index}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-[var(--resume-accent)] underline-offset-2"
              >
                {link.label}
              </a>
            ) : (
              <span key={`${link.label}-${index}`}>{link.label}</span>
            );
          })}
        </div>
      ) : null}
    </header>
  );
}

function Section({ block }: { block: SectionBlock }) {
  return (
    <section className="grid gap-2.5">
      {block.title ? (
        <div className="border-b border-[var(--resume-accent)] pb-1">
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--resume-accent)]"
            style={{ fontFamily: "var(--resume-heading-font)" }}
          >
            {block.title}
          </h2>
        </div>
      ) : null}
      <div
        className={
          block.columns === "two"
            ? "grid gap-x-6 gap-y-3 sm:grid-cols-2"
            : "grid gap-3"
        }
      >
        {block.items.map((item, index) => (
          <RenderedSectionItem key={index} item={item} />
        ))}
      </div>
    </section>
  );
}

function Entry({ item }: { item: EntryBlock }) {
  const bullets = item.bullets.filter((bullet) => bullet.length > 0);

  return (
    <article className="grid gap-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h3
          className="text-[13px] font-semibold"
          style={{ fontFamily: "var(--resume-heading-font)" }}
        >
          {item.title}
        </h3>
        {item.meta ? (
          <span className="text-[10px] uppercase tracking-wide text-[var(--resume-muted)]">
            {item.meta}
          </span>
        ) : null}
      </div>
      {item.subtitle ? (
        <p className="text-[11px] font-medium text-[var(--resume-accent)]">{item.subtitle}</p>
      ) : null}
      {item.description ? (
        <p className="whitespace-pre-line text-[11px] leading-relaxed">{item.description}</p>
      ) : null}
      {bullets.length > 0 ? <BulletList items={bullets} /> : null}
    </article>
  );
}

function TextContent({ block }: { block: TextBlock }) {
  return <p className={TEXT_VARIANTS[block.variant]}>{block.content}</p>;
}

function BulletList({ items }: { items: string[] }) {
  const visibleItems = items.filter((item) => item.length > 0);
  if (visibleItems.length === 0) return null;

  return (
    <ul className="list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed">
      {visibleItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function TagList({ tags }: { tags: string[] }) {
  const visibleTags = tags.filter((tag) => tag.length > 0);
  if (visibleTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleTags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="rounded-full border border-[var(--resume-accent)] px-2 py-0.5 text-[10px] font-medium text-[var(--resume-accent)]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function Divider() {
  return <hr className="border-0 border-t border-[var(--resume-accent)] opacity-40" />;
}

function safeHref(value: string): string | undefined {
  return /^https?:\/\//i.test(value) ? value : undefined;
}
