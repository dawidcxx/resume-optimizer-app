import type { Resume, ResumeProject } from "@resume-optimzer-app/common";
import { useEffect, useMemo, useState } from "react";
import {
  readResume,
  readResumeBundle,
  readResumeProject,
  readResumeProjects,
  type ResumeBundle,
} from "./selectors";
import { store } from "./store";

function useTablesVersion(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const listenerId = store.addTablesListener(() => setVersion((current) => current + 1));
    return () => {
      store.delListener(listenerId);
    };
  }, []);

  return version;
}

export function useResumeProjects(): ResumeProject[] {
  const version = useTablesVersion();
  return useMemo(() => readResumeProjects(store), [version]);
}

export function useResumeProject(id: string): ResumeProject | undefined {
  const version = useTablesVersion();
  return useMemo(() => readResumeProject(store, id), [version, id]);
}

export function useResume(id: string): Resume | undefined {
  const version = useTablesVersion();
  return useMemo(() => readResume(store, id), [version, id]);
}

export function useResumeBundle(id: string): ResumeBundle | undefined {
  const version = useTablesVersion();
  return useMemo(() => readResumeBundle(store, id), [version, id]);
}
