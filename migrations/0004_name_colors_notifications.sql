CREATE TABLE IF NOT EXISTS user_name_colors(
  user_id INTEGER NOT NULL,
  color_id TEXT NOT NULL,
  purchased_at INTEGER NOT NULL,
  PRIMARY KEY(user_id,color_id)
);

CREATE TABLE IF NOT EXISTS notifications(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  read_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_user_name_colors_user ON user_name_colors(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id,read_at);
