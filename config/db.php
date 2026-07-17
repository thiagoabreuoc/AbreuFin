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

    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_category_groups_user ON category_groups(user_id)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_entries_user ON entries(user_id)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_resets_token ON password_resets(token)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(bucket, identifier, created_at)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id)");
}

function defaultReceitas(): array {
    return [
        ['tipo'=>'receita','name'=>'Bradesco Seguros','emoji'=>'🛡️','subs'=>[]],
        ['tipo'=>'receita','name'=>'Camila',          'emoji'=>'👤','subs'=>[]],
        ['tipo'=>'receita','name'=>'Inter',            'emoji'=>'🏦','subs'=>[]],
        ['tipo'=>'receita','name'=>'Mercado Bitcoin',  'emoji'=>'🪙','subs'=>[]],
        ['tipo'=>'receita','name'=>'Paradiso Clube',   'emoji'=>'🏊','subs'=>[]],
        ['tipo'=>'receita','name'=>'Freelance',        'emoji'=>'💻','subs'=>[]],
        ['tipo'=>'receita','name'=>'Investimentos',    'emoji'=>'📈','subs'=>[]],
        ['tipo'=>'receita','name'=>'Renda Passiva',    'emoji'=>'💰','subs'=>[]],
        ['tipo'=>'receita','name'=>'Salário',          'emoji'=>'💼','subs'=>[]],
        ['tipo'=>'receita','name'=>'Outros',           'emoji'=>'📌','subs'=>[]],
    ];
}

function defaultDespesas(): array {
    return [
        ['tipo'=>'despesa','name'=>'99 / Uber',               'emoji'=>'🚖','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Academia / Ginástica',    'emoji'=>'🏋️','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Apostas / Loteria',       'emoji'=>'🎲','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Barbeiro / Barbearia',    'emoji'=>'✂️','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Bradesco – Cartão',       'emoji'=>'💳','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Bradesco – Empréstimo',   'emoji'=>'🏦','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Bradesco – Parcelas',     'emoji'=>'📋','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Caixa Econômica',         'emoji'=>'🏦','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Celular / Claro',         'emoji'=>'📱','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Chaveiro',                'emoji'=>'🔑','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Combustível / Posto',     'emoji'=>'⛽','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Conta de Água',           'emoji'=>'💧','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Conta de Luz / Light',    'emoji'=>'💡','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Detran / Multa',          'emoji'=>'🚔','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Eletricista / Manutenção','emoji'=>'🔧','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Espaço dos Móveis',       'emoji'=>'🛋️','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Farmácia',                'emoji'=>'💊','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Inter',                   'emoji'=>'🏦','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Internet',                'emoji'=>'🌐','subs'=>[]],
        ['tipo'=>'despesa','name'=>'IPTU',                    'emoji'=>'🏛️','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Itaú',                    'emoji'=>'🏦','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Lanchonete',              'emoji'=>'🥪','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Lava-a-jato',             'emoji'=>'🚿','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Leroy Merlin',            'emoji'=>'🪚','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Mãe',                    'emoji'=>'👩','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Mercado / Supermercado',  'emoji'=>'🛒','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Padaria',                 'emoji'=>'🥐','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Paradiso Clube',          'emoji'=>'🏊','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Pilates',                 'emoji'=>'🧘','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Plano de Saúde',          'emoji'=>'❤️','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Portão / Reforma',        'emoji'=>'🚪','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Restaurante',             'emoji'=>'🍽️','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Rio Card',                'emoji'=>'🚌','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Streaming / Assinaturas', 'emoji'=>'📺','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Sueli',                   'emoji'=>'👤','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Vestuário / Roupas',      'emoji'=>'👕','subs'=>[]],
        ['tipo'=>'despesa','name'=>'Outros',                  'emoji'=>'📌','subs'=>[]],
    ];
}

function defaultCategories(): array {
    return array_merge(defaultReceitas(), defaultDespesas(), [
        ['tipo'=>'investimento','name'=>'Renda fixa',     'emoji'=>'🏦','subs'=>['CDB','Tesouro Direto','LCI/LCA']],
        ['tipo'=>'investimento','name'=>'Renda variável', 'emoji'=>'📈','subs'=>['Ações','FIIs','ETFs']],
        ['tipo'=>'investimento','name'=>'Previdência',    'emoji'=>'🔐','subs'=>['PGBL','VGBL']],
    ]);
}

function seedDefaultCategories(PDO $pdo, int $userId): void {
    $stmt = $pdo->prepare('INSERT INTO categories (user_id, tipo, name, emoji, subs) VALUES (?,?,?,?,?)');
    foreach (defaultCategories() as $c) {
        $stmt->execute([$userId, $c['tipo'], $c['name'], $c['emoji'], json_encode($c['subs'], JSON_UNESCAPED_UNICODE)]);
    }
}
