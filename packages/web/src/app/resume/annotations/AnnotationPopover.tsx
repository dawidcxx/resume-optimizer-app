import { RESUME_ANNOTATION_MAX_LENGTH } from "@resume-optimzer-app/common";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Button, IconButton, Textarea } from "@/ui";
import { AnnotationIcon } from "./AnnotationIcon";
import { useAnnotations } from "./AnnotationContext";
import { useAnnotationToolbar } from "./AnnotationToolbar";

export type AnnotationPopoverProps = {
  path: string;
  label: string;
  trigger?: "icon" | "text";
  align?: "start" | "end";
  className?: string;
};

export function AnnotationPopover({
  path,
  label,
  trigger = "icon",
  align = "end",
  className,
}: AnnotationPopoverProps) {
  const { annotations, setAnnotation } = useAnnotations();
  const { annotationsVisible } = useAnnotationToolbar();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const value = annotations[path] ?? "";
  const hasValue = value.trim().length > 0;

  useEffect(() => {
    if (!annotationsVisible) setOpen(false);
  }, [annotationsVisible]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function clearAnnotation() {
    setAnnotation(path, "");
    setOpen(false);
  }

  if (!annotationsVisible) return null;

  const triggerProps = {
    "aria-expanded": open,
    "aria-haspopup": "dialog" as const,
    "aria-label": `${hasValue ? "Edit" : "Add"} note for ${label}`,
    title: `${hasValue ? "Edit" : "Add"} note`,
    onClick: () => setOpen((current) => !current),
  };

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      {trigger === "icon" ? (
        <IconButton
          {...triggerProps}
          size="sm"
          variant="ghost"
          className={cn(
            "relative h-6 w-6 rounded-full",
            hasValue
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground/60 hover:text-foreground",
          )}
        >
          <AnnotationIcon className="h-3.5 w-3.5" />
          {hasValue ? (
            <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
          ) : null}
        </IconButton>
      ) : (
        <Button
          {...triggerProps}
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2 text-xs",
            hasValue ? "text-primary" : "text-muted-foreground",
          )}
        >
          <AnnotationIcon className="h-3.5 w-3.5" />
          {hasValue ? "Edit note" : "Add note"}
        </Button>
      )}

      {open ? (
        <div
          role="dialog"
          aria-label={`Note for ${label}`}
          className={cn(
            "absolute top-full z-30 mt-1.5 w-72 max-w-[calc(100vw-2rem)] rounded-ui border border-border-strong bg-surface p-2.5 text-left shadow-lg",
            align === "start" ? "left-0" : "right-0",
          )}
        >
          <Textarea
            autoFocus
            aria-label={`Note for ${label}`}
            rows={3}
            maxLength={RESUME_ANNOTATION_MAX_LENGTH}
            value={value}
            onChange={(event) => setAnnotation(path, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder="Add extra context here"
            className="bg-background"
          />
          <div className="mt-2 flex items-center justify-end gap-1">
            {hasValue ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-danger hover:bg-danger/10"
                onClick={clearAnnotation}
              >
                Remove
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
