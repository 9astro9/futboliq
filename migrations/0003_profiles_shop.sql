CREATE TABLE IF NOT EXISTS user_styles(
  user_id INTEGER NOT NULL,
  style_id TEXT NOT NULL,
  purchased_at INTEGER NOT NULL,
  PRIMARY KEY(user_id,style_id)
);

CREATE INDEX IF NOT EXISTS idx_user_styles_user ON user_styles(user_id);
