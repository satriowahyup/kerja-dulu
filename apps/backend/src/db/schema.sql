CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'User',
    monthly_income REAL NOT NULL,
    working_hours_per_week REAL DEFAULT 40,
    hourly_rate REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vault_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_category TEXT NOT NULL,
    price REAL NOT NULL,
    work_hours_required REAL NOT NULL,
    reason_to_buy TEXT,
    ai_verdict TEXT CHECK(ai_verdict IN ('dangerously_impulsive', 'questionable', 'reasonable')),
    ai_roast_critique TEXT NOT NULL,
    ai_reality_check TEXT NOT NULL,
    status TEXT CHECK(status IN ('cooling', 'bought', 'passed')) DEFAULT 'cooling',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    unlock_at DATETIME NOT NULL,
    resolved_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS savings_tracker (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    vault_item_id TEXT NOT NULL UNIQUE,
    saved_amount REAL NOT NULL,
    hours_reclaimed REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (vault_item_id) REFERENCES vault_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vault_user_status ON vault_items(user_id, status);
CREATE INDEX IF NOT EXISTS idx_vault_unlock ON vault_items(unlock_at);