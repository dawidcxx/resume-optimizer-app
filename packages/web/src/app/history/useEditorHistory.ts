import type { Resume, ResumeAnnotations } from "@resume-optimzer-app/common";
import { useCallback, useEffect, useRef, useState } from "react";

export type EditorSnapshot = {
  resume: Resume;
  annotations: ResumeAnnotations;
};

export type EditorHistory = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

type UseEditorHistoryOptions = {
  snapshot: EditorSnapshot;
  onRestore: (snapshot: EditorSnapshot) => void;
  delay?: number;
  limit?: number;
};

function areSnapshotsEqual(a: EditorSnapshot, b: EditorSnapshot): boolean {
  if (a.resume === b.resume && a.annotations === b.annotations) return true;

  return (
    JSON.stringify(a.resume) === JSON.stringify(b.resume) &&
    JSON.stringify(a.annotations) === JSON.stringify(b.annotations)
  );
}

export function useEditorHistory({
  snapshot,
  onRestore,
  delay = 500,
  limit = 100,
}: UseEditorHistoryOptions): EditorHistory {
  const snapshotRef = useRef(snapshot);
  const onRestoreRef = useRef(onRestore);
  const lastCommittedRef = useRef(snapshot);
  const pendingBeforeRef = useRef<EditorSnapshot | null>(null);
  const undoStackRef = useRef<EditorSnapshot[]>([]);
  const redoStackRef = useRef<EditorSnapshot[]>([]);
  const timerRef = useRef<number | null>(null);
  const restoringRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  snapshotRef.current = snapshot;
  onRestoreRef.current = onRestore;

  const updateAvailability = useCallback(() => {
    setCanUndo(undoStackRef.current.length > 0 || pendingBeforeRef.current !== null);
    setCanRedo(redoStackRef.current.length > 0);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const commitPending = useCallback(() => {
    clearTimer();

    const before = pendingBeforeRef.current;
    if (!before) return;

    pendingBeforeRef.current = null;
    const current = snapshotRef.current;

    if (!areSnapshotsEqual(before, current)) {
      undoStackRef.current.push(before);
      if (undoStackRef.current.length > limit) {
        undoStackRef.current.shift();
      }
      redoStackRef.current = [];
    }

    lastCommittedRef.current = current;
    updateAvailability();
  }, [clearTimer, limit, updateAvailability]);

  useEffect(() => {
    if (restoringRef.current) {
      restoringRef.current = false;
      pendingBeforeRef.current = null;
      clearTimer();
      lastCommittedRef.current = snapshot;
      updateAvailability();
      return;
    }

    if (snapshot === lastCommittedRef.current) return;

    if (!pendingBeforeRef.current) {
      pendingBeforeRef.current = lastCommittedRef.current;
    }

    clearTimer();
    timerRef.current = window.setTimeout(commitPending, delay);
    updateAvailability();
  }, [snapshot, delay, commitPending, clearTimer, updateAvailability]);

  useEffect(() => clearTimer, [clearTimer]);

  const undo = useCallback(() => {
    commitPending();

    const target = undoStackRef.current.pop();
    if (!target) {
      updateAvailability();
      return;
    }

    redoStackRef.current.push(snapshotRef.current);
    restoringRef.current = true;
    onRestoreRef.current(target);
    updateAvailability();
  }, [commitPending, updateAvailability]);

  const redo = useCallback(() => {
    commitPending();

    const target = redoStackRef.current.pop();
    if (!target) {
      updateAvailability();
      return;
    }

    undoStackRef.current.push(snapshotRef.current);
    if (undoStackRef.current.length > limit) {
      undoStackRef.current.shift();
    }
    restoringRef.current = true;
    onRestoreRef.current(target);
    updateAvailability();
  }, [commitPending, limit, updateAvailability]);

  return { undo, redo, canUndo, canRedo };
}