import * as pg from "drizzle-orm/pg-core";

export const files = pg.pgTable("files", {
  id: pg.uuid().notNull().primaryKey(),
  filename: pg.text("file_name").notNull(),
  sizeBytes: pg.integer("size_bytes").notNull(),
  mimeType: pg.text("mime_type").notNull(),
  createdAt: pg.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: pg.timestamp("expires_at", { withTimezone: true }),
});
