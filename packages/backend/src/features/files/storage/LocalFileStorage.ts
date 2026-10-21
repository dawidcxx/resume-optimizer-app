import * as fs from "node:fs/promises";
import * as path from "node:path";
import { inject, injectable } from "@needle-di/core";
import { requireNotNull, type Uuid } from "@resume-optimzer-app/common";
import { Config } from "@/shared/Config";
import type { FileStorageService } from "./FileStorageService";

@injectable()
export class LocalFileStorage implements FileStorageService {
  private readonly baseDir: string;

  constructor(config = inject(Config)) {
    this.baseDir = requireNotNull(config.fsStoragePath);
  }

  private getFilePath(key: Uuid): string {
    const clean = key.replace(/-/g, "");
    const dir1 = clean.slice(0, 2);
    const dir2 = clean.slice(2, 4);
    return path.join(this.baseDir, dir1, dir2, key);
  }

  async put(key: Uuid, content: Uint8Array): Promise<void> {
    const filePath = this.getFilePath(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content);
  }

  async get(key: Uuid): Promise<Uint8Array | null> {
    try {
      const filePath = this.getFilePath(key);
      return await fs.readFile(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  async exists(key: Uuid): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: Uuid): Promise<void> {
    try {
      const filePath = this.getFilePath(key);
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }
}
