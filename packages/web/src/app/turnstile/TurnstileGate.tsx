import { TURNSTILE_ACTION } from "@resume-optimzer-app/common";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { configService } from "@/lib/config";
import { loadTurnstile, type TurnstileApi } from "@/lib/turnstile";
import { Button, Text } from "@/ui";

export type TurnstileGateReason = "import" | "render";

type TurnstileGateContextValue = {
  verify: (reason: TurnstileGateReason) => Promise<string>;
};

const TurnstileGateContext = createContext<TurnstileGateContextValue | null>(null);

export function TurnstileGateProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [reason, setReason] = useState<TurnstileGateReason>("render");
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const turnstileRef = useRef<TurnstileApi | null>(null);
  const resolveRef = useRef<((token: string) => void) | null>(null);
  const rejectRef = useRef<((error: Error) => void) | null>(null);
  const pendingRef = useRef<Promise<string> | null>(null);

  const closeDialog = useCallback(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
    setIsVisible(false);
  }, []);

  const settle = useCallback(
    (token: string) => {
      if (!resolveRef.current) return;
      resolveRef.current(token);
      resolveRef.current = null;
      rejectRef.current = null;
      closeDialog();
    },
    [closeDialog],
  );

  const fail = useCallback(
    (error: Error) => {
      if (!rejectRef.current) return;
      rejectRef.current(error);
      resolveRef.current = null;
      rejectRef.current = null;
      closeDialog();
    },
    [closeDialog],
  );

  const cancel = useCallback(() => {
    const turnstile = turnstileRef.current;
    if (turnstile && widgetIdRef.current) {
      turnstile.reset(widgetIdRef.current);
    }
    fail(new Error("Verification was cancelled."));
  }, [fail]);

  const verify = useCallback(
    async (nextReason: TurnstileGateReason): Promise<string> => {
      if (pendingRef.current) {
        return pendingRef.current;
      }

      setReason(nextReason);
      setIsVisible(false);

      const promise = new Promise<string>((resolve, reject) => {
        resolveRef.current = resolve;
        rejectRef.current = reject;
      });
      pendingRef.current = promise;

      try {
        const turnstile = await loadTurnstile();
        turnstileRef.current = turnstile;

        const container = containerRef.current;
        const dialog = dialogRef.current;
        if (!container || !dialog) {
          throw new Error("Verification could not start. Please try again.");
        }

        const siteKey = configService.turnstileSiteKey;

        if (!dialog.open) {
          dialog.showModal();
        }

        if (widgetIdRef.current === null) {
          widgetIdRef.current = turnstile.render(container, {
            sitekey: siteKey,
            action: TURNSTILE_ACTION,
            theme: "auto",
            size: "flexible",
            appearance: "interaction-only",
            execution: "execute",
            retry: "auto",
            callback: settle,
            "error-callback": () =>
              fail(new Error("Verification failed. Please try again.")),
            "expired-callback": () =>
              fail(new Error("Verification expired. Please try again.")),
            "timeout-callback": () =>
              fail(new Error("Verification timed out. Please try again.")),
            "before-interactive-callback": () => {
              if (resolveRef.current) setIsVisible(true);
            },
          });
        } else {
          turnstile.reset(widgetIdRef.current);
        }

        turnstile.execute(widgetIdRef.current);
      } catch (error) {
        fail(error instanceof Error ? error : new Error("Verification failed. Please try again."));
      }

      try {
        return await promise;
      } finally {
        pendingRef.current = null;
      }
    },
    [fail, settle],
  );

  useEffect(() => {
    if (!isVisible) return;

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        cancel();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cancel, isVisible]);

  return (
    <TurnstileGateContext.Provider value={{ verify }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          event.preventDefault();
          cancel();
        }}
        onMouseDown={(event) => {
          if (isVisible && event.target === event.currentTarget) cancel();
        }}
        className={cn(
          "m-auto w-[calc(100%-2rem)] max-w-sm overflow-visible border-0 bg-transparent p-0 text-foreground",
          isVisible ? "backdrop:bg-black/40" : "backdrop:bg-transparent",
        )}
      >
        <div
          className={cn(
            "grid gap-4 rounded-ui border border-border bg-surface p-5 shadow-lg",
            isVisible ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="grid gap-1">
            <h2 id={titleId} className="text-base font-semibold">
              Quick verification
            </h2>
            <p id={descriptionId} className="text-sm text-muted-foreground">
              Cloudflare is checking this browser before{" "}
              {reason === "import" ? "importing the resume" : "generating the render"}.
            </p>
          </div>

          <div ref={containerRef} className="min-h-[65px] w-full" />

          <div className="flex items-center justify-between gap-3">
            <Text variant="subtle" className="text-xs">
              This is only required once in a while.
            </Text>
            <Button variant="ghost" size="sm" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </div>
      </dialog>
    </TurnstileGateContext.Provider>
  );
}

export function useTurnstileGate(): TurnstileGateContextValue {
  const context = useContext(TurnstileGateContext);
  if (!context) {
    throw new Error("useTurnstileGate must be used within TurnstileGateProvider");
  }
  return context;
}
