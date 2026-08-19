<?php
/* Sessão + helpers de autenticação e resposta JSON usados pelos endpoints da API */
require_once __DIR__ . '/db.php';

// Mesmo sem "Lembrar-me", a sessão precisa sobreviver a um fechamento
// rápido do app (PWA); 30min é o piso mínimo garantido. Com "Lembrar-me"
// (ou login via Google, que sempre usa essa duração), sobe pra 30 dias.
const SESSION_LIFETIME_SHORT = 60 * 30;
const SESSION_LIFETIME_LONG  = 60 * 60 * 24 * 30;

/* $cookieLifetimeSeconds nulo = chamada genérica (qualquer página/endpoint
   só retomando a sessão já aberta). Nesses casos reaplicamos a duração
   escolhida no login (via um cookie auxiliar "remember"), porque o PHP
   reenvia o Set-Cookie da sessão a cada chamada — sem isso, a próxima
   requisição depois do login já derrubava o "Lembrar-me" de volta pro
   piso curto. */
function startSession(?int $cookieLifetimeSeconds = null): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;

    if ($cookieLifetimeSeconds === null) {
        $cookieLifetimeSeconds = ($_COOKIE['remember'] ?? '') === 'long' ? SESSION_LIFETIME_LONG : SESSION_LIFETIME_SHORT;
    }

    $secure = !empty($_SERVER['HTTPS']);
    // GC padrão do PHP (~24min) apagaria o arquivo de sessão no servidor
    // antes do previsto — sempre alinhado à duração real escolhida, mesmo
    // no piso curto de 30min.
    ini_set('session.gc_maxlifetime', (string)$cookieLifetimeSeconds);
    setcookie('remember', $cookieLifetimeSeconds >= SESSION_LIFETIME_LONG ? 'long' : 'short', [
        'expires' => time() + $cookieLifetimeSeconds,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => $secure,
    ]);

    session_set_cookie_params([
        'lifetime' => $cookieLifetimeSeconds,
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => $secure,
    ]);
    session_start();
}

/* Token CSRF: gerado uma vez por sessão (anônima ou autenticada) e exigido
   em todo endpoint que altera estado, via header X-CSRF-Token. */
function csrfToken(): string {
    startSession();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function requireCsrf(): void {
    startSession();
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf'] ?? '';
    if ($expected === '' || $sent === '' || !hash_equals($expected, $sent)) {
        jsonError('Token CSRF inválido.', 403);
    }
}

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $status = 400): void {
    jsonResponse(['ok' => false, 'error' => $message], $status);
}

function readJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function currentUserId(): ?int {
    startSession();
    return $_SESSION['user_id'] ?? null;
}

function requireLogin(): int {
    $id = currentUserId();
    if (!$id) jsonError('Não autenticado.', 401);
    return $id;
}

function currentUserRow(): ?array {
    $id = currentUserId();
    if (!$id) return null;
    $stmt = db()->prepare('SELECT id, name, email, google_id, google_photo, password_hash, created_at FROM users WHERE id = ?');
    $stmt->execute([$id]);
    $user = $stmt->fetch();
    if (!$user) return null;
    $user['viaGoogle']    = $user['google_id'] !== null;
    $user['googlePhoto']  = $user['google_photo'] ?? '';
    $user['hasPassword']  = $user['password_hash'] !== '';
    $user['isAdmin']      = isAdminUser($user);
    unset($user['google_id'], $user['google_photo'], $user['password_hash']);
    return $user;
}

/* Item "Estatísticas" em Perfil só existe pra essa conta — checagem
   sempre refeita no servidor (api/admin_stats.php), nunca só escondida
   no front, já que qualquer usuário logado poderia chamar o endpoint
   direto. */
function isAdminUser(?array $user): bool {
    return $user !== null && strtolower((string)$user['email']) === 'thiagoabreuoc@gmail.com';
}

/* Regra mínima de força de senha, compartilhada por cadastro, troca e
   redefinição de senha: pelo menos 8 caracteres, com letra e número. */
function validatePasswordStrength(string $pwd): ?string {
    if (strlen($pwd) < 8) return 'A senha deve ter ao menos 8 caracteres.';
    if (!preg_match('/[A-Za-z]/', $pwd)) return 'A senha deve conter pelo menos uma letra.';
    if (!preg_match('/[0-9]/', $pwd)) return 'A senha deve conter pelo menos um número.';
    return null;
}
