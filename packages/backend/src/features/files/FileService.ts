import { inject, injectable } from "@needle-di/core";
import {
  generateId,
  isNil,
  uuidFromStringUnchecked,
  type FileDetails,
  type Uuid,
} from "@resume-optimzer-app/common";
import { eq, inArray, lte } from "drizzle-orm";
import { Logger } from "@/lib/Logger";
import { CronService } from "@/shared/CronService";
import { DB, type DrizzleDb } from "@/shared/Db";
import type { OnDeinit } from "@/shared/OnDeinit";
import type { OnInit } from "@/shared/OnInit";
import { FileAlreadyExistsError } from "./error/FileAlreadyExistsError";
import { files } from "./model/files";
import { FileStorageService } from "./storage/FileStorageService";

export interface FileUpload {
  content: Uint8Array;
  filename: string;
  mimeType: string;
  expiresAt?: Date | null;
  fileId?: Uuid;
}

@injectable()
export class FileService implements OnInit, OnDeinit {
  private cronDispose: (() => void) | null = null;

  constructor(
    private readonly storage = inject(FileStorageService),
    private readonly db: DrizzleDb = inject(DB),
    private readonly cron = inject(CronService),
  ) {}

  async init(): Promise<void> {
    this.cronDispose = this.cron.register(FILE_EXPIRE_JOB_ID, ONE_HOUR_MS, () =>
      this.deleteExpiredFiles(),
    );
  }

  async deinit(): Promise<void> {
    this.cronDispose?.();
    this.cronDispose = null;
  }

  async uploadFile(upload: FileUpload): Promise<FileDetails> {
    const id = upload.fileId ?? generateId();
    const [inserted] = await this.db
      .insert(files)
      .values({
        id,
        filename: upload.filename,
        sizeBytes: upload.content.byteLength,
        mimeType: upload.mimeType,
        expiresAt: upload.expiresAt ?? null,
      })
      .onConflictDoNothing()
      .returning();

    if (isNil(inserted)) {
      throw new FileAlreadyExistsError();
    }

    try {
      await this.storage.put(id, upload.content);
    } catch (error) {
      await this.db.delete(files).where(eq(files.id, id));
      throw error;
    }

    return mapToFileDetails(inserted);
  }

  async getFileById(fileId: Uuid): Promise<FileDetails | null> {
    const [found] = await this.db.select().from(files).where(eq(files.id, fileId));
    return isNil(found) ? null : mapToFileDetails(found);
  }

  async resolveByFileIds(fileIds: Uuid[]): Promise<Map<Uuid, FileDetails>> {
    if (fileIds.length === 0) {
      return new Map();
    }
    const dbFiles = await this.db.select().from(files).where(inArray(files.id, fileIds));
    return new Map(
      dbFiles.map((it) => [uuidFromStringUnchecked(it.id), mapToFileDetails(it)]),
    );
  }

  async downloadFile(fileId: Uuid): Promise<Uint8Array | null> {
    return this.storage.get(fileId);
  }

  async deleteFile(fileId: Uuid): Promise<void> {
    await this.storage.delete(fileId);
    await this.db.delete(files).where(eq(files.id, fileId));
  }

  private async deleteExpiredFiles(): Promise<void> {
    const expired = await this.db
      .select({ id: files.id })
      .from(files)
      .where(lte(files.expiresAt, new Date()));

    if (expired.length === 0) {
      return;
    }

    for (const { id } of expired) {
      await this.storage.delete(uuidFromStringUnchecked(id));
    }

    await this.db.delete(files).where(
      inArray(
        files.id,
        expired.map((it) => it.id),
      ),
    );

    logger.info(`Deleted ${expired.length} expired files`);
  }
}

const logger = Logger.for(FileService);
const FILE_EXPIRE_JOB_ID = "files:expire";
const ONE_HOUR_MS = 60 * 60 * 1000;

function mapToFileDetails(dbFile: typeof files.$inferSelect): FileDetails {
  return {
    id: uuidFromStringUnchecked(dbFile.id),
    filename: dbFile.filename,
    sizeBytes: dbFile.sizeBytes,
    mimeType: dbFile.mimeType,
    createdAt: dbFile.createdAt,
    expiresAt: dbFile.expiresAt ?? null,
  };
}
