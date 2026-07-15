<?php
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/rate_limit.php';

$userId = requireLogin();
requireCsrf();

$identifier = 'user:' . $userId;
enforceRateLimit('change_password', $identifier, 8, 900);

$body = readJsonBody();
$current = (string)($body['currentPassword'] ?? '');
$new = (string)($body['newPassword'] ?? '');

$pdo = db();
$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$userId]);
$row = $stmt->fetch();
if (!$row) jsonError('Usuário não encontrado.', 404);

$hasPassword = $row['password_hash'] !== '';

if ($hasPassword) {
    if ($current === '' || !password_verify($current, $row['password_hash'])) {
        recordAttempt('change_password', $identifier);
        jsonError('Senha atual incorreta.', 401);
    }
}

$strengthError = validatePasswordStrength($new);
if ($strengthError) jsonError($strengthError);

if ($hasPassword && password_verify($new, $row['password_hash'])) {
    jsonError('A nova senha deve ser diferente da atual.');
}

$hash = password_hash($new, PASSWORD_DEFAULT);
$pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$hash, $userId]);

clearAttempts('change_password', $identifier);
session_regenerate_id(true);

jsonResponse(['ok' => true]);
