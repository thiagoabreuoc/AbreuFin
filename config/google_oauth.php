<?php
/* Configuração + helpers HTTP para o login com Google (OAuth 2.0).
   As credenciais reais vivem fora do webroot, em c:\meu-site\secrets\google_oauth.php */

function googleOAuthConfig(): array {
    return require dirname(__DIR__, 2) . '/secrets/google_oauth.php';
}

function httpPostForm(string $url, array $fields): ?array {
    $opts = ['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => http_build_query($fields),
        'timeout' => 10,
        'ignore_errors' => true,
    ]];
    $result = @file_get_contents($url, false, stream_context_create($opts));
    if ($result === false) return null;
    $data = json_decode($result, true);
    return is_array($data) ? $data : null;
}

function httpGetJson(string $url, string $bearerToken): ?array {
    $opts = ['http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer $bearerToken\r\n",
        'timeout' => 10,
        'ignore_errors' => true,
    ]];
    $result = @file_get_contents($url, false, stream_context_create($opts));
    if ($result === false) return null;
    $data = json_decode($result, true);
    return is_array($data) ? $data : null;
}
