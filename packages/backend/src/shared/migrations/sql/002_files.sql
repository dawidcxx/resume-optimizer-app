CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY NOT NULL,
  file_name TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS files_expires_at_idx ON files (expires_at);
