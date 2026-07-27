<?php
require_once __DIR__ . '/../config/session.php';
startSession();
requireLogin();

$user = currentUserRow();
if (!isAdminUser($user)) jsonError('Acesso negado.', 403);

$pdo = db();
$totalUsers = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM usage_events WHERE type = 'pwa_install'");
$stmt->execute();
$totalInstalls = (int)$stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(DISTINCT user_id) FROM usage_events WHERE type = 'pix_copy'");
$stmt->execute();
$totalPixCopies = (int)$stmt->fetchColumn();

jsonResponse([
    'ok' => true,
    'totalUsers' => $totalUsers,
    'totalInstalls' => $totalInstalls,
    'totalPixCopies' => $totalPixCopies,
]);
