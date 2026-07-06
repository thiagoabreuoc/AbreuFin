<?php
require_once __DIR__ . '/../config/session.php';
requireLogin();
// Sistema migrado para Web Push — use api/push_subscribe.php
jsonResponse(['ok' => true]);
