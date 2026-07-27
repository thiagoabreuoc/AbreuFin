<?php
/* Conexão SQLite (fora do webroot) + schema + seed de categorias padrão */

function db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dataDir = dirname(__DIR__, 2) . '/data';
    if (!is_dir($dataDir)) mkdir($dataDir, 0770, true);

    $pdo = new PDO('sqlite:' . $dataDir . '/abreufin.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON');

    migrate($pdo);
    return $pdo;
}

function migrate(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        google_id TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )");

    $userCols = array_column($pdo->query("PRAGMA table_info(users)")->fetchAll(), 'name');
    if (!in_array('google_id', $userCols, true)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN google_id TEXT");
    }
    $pdo->exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)");

    $pdo->exec("CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        used INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        tipo TEXT NOT NULL,
        name TEXT NOT NULL,
        emoji TEXT NOT NULL DEFAULT '📌',
        subs TEXT NOT NULL DEFAULT '[]'
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        tipo TEXT NOT NULL,
        categoria TEXT,
        subcategoria TEXT,
        valor REAL NOT NULL,
        dd INTEGER NOT NULL,
        mm INTEGER NOT NULL,
        yyyy INTEGER NOT NULL,
        status TEXT NOT NULL,
        obs TEXT NOT NULL DEFAULT '',
        repetir TEXT NOT NULL DEFAULT '',
        notif INTEGER NOT NULL DEFAULT 0,
        repeat_index INTEGER NOT NULL DEFAULT 0,
        repeat_total INTEGER NOT NULL DEFAULT 0,
        repeat_group_id INTEGER NOT NULL DEFAULT 0
    )");

    $entryCols = array_column($pdo->query("PRAGMA table_info(entries)")->fetchAll(), 'name');
    if (!in_array('repeat_index', $entryCols, true))
        $pdo->exec("ALTER TABLE entries ADD COLUMN repeat_index INTEGER NOT NULL DEFAULT 0");
    if (!in_array('repeat_total', $entryCols, true))
        $pdo->exec("ALTER TABLE entries ADD COLUMN repeat_total INTEGER NOT NULL DEFAULT 0");
    if (!in_array('repeat_group_id', $entryCols, true))
        $pdo->exec("ALTER TABLE entries ADD COLUMN repeat_group_id INTEGER NOT NULL DEFAULT 0");

    $pdo->exec("CREATE TABLE IF NOT EXISTS rate_limits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bucket TEXT NOT NULL,
        identifier TEXT NOT NULL,
        created_at INTEGER NOT NULL
    )");

    // Column migrations
    $userCols = array_column($pdo->query("PRAGMA table_info(users)")->fetchAll(), 'name');
    if (!in_array('cats_ver', $userCols, true))
        $pdo->exec("ALTER TABLE users ADD COLUMN cats_ver INTEGER NOT NULL DEFAULT 0");

    // WhatsApp notification settings
    $userCols = array_column($pdo->query("PRAGMA table_info(users)")->fetchAll(), 'name');
    if (!in_array('google_photo', $userCols, true))
        $pdo->exec("ALTER TABLE users ADD COLUMN google_photo TEXT NOT NULL DEFAULT ''");
    if (!in_array('whatsapp_phone', $userCols, true))
        $pdo->exec("ALTER TABLE users ADD COLUMN whatsapp_phone TEXT NOT NULL DEFAULT ''");
    if (!in_array('whatsapp_apikey', $userCols, true))
        $pdo->exec("ALTER TABLE users ADD COLUMN whatsapp_apikey TEXT NOT NULL DEFAULT ''");
    if (!in_array('whatsapp_enabled', $userCols, true))
        $pdo->exec("ALTER TABLE users ADD COLUMN whatsapp_enabled INTEGER NOT NULL DEFAULT 0");
    if (!in_array('whatsapp_last_notif', $userCols, true))
        $pdo->exec("ALTER TABLE users ADD COLUMN whatsapp_last_notif TEXT NOT NULL DEFAULT ''");

    $pdo->exec("CREATE TABLE IF NOT EXISTS category_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        tipo TEXT NOT NULL,
        name TEXT NOT NULL
    )");

    $catCols = array_column($pdo->query("PRAGMA table_info(categories)")->fetchAll(), 'name');
    if (!in_array('group_id', $catCols, true))
        $pdo->exec("ALTER TABLE categories ADD COLUMN group_id INTEGER REFERENCES category_groups(id)");

    // Web Push subscriptions
    $pdo->exec("CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )");
    $userCols = array_column($pdo->query("PRAGMA table_info(users)")->fetchAll(), 'name');
    if (!in_array('push_last_notif', $userCols, true))
        $pdo->exec("ALTER TABLE users ADD COLUMN push_last_notif TEXT NOT NULL DEFAULT ''");
    if (!in_array('insight_last_notif', $userCols, true))
        $pdo->exec("ALTER TABLE users ADD COLUMN insight_last_notif TEXT NOT NULL DEFAULT ''");

    // Eventos de uso pra estatísticas do painel admin (instalação do PWA,
    // cópia da chave Pix, etc.) — genérico por "type" pra não precisar de
    // migration nova a cada estatística adicionada no futuro.
    $pdo->exec("CREATE TABLE IF NOT EXISTS usage_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        type TEXT NOT NULL,
        meta TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )");

    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_category_groups_user ON category_groups(user_id)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_entries_user ON entries(user_id)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_resets_token ON password_resets(token)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(bucket, identifier, created_at)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_usage_events_type ON usage_events(type)");
}

