import type { ResumeAnnotations } from "@resume-optimzer-app/common";

function remapArrayItems(
  annotations: ResumeAnnotations,
  arrayPath: string,
  mapIndex: (index: number) => number | null,
): ResumeAnnotations {
  const prefix = `${arrayPath}[`;
  const next: ResumeAnnotations = {};

  for (const [path, value] of Object.entries(annotations)) {
    if (!path.startsWith(prefix)) {
      next[path] = value;
      continue;
    }

    const close = path.indexOf("]", prefix.length);
    if (close < 0) {
      next[path] = value;
      continue;
    }

    const rawIndex = path.slice(prefix.length, close);
    if (!/^\d+$/.test(rawIndex)) {
      next[path] = value;
      continue;
    }

    const mappedIndex = mapIndex(Number(rawIndex));
    if (mappedIndex === null) continue;

    next[`${arrayPath}[${mappedIndex}]${path.slice(close + 1)}`] = value;
  }

  return next;
}

export function removeAnnotationsAt(
  annotations: ResumeAnnotations,
  arrayPath: string,
  index: number,
): ResumeAnnotations {
  return remapArrayItems(annotations, arrayPath, (current) => {
    if (current === index) return null;
    return current > index ? current - 1 : current;
  });
}

export function moveAnnotationsAt(
  annotations: ResumeAnnotations,
  arrayPath: string,
  from: number,
  to: number,
): ResumeAnnotations {
  if (from === to) return annotations;

  return remapArrayItems(annotations, arrayPath, (current) => {
    if (current === from) return to;
    if (from < to && current > from && current <= to) return current - 1;
    if (from > to && current >= to && current < from) return current + 1;
    return current;
  });
}