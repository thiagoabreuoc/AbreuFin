<?php
/* Sessão + helpers de autenticação e resposta JSON usados pelos endpoints da API */
require_once __DIR__ . '/db.php';

function startSession(int $cookieLifetimeSeconds = 0): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_set_cookie_params([
        'lifetime' => $cookieLifetimeSeconds,
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']),
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
    unset($user['google_id'], $user['google_photo'], $user['password_hash']);
    return $user;
}

/* Regra mínima de força de senha, compartilhada por cadastro, troca e
   redefinição de senha: pelo menos 8 caracteres, com letra e número. */
function validatePasswordStrength(string $pwd): ?string {
    if (strlen($pwd) < 8) return 'A senha deve ter ao menos 8 caracteres.';
    if (!preg_match('/[A-Za-z]/', $pwd)) return 'A senha deve conter pelo menos uma letra.';
    if (!preg_match('/[0-9]/', $pwd)) return 'A senha deve conter pelo menos um número.';
    return null;
}
