import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { IconButton } from "@/ui";
import { AnnotationIcon } from "./AnnotationIcon";

type AnnotationToolbarContextValue = {
  annotationsVisible: boolean;
  annotationCount: number | null;
  toggleAnnotations: () => void;
  setAnnotationCount: (count: number | null) => void;
};

const AnnotationToolbarContext =
  createContext<AnnotationToolbarContextValue | null>(null);

export function AnnotationToolbarProvider({ children }: { children: ReactNode }) {
  const [annotationsVisible, setAnnotationsVisible] = useState(false);
  const [annotationCount, setAnnotationCount] = useState<number | null>(null);
  const toggleAnnotations = useCallback(() => {
    setAnnotationsVisible((current) => !current);
  }, []);
  const updateAnnotationCount = useCallback((count: number | null) => {
    setAnnotationCount(count);
    if (count === null) setAnnotationsVisible(false);
  }, []);

  const value = useMemo<AnnotationToolbarContextValue>(
    () => ({
      annotationsVisible,
      annotationCount,
      toggleAnnotations,
      setAnnotationCount: updateAnnotationCount,
    }),
    [annotationsVisible, annotationCount, toggleAnnotations, updateAnnotationCount],
  );

  return (
    <AnnotationToolbarContext.Provider value={value}>
      {children}
    </AnnotationToolbarContext.Provider>
  );
}

export function useAnnotationToolbar(): AnnotationToolbarContextValue {
  const context = useContext(AnnotationToolbarContext);
  if (!context) {
    throw new Error(
      "Annotation toolbar components must be used within <AnnotationToolbarProvider>",
    );
  }
  return context;
}

export function AnnotationToolbarButton() {
  const { annotationsVisible, annotationCount, toggleAnnotations } =
    useAnnotationToolbar();

  if (annotationCount === null) return null;

  const hasAnnotations = annotationCount > 0;
  const label = annotationsVisible ? "Hide notes" : "Show notes";

  return (
    <IconButton
      variant={annotationsVisible ? "primary" : "outline"}
      size="md"
      className="relative"
      aria-pressed={annotationsVisible}
      aria-label={hasAnnotations ? `${label} (${annotationCount})` : label}
      title={hasAnnotations ? `${label} (${annotationCount})` : label}
      onClick={toggleAnnotations}
    >
      <AnnotationIcon className="h-4 w-4" />
      {hasAnnotations ? (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-surface bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground"
        >
          {annotationCount > 99 ? "99+" : annotationCount}
        </span>
      ) : null}
    </IconButton>
  );
}
