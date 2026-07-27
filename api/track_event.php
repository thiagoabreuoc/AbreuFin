<?php
/* Log genérico de eventos de uso (instalação do PWA, cópia da chave Pix,
   etc.), pra alimentar o painel de estatísticas admin. */
require_once __DIR__ . '/../config/session.php';
startSession();
$userId = requireLogin();
requireCsrf();

$body = readJsonBody();
$type = (string)($body['type'] ?? '');
$meta = substr((string)($body['meta'] ?? ''), 0, 100);

$allowedTypes = ['pwa_install', 'pix_copy'];
if (!in_array($type, $allowedTypes, true)) jsonError('Tipo inválido.');

db()->prepare('INSERT INTO usage_events (user_id, type, meta) VALUES (?,?,?)')
    ->execute([$userId, $type, $meta]);

jsonResponse(['ok' => true]);
