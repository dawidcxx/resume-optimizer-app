import type {
  ImportedResume,
  RenderRole,
  ResumeAnnotations,
} from "@resume-optimzer-app/common";
import * as pg from "drizzle-orm/pg-core";

export const renderChats = pg.pgTable(
  "render_chats",
  {
    id: pg.uuid().notNull().primaryKey(),
    projectId: pg.uuid("project_id").notNull(),
    resumeSnapshot: pg
      .jsonb("resume_snapshot")
      .$type<ImportedResume>()
      .notNull(),
    annotationsSnapshot: pg
      .jsonb("annotations_snapshot")
      .$type<ResumeAnnotations>()
      .notNull(),
    aiInstructions: pg.text("ai_instructions").notNull(),
    targetJobDescription: pg.text("target_job_description").notNull(),
    initialMarkup: pg.text("initial_markup").notNull(),
    createdAt: pg
      .timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: pg
      .timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [pg.index("render_chats_project_id_idx").on(table.projectId)],
);

export const renderChatMessages = pg.pgTable(
  "render_chat_messages",
  {
    id: pg.uuid().notNull().primaryKey(),
    chatId: pg
      .uuid("chat_id")
      .notNull()
      .references(() => renderChats.id, { onDelete: "cascade" }),
    seq: pg.integer().notNull(),
    role: pg.text().$type<RenderRole>().notNull(),
    content: pg.text().notNull(),
    markup: pg.text(),
    inputTokens: pg.integer("input_tokens"),
    cachedTokens: pg.integer("cached_tokens"),
    outputTokens: pg.integer("output_tokens"),
    createdAt: pg
      .timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    pg
      .unique("render_chat_messages_chat_id_seq_unique")
      .on(table.chatId, table.seq),
  ],
);
