<?php
require_once __DIR__ . '/../config/session.php';
startSession();
requireCsrf();
$_SESSION = [];
session_destroy();
jsonResponse(['ok' => true]);
