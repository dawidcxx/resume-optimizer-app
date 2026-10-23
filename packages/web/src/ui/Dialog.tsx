import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type DialogContextValue = {
  titleId: string;
  descriptionId: string;
  requestClose: () => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return context;
}

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  function isInsideDialog(event: MouseEvent<HTMLDialogElement>): boolean {
    if (event.detail === 0) return true;
    const dialog = ref.current;
    if (!dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  }

  return (
    <DialogContext.Provider
      value={{ titleId, descriptionId, requestClose: () => onOpenChange(false) }}
    >
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          event.preventDefault();
          onOpenChange(false);
        }}
        onClick={(event) => {
          if (!isInsideDialog(event)) onOpenChange(false);
        }}
        className={cn(
          "m-auto w-[calc(100%-2rem)] max-w-md rounded-ui border border-border bg-surface p-5 text-foreground shadow-lg backdrop:bg-black/40",
          className,
        )}
      >
        {children}
      </dialog>
    </DialogContext.Provider>
  );
}

export function DialogHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("mb-4 grid gap-1", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: ComponentPropsWithRef<"h2">) {
  const { titleId } = useDialogContext();
  return <h2 id={titleId} className={cn("text-base font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentPropsWithRef<"p">) {
  const { descriptionId } = useDialogContext();
  return (
    <p id={descriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function DialogFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("mt-5 flex items-center justify-end gap-2", className)} {...props} />;
}

export function DialogClose({ className, ...props }: ComponentPropsWithRef<"button">) {
  const { requestClose } = useDialogContext();
  return <button type="button" onClick={requestClose} className={className} {...props} />;
}