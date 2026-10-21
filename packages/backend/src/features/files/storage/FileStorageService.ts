import { InjectionToken } from "@needle-di/core";
import type { Uuid } from "@resume-optimzer-app/common";

export interface FileStorageService {
  put(key: Uuid, content: Uint8Array): Promise<void>;
  get(key: Uuid): Promise<Uint8Array | null>;
  exists(key: Uuid): Promise<boolean>;
  delete(key: Uuid): Promise<void>;
}

export const FileStorageService = new InjectionToken<FileStorageService>("FileStorageService");
