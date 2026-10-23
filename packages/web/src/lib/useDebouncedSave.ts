import { useEffect, useRef } from "react";

export function useDebouncedSave<T>(value: T, save: (value: T) => void, delay = 500): void {
  const saveRef = useRef(save);
  const valueRef = useRef(value);
  const savedValueRef = useRef(value);
  const pendingRef = useRef(false);

  saveRef.current = save;
  valueRef.current = value;

  useEffect(() => {
    if (value === savedValueRef.current) return;

    pendingRef.current = true;
    const timeout = window.setTimeout(() => {
      pendingRef.current = false;
      savedValueRef.current = valueRef.current;
      saveRef.current(valueRef.current);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  useEffect(() => {
    const flush = () => {
      if (!pendingRef.current) return;
      pendingRef.current = false;
      savedValueRef.current = valueRef.current;
      saveRef.current(valueRef.current);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      flush();
    };
  }, []);
}