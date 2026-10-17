import { createStore, type Store } from "tinybase";
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db";

export const STORE_DB_NAME = "resume-optimizer";

export const store: Store = createStore();

let persistenceStarted = false;

export function startStorePersistence(): void {
  if (persistenceStarted) return;
  persistenceStarted = true;

  const persister = createIndexedDbPersister(store, STORE_DB_NAME);
  void persister.startAutoPersisting().catch((error: unknown) => {
    persistenceStarted = false;
    console.error("Failed to start IndexedDB persistence", error);
  });
}
