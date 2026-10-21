import {
  RESUME_IMPORT_MAX_BYTES,
  type ImportedResume,
} from "@resume-optimzer-app/common";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  Button,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Text,
  Textarea,
} from "@/ui";
import { Field } from "@/ui/form";
import { importResumeFile } from "@/api/resumeImport";

export type ImportResumeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: (resume: ImportedResume) => void;
};

const ACCEPTED_FILE_TYPES = ".pdf,.docx,.txt,.md,.json";

export function ImportResumeDialog({
  open,
  onOpenChange,
  onImported,
}: ImportResumeDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;

    setFile(null);
    setText("");
    setError(null);
    setIsImporting(false);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    const frame = requestAnimationFrame(() => textareaRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function selectFile(nextFile: File | null): void {
    if (!nextFile) return;

    if (nextFile.size > RESUME_IMPORT_MAX_BYTES) {
      setFile(null);
      setError(`That file is larger than ${formatBytes(RESUME_IMPORT_MAX_BYTES)}.`);
      return;
    }

    setFile(nextFile);
    setText("");
    setError(null);
  }

  async function handleImport(): Promise<void> {
    if (isImporting) return;

    const source =
      file ??
      (text.trim()
        ? new File([text], "pasted-resume.txt", { type: "text/plain" })
        : null);

    if (!source) {
      setError("Paste a resume or choose a file first.");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const resume = await importResumeFile(source);
      onImported(resume);
      onOpenChange(false);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Could not import the resume.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl!">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleImport();
        }}
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Import resume</DialogTitle>
          <DialogDescription>
            Drop a PDF, DOCX, or text file, or paste the contents. We'll extract what we can
            into a new resume for you to review.
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            selectFile(event.dataTransfer.files[0] ?? null);
          }}
          className={cn(
            "grid justify-items-center gap-2 rounded-ui border border-dashed border-border p-4 text-center transition-colors",
            isDragging && "border-primary bg-muted",
          )}
        >
          <Text variant="muted">
            {isDragging ? "Drop the file here." : "Drag and drop a resume file here."}
          </Text>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            Choose file
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            className="sr-only"
            onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
          />
          {file ? (
            <div className="flex items-center gap-2">
              <Text variant="subtle">
                {file.name} · {formatBytes(file.size)}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                disabled={isImporting}
              >
                Remove
              </Button>
            </div>
          ) : null}
        </div>

        <Field
          id="resume-import-text"
          label="Or paste resume text"
          description="Plain text works best. The file is deleted after analysis."
        >
          <Textarea
            ref={textareaRef}
            id="resume-import-text"
            rows={8}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (event.target.value.trim()) setFile(null);
            }}
            placeholder="Paste your resume here…"
            disabled={isImporting}
          />
        </Field>

        {error ? (
          <Text variant="subtle" className="text-danger">
            {error}
          </Text>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isImporting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isImporting}>
            {isImporting ? "Analyzing…" : "Import resume"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}
