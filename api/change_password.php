<?php
require_once __DIR__ . '/../config/session.php';

$userId = requireLogin();
requireCsrf();
$body = readJsonBody();
$new = (string)($body['newPassword'] ?? '');

if (strlen($new) < 8) jsonError('A nova senha deve ter ao menos 8 caracteres.');

$pdo = db();
$hash = password_hash($new, PASSWORD_DEFAULT);
$pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$hash, $userId]);

jsonResponse(['ok' => true]);
