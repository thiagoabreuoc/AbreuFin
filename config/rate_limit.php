<?php
/* Limitador de tentativas simples baseado em SQLite, usado para conter
   força bruta em login, registro e recuperação de senha. */
require_once __DIR__ . '/db.php';

function rateLimitIdentifier(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function tooManyAttempts(string $bucket, string $identifier, int $max, int $windowSeconds): bool {
    $pdo = db();
    $since = time() - $windowSeconds;
    $stmt = $pdo->prepare('SELECT COUNT(*) AS c FROM rate_limits WHERE bucket = ? AND identifier = ? AND created_at >= ?');
    $stmt->execute([$bucket, $identifier, $since]);
    return (int)$stmt->fetch()['c'] >= $max;
}

function recordAttempt(string $bucket, string $identifier): void {
    $pdo = db();
    $pdo->prepare('INSERT INTO rate_limits (bucket, identifier, created_at) VALUES (?,?,?)')
        ->execute([$bucket, $identifier, time()]);
}

function clearAttempts(string $bucket, string $identifier): void {
    $pdo = db();
    $pdo->prepare('DELETE FROM rate_limits WHERE bucket = ? AND identifier = ?')
        ->execute([$bucket, $identifier]);
}

function enforceRateLimit(string $bucket, string $identifier, int $max, int $windowSeconds): void {
    if (tooManyAttempts($bucket, $identifier, $max, $windowSeconds)) {
        jsonError('Muitas tentativas. Tente novamente em alguns minutos.', 429);
    }
}
