import { defineProviders } from "@needle-di/core";
import { FileStorageService } from "./storage/FileStorageService";
import { LocalFileStorage } from "./storage/LocalFileStorage";

export const filesModule = defineProviders({
  provide: FileStorageService,
  useClass: LocalFileStorage,
});