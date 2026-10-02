-- Evita nombres duplicados aunque cambien mayúsculas/minúsculas.
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_username_nocase
ON users(username COLLATE NOCASE);