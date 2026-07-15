<?php
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/rate_limit.php';
startSession();
requireCsrf();

enforceRateLimit('register_ip', rateLimitIdentifier(), 5, 900);

$body = readJsonBody();
$name = trim($body['name'] ?? '');
$email = trim(strtolower($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');

if ($name === '') jsonError('Informe seu nome.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonError('E-mail inválido.');
$strengthError = validatePasswordStrength($password);
if ($strengthError) jsonError($strengthError);

recordAttempt('register_ip', rateLimitIdentifier());

$pdo = db();

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) jsonError('Este e-mail já está cadastrado.', 409);

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?,?,?)');
$stmt->execute([$name, $email, $hash]);
$userId = (int)$pdo->lastInsertId();

seedDefaultCategories($pdo, $userId);

session_regenerate_id(true);
$_SESSION['user_id'] = $userId;

jsonResponse(['ok' => true, 'user' => ['id' => $userId, 'name' => $name, 'email' => $email]]);
