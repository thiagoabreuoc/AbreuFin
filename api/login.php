<?php
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/rate_limit.php';

$body = readJsonBody();
$email = trim(strtolower($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');
$remember = !empty($body['remember']);

startSession($remember ? 60 * 60 * 24 * 30 : 0);
requireCsrf();

$ip = rateLimitIdentifier();
enforceRateLimit('login_ip', $ip, 10, 900);
enforceRateLimit('login_email', $email, 8, 900);

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    recordAttempt('login_ip', $ip);
    recordAttempt('login_email', $email);
    jsonError('E-mail ou senha inválidos.', 401);
}

$stmt = db()->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    recordAttempt('login_ip', $ip);
    recordAttempt('login_email', $email);
    jsonError('E-mail ou senha inválidos.', 401);
}

clearAttempts('login_ip', $ip);
clearAttempts('login_email', $email);

session_regenerate_id(true);
$_SESSION['user_id'] = (int)$user['id'];

jsonResponse(['ok' => true, 'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]]);
