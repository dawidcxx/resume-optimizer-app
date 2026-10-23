CREATE TABLE IF NOT EXISTS render_chats (
  id UUID PRIMARY KEY NOT NULL,
  project_id UUID NOT NULL,
  resume_snapshot JSONB NOT NULL,
  annotations_snapshot JSONB NOT NULL,
  ai_instructions TEXT NOT NULL,
  target_job_description TEXT NOT NULL,
  initial_markup TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS render_chats_project_id_idx ON render_chats (project_id);

CREATE TABLE IF NOT EXISTS render_chat_messages (
  id UUID PRIMARY KEY NOT NULL,
  chat_id UUID NOT NULL REFERENCES render_chats (id) ON DELETE CASCADE,
  seq INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  markup TEXT,
  input_tokens INTEGER,
  cached_tokens INTEGER,
  output_tokens INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT render_chat_messages_chat_id_seq_unique UNIQUE (chat_id, seq)
);
