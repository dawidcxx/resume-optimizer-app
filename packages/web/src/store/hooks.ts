import type { Resume, ResumeProject } from "@resume-optimzer-app/common";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  readResume,
  readResumeBundle,
  readResumeProject,
  readResumeProjects,
  readResumeRenders,
  type ResumeBundle,
} from "./selectors";
import type { ResumeRender } from "./mappers";
import { isStoreReady, store, subscribeStoreReady } from "./store";

export function useStoreReady(): boolean {
  return useSyncExternalStore(subscribeStoreReady, isStoreReady, isStoreReady);
}

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

export function useResumeRenders(projectId: string): ResumeRender[] {
  const version = useTablesVersion();
  return useMemo(() => readResumeRenders(store, projectId), [version, projectId]);
}
