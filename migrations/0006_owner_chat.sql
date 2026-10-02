-- Chat persistente del OWNER, separado de los broadcasts globales.
CREATE TABLE IF NOT EXISTS owner_chat_messages(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_user_id INTEGER NOT NULL,
  sender_username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_owner_chat_created
ON owner_chat_messages(created_at);
