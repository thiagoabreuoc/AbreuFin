<?php
require_once __DIR__ . '/../config/session.php';

$userId = requireLogin();
requireCsrf();

$pdo = db();
$stmt = $pdo->prepare('SELECT google_id, password_hash FROM users WHERE id = ?');
$stmt->execute([$userId]);
$row = $stmt->fetch();
if (!$row) jsonError('Usuário não encontrado.', 404);

if ($row['google_id'] === null) jsonError('Esta conta não está conectada ao Google.');
if ($row['password_hash'] === '') {
    jsonError('Defina uma senha antes de desconectar do Google, senão você não vai conseguir mais entrar na conta.');
}

$pdo->prepare("UPDATE users SET google_id = NULL, google_photo = '' WHERE id = ?")->execute([$userId]);

jsonResponse(['ok' => true]);
