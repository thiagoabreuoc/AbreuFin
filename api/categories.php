<?php
require_once __DIR__ . '/../config/session.php';

$userId = requireLogin();
requireCsrf();
$pdo = db();

$id = (int)($_GET['id'] ?? 0);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = readJsonBody();
    $tipo  = $body['tipo'] ?? '';
    $name  = trim($body['name'] ?? '');
    $emoji = trim($body['emoji'] ?? '') ?: '📌';

    if (!in_array($tipo, ['receita', 'despesa', 'investimento'], true)) jsonError('Tipo inválido.');
    if ($name === '') jsonError('Informe o nome da categoria.');
    if (mb_strlen($name) > 60) jsonError('Nome da categoria muito longo.');
    if (mb_strlen($emoji) > 8) jsonError('Emoji inválido.');

    $groupId = isset($body['group_id']) && $body['group_id'] ? (int)$body['group_id'] : null;
    if ($groupId) {
        $gck = $pdo->prepare('SELECT id FROM category_groups WHERE id=? AND user_id=?');
        $gck->execute([$groupId, $userId]);
        if (!$gck->fetch()) $groupId = null;
    }

    $stmt = $pdo->prepare('INSERT INTO categories (user_id, tipo, name, emoji, subs, group_id) VALUES (?,?,?,?,?,?)');
    $stmt->execute([$userId, $tipo, $name, $emoji, '[]', $groupId]);

    jsonResponse(['ok' => true, 'category' => [
        'id' => (int)$pdo->lastInsertId(), 'tipo' => $tipo, 'name' => $name,
        'emoji' => $emoji, 'subs' => [], 'groupId' => $groupId,
    ]]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (!$id) jsonError('ID inválido.');
    $row = $pdo->prepare('SELECT id FROM categories WHERE id=? AND user_id=?');
    $row->execute([$id, $userId]);
    if (!$row->fetch()) jsonError('Categoria não encontrada.', 404);

    $body = readJsonBody();
    $sets = []; $params = [];

    if (array_key_exists('subs', $body)) {
        $subs = array_values(array_filter(array_map('strval', (array)$body['subs']), fn($s) => $s !== ''));
        $sets[] = 'subs=?'; $params[] = json_encode($subs, JSON_UNESCAPED_UNICODE);
    }
    if (isset($body['name'])) {
        $name = trim($body['name']);
        if ($name === '') jsonError('Nome inválido.');
        $sets[] = 'name=?'; $params[] = $name;
    }
    if (isset($body['emoji'])) {
        $sets[] = 'emoji=?'; $params[] = trim($body['emoji']) ?: '📌';
    }
    if (!$sets) jsonError('Nada para atualizar.');
    $params[] = $id;
    $pdo->prepare('UPDATE categories SET ' . implode(',', $sets) . ' WHERE id=?')->execute($params);
    jsonResponse(['ok' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!$id) jsonError('ID inválido.');
    $row = $pdo->prepare('SELECT id FROM categories WHERE id=? AND user_id=?');
    $row->execute([$id, $userId]);
    if (!$row->fetch()) jsonError('Categoria não encontrada.', 404);
    $pdo->prepare('DELETE FROM categories WHERE id=?')->execute([$id]);
    jsonResponse(['ok' => true]);
}

jsonError('Método não suportado.', 405);
