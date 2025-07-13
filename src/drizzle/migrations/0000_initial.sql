CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  color TEXT DEFAULT '#3B82F6',
  position INTEGER DEFAULT 0,
  parent_task_id TEXT,
  is_recurring INTEGER DEFAULT 0,
  recurring_pattern TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);
