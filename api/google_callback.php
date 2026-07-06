<?php
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/google_oauth.php';

startSession();
$config = googleOAuthConfig();

function redirectWithGoogleError(string $code): void {
    header('Location: /index.php?google_error=' . urlencode($code));
    exit;
}

$state = $_GET['state'] ?? '';
$validState = hash_equals($_SESSION['google_oauth_state'] ?? '', $state) && $state !== '';
unset($_SESSION['google_oauth_state']);
if (!$validState) redirectWithGoogleError('state_invalido');

if (!empty($_GET['error'])) redirectWithGoogleError('acesso_negado');

$code = $_GET['code'] ?? '';
if (!$code) redirectWithGoogleError('codigo_ausente');

$tokenResponse = httpPostForm('https://oauth2.googleapis.com/token', [
    'code' => $code,
    'client_id' => $config['client_id'],
    'client_secret' => $config['client_secret'],
    'redirect_uri' => $config['redirect_uri'],
    'grant_type' => 'authorization_code',
]);

if (!$tokenResponse || empty($tokenResponse['access_token'])) redirectWithGoogleError('token_falhou');

$userInfo = httpGetJson('https://www.googleapis.com/oauth2/v3/userinfo', $tokenResponse['access_token']);

if (!$userInfo || empty($userInfo['email']) || empty($userInfo['email_verified'])) {
    redirectWithGoogleError('email_nao_verificado');
}

$pdo = db();
$email    = strtolower($userInfo['email']);
$googleId = (string)$userInfo['sub'];
$name     = $userInfo['name'] ?? explode('@', $email)[0];
$photo    = $userInfo['picture'] ?? '';

$stmt = $pdo->prepare('SELECT id, google_id FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    $pdo->prepare('UPDATE users SET google_id=?, google_photo=? WHERE id=?')
        ->execute([$googleId, $photo, $user['id']]);
    $userId = (int)$user['id'];
} else {
    $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, google_id, google_photo) VALUES (?,?,?,?,?)');
    $stmt->execute([$name, $email, '', $googleId, $photo]);
    $userId = (int)$pdo->lastInsertId();
    seedDefaultCategories($pdo, $userId);
}

session_regenerate_id(true);
$_SESSION['user_id'] = $userId;
header('Location: /index.php');
exit;
