CREATE TABLE IF NOT EXISTS daily_gifts(
  user_id INTEGER NOT NULL,
  claim_date TEXT NOT NULL,
  claimed_at INTEGER NOT NULL,
  PRIMARY KEY(user_id,claim_date),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_daily_gifts_date ON daily_gifts(claim_date);
