import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { Children, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Column } from "./Column";

export type ColumnsProps = ResumeComponentProps<"Columns"> & {
  children?: ReactNode;
};

const GAP_CLASSES = {
  xs: "gap-x-2 gap-y-2",
  sm: "gap-x-3 gap-y-3",
  md: "gap-x-4 gap-y-4",
  lg: "gap-x-5 gap-y-5",
  xl: "gap-x-6 gap-y-6",
} as const;

const GAP_VALUES = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.5rem",
} as const;

function isRenderable(node: ReactNode): boolean {
  return (
    node !== null &&
    node !== undefined &&
    typeof node !== "boolean" &&
    !(typeof node === "string" && node.trim() === "")
  );
}

function columnCounts(total: number, columns: number): number[] {
  const counts = Array.from({ length: columns }, () => Math.floor(total / columns));
  const remaining = total % columns;

  for (let index = 0; index < remaining; index += 1) {
    counts[index] += 1;
  }

  return counts;
}

function groupChildren(children: ReactNode[], columns: number): ReactNode[][] {
  const counts = columnCounts(children.length, columns);
  let cursor = 0;

  return counts.map((count) => {
    const group = children.slice(cursor, cursor + count);
    cursor += count;
    return group;
  });
}

export function Columns({ ratio, gap, children }: ColumnsProps) {
  const weights = ratio.split(":").map(Number);
  const template = weights.map((value) => `${value}fr`).join(" ");
  const style = {
    "--resume-columns": template,
    "--resume-column-gap": GAP_VALUES[gap],
  } as CSSProperties;
  const items = Children.toArray(children).filter(isRenderable);
  const groups = groupChildren(items, weights.length);

  return (
    <div
      style={style}
      className={cn(
        "grid grid-cols-1 items-start [&>*]:min-w-0 print:break-inside-avoid",
        "@xl:grid-cols-[var(--resume-columns)]",
        GAP_CLASSES[gap],
      )}
    >
      {groups.map((group, index) => (
        <Column key={index}>{group}</Column>
      ))}
    </div>
  );
}