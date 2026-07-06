<?php
require_once __DIR__ . '/../config/session.php';

$userId = requireLogin();
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') requireCsrf();
$pdo = db();

function validateEntryBody(array $body): array {
    $tipo = $body['tipo'] ?? '';
    $valor = (float)($body['valor'] ?? 0);
    $dd = (int)($body['dd'] ?? 0);
    $mm = (int)($body['mm'] ?? 0);
    $yyyy = (int)($body['yyyy'] ?? 0);
    if (!in_array($tipo, ['receita', 'despesa', 'investimento'], true)) jsonError('Tipo inválido.');
    if ($valor <= 0) jsonError('Informe um valor válido.');
    if (!$dd || !$mm || !$yyyy) jsonError('Informe a data completa.');
    return [
        'tipo' => $tipo,
        'categoria' => $body['categoria'] ?? '',
        'subcategoria' => $body['subcategoria'] ?? '',
        'valor' => $valor,
        'dd' => $dd, 'mm' => $mm, 'yyyy' => $yyyy,
        'status' => $body['status'] ?? 'pendente',
        'obs' => $body['obs'] ?? '',
        'repetir' => $body['repetir'] ?? '',
        'notif' => !empty($body['notif']) ? 1 : 0,
    ];
}

function insertEntry(PDO $pdo, int $userId, array $e): int {
    $stmt = $pdo->prepare('INSERT INTO entries (user_id, tipo, categoria, subcategoria, valor, dd, mm, yyyy, status, obs, repetir, notif) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
    $stmt->execute([$userId, $e['tipo'], $e['categoria'], $e['subcategoria'], $e['valor'], $e['dd'], $e['mm'], $e['yyyy'], $e['status'], $e['obs'], $e['repetir'], $e['notif']]);
    return (int)$pdo->lastInsertId();
}

if ($method === 'POST') {
    $body = readJsonBody();
    $entry = validateEntryBody($body);
    $createdIds = [insertEntry($pdo, $userId, $entry)];

    if ($entry['repetir'] === 'mensal' || $entry['repetir'] === 'anual') {
        $inc = $entry['repetir'] === 'mensal' ? 1 : 12;
        $curMM = $entry['mm']; $curYYYY = $entry['yyyy'];
        for ($i = 0; $i < 3; $i++) {
            $curMM += $inc;
            if ($curMM > 12) { $curMM -= 12; $curYYYY++; }
            $next = $entry; $next['mm'] = $curMM; $next['yyyy'] = $curYYYY; $next['status'] = 'pendente';
            $createdIds[] = insertEntry($pdo, $userId, $next);
        }
    }

    jsonResponse(['ok' => true, 'ids' => $createdIds]);
}

if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonError('ID inválido.');
    $stmt = $pdo->prepare('SELECT id FROM entries WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $userId]);
    if (!$stmt->fetch()) jsonError('Lançamento não encontrado.', 404);

    $body = readJsonBody();
    $entry = validateEntryBody($body);
    $stmt = $pdo->prepare('UPDATE entries SET tipo=?, categoria=?, subcategoria=?, valor=?, dd=?, mm=?, yyyy=?, status=?, obs=?, repetir=?, notif=? WHERE id=? AND user_id=?');
    $stmt->execute([$entry['tipo'], $entry['categoria'], $entry['subcategoria'], $entry['valor'], $entry['dd'], $entry['mm'], $entry['yyyy'], $entry['status'], $entry['obs'], $entry['repetir'], $entry['notif'], $id, $userId]);

    jsonResponse(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonError('ID inválido.');
    $stmt = $pdo->prepare('DELETE FROM entries WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $userId]);
    if ($stmt->rowCount() === 0) jsonError('Lançamento não encontrado.', 404);
    jsonResponse(['ok' => true]);
}

jsonError('Método não suportado.', 405);
