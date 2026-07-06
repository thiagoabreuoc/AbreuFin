<?php
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/google_oauth.php';

startSession();
$config = googleOAuthConfig();

if (empty($config['client_id'])) {
    http_response_code(500);
    echo 'Login com Google ainda não está disponível.';
    exit;
}

$state = bin2hex(random_bytes(16));
$_SESSION['google_oauth_state'] = $state;

$params = [
    'client_id' => $config['client_id'],
    'redirect_uri' => $config['redirect_uri'],
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'state' => $state,
    'access_type' => 'online',
    'prompt' => 'select_account',
];

header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params));
exit;
