<?php
require_once __DIR__ . '/../config/session.php';

$userId = requireLogin();
$pdo    = db();

// GET: verifica se usuário tem subscrição ativa
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT id FROM push_subscriptions WHERE user_id=? LIMIT 1');
    $stmt->execute([$userId]);
    jsonResponse(['ok' => true, 'subscribed' => (bool)$stmt->fetch()]);
}

// POST: salva/atualiza subscrição
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireCsrf();
    $body     = readJsonBody();
    $endpoint = trim($body['endpoint'] ?? '');
    $p256dh   = trim($body['p256dh']   ?? '');
    $auth     = trim($body['auth']     ?? '');
    if (!$endpoint || !$p256dh || !$auth) jsonError('Dados inválidos.', 400);
    // Remove subscrições anteriores do usuário e insere a nova
    $pdo->prepare('DELETE FROM push_subscriptions WHERE user_id=?')->execute([$userId]);
    $pdo->prepare('INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) VALUES (?,?,?,?)')
        ->execute([$userId, $endpoint, $p256dh, $auth]);
    jsonResponse(['ok' => true]);
}

// DELETE: remove subscrição
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    requireCsrf();
    $pdo->prepare('DELETE FROM push_subscriptions WHERE user_id=?')->execute([$userId]);
    jsonResponse(['ok' => true]);
}

jsonError('Método não suportado.', 405);
