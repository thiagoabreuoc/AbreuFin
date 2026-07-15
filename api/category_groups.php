<?php
require_once __DIR__ . '/../config/session.php';

$userId = requireLogin();
requireCsrf();
$pdo = db();

$id = (int)($_GET['id'] ?? 0);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = readJsonBody();
    $tipo = $body['tipo'] ?? '';
    $name = trim($body['name'] ?? '');

    if (!in_array($tipo, ['receita', 'despesa', 'investimento'], true)) jsonError('Tipo inválido.');
    if ($name === '') jsonError('Informe o nome do grupo.');
    if (mb_strlen($name) > 60) jsonError('Nome do grupo muito longo.');

    $stmt = $pdo->prepare('INSERT INTO category_groups (user_id, tipo, name) VALUES (?,?,?)');
    $stmt->execute([$userId, $tipo, $name]);

    jsonResponse(['ok' => true, 'group' => [
        'id' => (int)$pdo->lastInsertId(), 'tipo' => $tipo, 'name' => $name,
    ]]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (!$id) jsonError('ID inválido.');
    $row = $pdo->prepare('SELECT id FROM category_groups WHERE id=? AND user_id=?');
    $row->execute([$id, $userId]);
    if (!$row->fetch()) jsonError('Grupo não encontrado.', 404);

    $body = readJsonBody();
    $name = trim($body['name'] ?? '');
    if ($name === '') jsonError('Nome inválido.');
    if (mb_strlen($name) > 60) jsonError('Nome muito longo.');

    $pdo->prepare('UPDATE category_groups SET name=? WHERE id=?')->execute([$name, $id]);
    jsonResponse(['ok' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!$id) jsonError('ID inválido.');
    $row = $pdo->prepare('SELECT id FROM category_groups WHERE id=? AND user_id=?');
    $row->execute([$id, $userId]);
    if (!$row->fetch()) jsonError('Grupo não encontrado.', 404);

    $pdo->prepare('UPDATE categories SET group_id=NULL WHERE group_id=?')->execute([$id]);
    $pdo->prepare('DELETE FROM category_groups WHERE id=?')->execute([$id]);
    jsonResponse(['ok' => true]);
}

jsonError('Método não suportado.', 405);
