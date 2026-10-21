import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/ui";
import { RenderedResume } from "../render/RenderedResume";
import { PrintIcon } from "./PrintIcon";

export type ResumePrintPreviewProps = {
  title: string;
  markup: string;
  onClose: () => void;
};

export function ResumePrintPreview({ title, markup, onClose }: ResumePrintPreviewProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} — ResumeFixer`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("print-mode");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("print-mode");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Print preview"
      className="fixed inset-0 z-50 overflow-auto bg-subtle print:static print:z-auto print:overflow-visible print:bg-white print:[color-scheme:light]"
    >
      <div className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur print:hidden">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              ← Back
            </Button>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="truncate text-sm font-medium">{title}</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => window.print()}>
            <PrintIcon className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[210mm] px-6 py-8 print:max-w-none print:p-0">
        <RenderedResume markup={markup} />
      </main>
    </div>,
    document.body,
  );
}
