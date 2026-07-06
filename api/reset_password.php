<?php
require_once __DIR__ . '/../config/session.php';
startSession();
requireCsrf();

$body = readJsonBody();
$token = trim($body['token'] ?? '');
$password = (string)($body['password'] ?? '');

if ($token === '') jsonError('Token inválido.');
if (strlen($password) < 8) jsonError('Senha deve ter ao menos 8 caracteres.');

$pdo = db();
$stmt = $pdo->prepare('SELECT id, user_id, expires_at, used FROM password_resets WHERE token = ?');
$stmt->execute([$token]);
$reset = $stmt->fetch();

if (!$reset) jsonError('Link de redefinição inválido.', 404);
if ((int)$reset['used'] === 1) jsonError('Este link já foi utilizado.', 410);
if (new DateTime($reset['expires_at']) < new DateTime()) jsonError('Este link expirou. Solicite um novo.', 410);

$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$hash, $reset['user_id']]);
$pdo->prepare('UPDATE password_resets SET used = 1 WHERE id = ?')->execute([$reset['id']]);

jsonResponse(['ok' => true]);
