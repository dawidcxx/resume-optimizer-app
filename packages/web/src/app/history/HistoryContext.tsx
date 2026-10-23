import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IconButton, RedoIcon, UndoIcon } from "@/ui";

type HistoryControls = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

type HistoryContextValue = {
  controls: HistoryControls | null;
  register: (controls: HistoryControls) => () => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])"),
  );
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [controls, setControls] = useState<HistoryControls | null>(null);
  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  const register = useCallback((next: HistoryControls) => {
    setControls(next);
    return () => {
      setControls((current) => (current === next ? null : current));
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const current = controlsRef.current;
      if (!current || event.isComposing || event.altKey) return;
      if (!event.metaKey && !event.ctrlKey) return;
      if (isTextEntryTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === "z") {
        if (event.shiftKey) {
          if (!current.canRedo) return;
          event.preventDefault();
          current.redo();
        } else {
          if (!current.canUndo) return;
          event.preventDefault();
          current.undo();
        }
        return;
      }

      if (key === "y" && !event.shiftKey) {
        if (!current.canRedo) return;
        event.preventDefault();
        current.redo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = useMemo<HistoryContextValue>(() => ({ controls, register }), [controls, register]);

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useRegisterHistory(controls: HistoryControls): void {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("History controls must be used within <HistoryProvider>");
  }

  const { undo, redo, canUndo, canRedo } = controls;
  const { register } = context;

  useEffect(() => {
    return register({ undo, redo, canUndo, canRedo });
  }, [register, undo, redo, canUndo, canRedo]);
}

export function HistoryButtons() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("History buttons must be used within <HistoryProvider>");
  }

  const { controls } = context;
  if (!controls) return null;

  return (
    <div className="flex items-center gap-0.5">
      <IconButton
        size="md"
        aria-label="Undo"
        aria-keyshortcuts="Control+Z Meta+Z"
        title="Undo (Ctrl+Z)"
        disabled={!controls.canUndo}
        onClick={controls.undo}
      >
        <UndoIcon className="h-4 w-4" />
      </IconButton>
      <IconButton
        size="md"
        aria-label="Redo"
        aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z"
        title="Redo (Ctrl+Shift+Z)"
        disabled={!controls.canRedo}
        onClick={controls.redo}
      >
        <RedoIcon className="h-4 w-4" />
      </IconButton>
    </div>
  );
}