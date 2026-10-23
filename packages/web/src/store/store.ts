import { createStore, type Store } from "tinybase";
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db";

export const STORE_DB_NAME = "resume-optimizer";

export const store: Store = createStore();

let persistenceStarted = false;
let storeReady = false;
const storeReadyListeners = new Set<() => void>();

function markStoreReady(): void {
  if (storeReady) return;
  storeReady = true;
  for (const listener of storeReadyListeners) listener();
}

export function isStoreReady(): boolean {
  return storeReady;
}

export function subscribeStoreReady(listener: () => void): () => void {
  storeReadyListeners.add(listener);
  return () => {
    storeReadyListeners.delete(listener);
  };
}

export function startStorePersistence(): void {
  if (persistenceStarted) return;
  persistenceStarted = true;

  const persister = createIndexedDbPersister(store, STORE_DB_NAME);
  void persister
    .startAutoPersisting()
    .catch((error: unknown) => {
      persistenceStarted = false;
      console.error("Failed to start IndexedDB persistence", error);
    })
    .finally(markStoreReady);
}