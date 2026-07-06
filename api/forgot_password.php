<?php
/* Gera um token de reset. Como não há SMTP configurado neste ambiente,
   o "link" é devolvido na própria resposta para a UI exibir (modo simulado). */
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/rate_limit.php';
startSession();
requireCsrf();

$body = readJsonBody();
$email = trim(strtolower($body['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonError('E-mail inválido.');

enforceRateLimit('forgot_ip', rateLimitIdentifier(), 6, 900);
enforceRateLimit('forgot_email', $email, 3, 3600);
recordAttempt('forgot_ip', rateLimitIdentifier());
recordAttempt('forgot_email', $email);

$pdo = db();
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

$response = ['ok' => true, 'message' => 'Se este e-mail estiver cadastrado, um link de redefinição foi gerado.'];

if ($user) {
    $token = bin2hex(random_bytes(32));
    $expiresAt = (new DateTime('+30 minutes'))->format('Y-m-d H:i:s');
    $stmt = $pdo->prepare('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?,?,?)');
    $stmt->execute([$user['id'], $token, $expiresAt]);

    /* Modo simulado (sem SMTP): o token só é devolvido na própria resposta
       quando a requisição vem do loopback local com um Host confiável —
       caso contrário, qualquer pessoa que soubesse o e-mail de outra conta
       poderia sequestrá-la apenas chamando este endpoint. */
    $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '';
    $isLoopback = in_array($remoteAddr, ['127.0.0.1', '::1'], true);
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $hostIsSafe = (bool)preg_match('/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i', $host);

    if ($isLoopback && $hostIsSafe) {
        $response['resetToken'] = $token;
        $response['resetLink'] = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $host . '/index.php?reset=' . $token;
    }
}

jsonResponse($response);
