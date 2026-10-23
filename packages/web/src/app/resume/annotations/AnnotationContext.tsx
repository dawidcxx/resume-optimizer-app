import type { ResumeAnnotations } from "@resume-optimzer-app/common";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { moveAnnotationsAt, removeAnnotationsAt } from "./annotationPaths";

type AnnotationContextValue = {
  annotations: ResumeAnnotations;
  setAnnotation: (path: string, value: string) => void;
  removeAnnotationsAt: (arrayPath: string, index: number) => void;
  moveAnnotationsAt: (arrayPath: string, from: number, to: number) => void;
};

const AnnotationContext = createContext<AnnotationContextValue | null>(null);

export type AnnotationProviderProps = {
  annotations: ResumeAnnotations;
  onChange: (annotations: ResumeAnnotations) => void;
  children: ReactNode;
};

export function AnnotationProvider({ annotations, onChange, children }: AnnotationProviderProps) {
  const value = useMemo<AnnotationContextValue>(() => {
    function setAnnotation(path: string, annotation: string) {
      const next = { ...annotations };
      if (annotation.trim().length === 0) {
        delete next[path];
      } else {
        next[path] = annotation;
      }
      onChange(next);
    }

    return {
      annotations,
      setAnnotation,
      removeAnnotationsAt: (arrayPath, index) =>
        onChange(removeAnnotationsAt(annotations, arrayPath, index)),
      moveAnnotationsAt: (arrayPath, from, to) =>
        onChange(moveAnnotationsAt(annotations, arrayPath, from, to)),
    };
  }, [annotations, onChange]);

  return <AnnotationContext.Provider value={value}>{children}</AnnotationContext.Provider>;
}

export function useAnnotations(): AnnotationContextValue {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error("Annotation components must be used within <AnnotationProvider>");
  }
  return context;
}