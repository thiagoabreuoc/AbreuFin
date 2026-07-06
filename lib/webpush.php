<?php
/**
 * Minimal Web Push — RFC 8030 / RFC 8188 / RFC 8291 / RFC 7519
 * Pure PHP, sem dependências externas. Requer PHP 8.1+, ext-openssl.
 */

function wpB64Enc(string $b): string { return rtrim(strtr(base64_encode($b), '+/', '-_'), '='); }
function wpB64Dec(string $s): string { return base64_decode(strtr($s, '-_', '+/')); }

// Localiza openssl.cnf para instalações Windows onde OPENSSL_CONF não está definido
function wpOpenSslConf(): string {
    if (getenv('OPENSSL_CONF')) return '';  // já configurado, não forçar
    $candidates = [
        dirname(PHP_BINARY) . '\\extras\\ssl\\openssl.cnf',
        'C:\\php\\extras\\ssl\\openssl.cnf',
        'C:\\Program Files\\Common Files\\SSL\\openssl.cnf',
    ];
    foreach ($candidates as $f) {
        if ($f && file_exists($f)) return $f;
    }
    return '';
}

function wpVapidKeys(): array {
    $file = dirname(__DIR__, 2) . '/data/vapid.json';
    if (file_exists($file)) {
        $d = json_decode(file_get_contents($file), true);
        if (!empty($d['publicKey']) && !empty($d['privateKeyPem'])) return $d;
    }
    $cfg = wpOpenSslConf();
    $opts = ['curve_name' => 'prime256v1', 'private_key_type' => OPENSSL_KEYTYPE_EC];
    if ($cfg) $opts['config'] = $cfg;
    $key = openssl_pkey_new($opts);
    if (!$key) throw new RuntimeException('openssl_pkey_new falhou. Verifique ext-openssl e openssl.cnf.');
    $det = openssl_pkey_get_details($key);
    $pub = wpB64Enc("\x04" . $det['ec']['x'] . $det['ec']['y']);
    openssl_pkey_export($key, $pem, null, $cfg ? ['config' => $cfg] : []);
    $d = ['publicKey' => $pub, 'privateKeyPem' => $pem];
    if (!is_dir(dirname($file))) mkdir(dirname($file), 0770, true);
    file_put_contents($file, json_encode($d));
    return $d;
}

function wpVapidPublicKey(): string { return wpVapidKeys()['publicKey']; }

// SubjectPublicKeyInfo PEM para ponto EC P-256 não comprimido (65 bytes)
function wpEcPem(string $raw65): string {
    $der = "\x30\x59\x30\x13\x06\x07\x2a\x86\x48\xce\x3d\x02\x01"
         . "\x06\x08\x2a\x86\x48\xce\x3d\x03\x01\x07\x03\x42\x00" . $raw65;
    return "-----BEGIN PUBLIC KEY-----\n" . chunk_split(base64_encode($der), 64, "\n") . "-----END PUBLIC KEY-----\n";
}

// HKDF-Extract + HKDF-Expand (RFC 5869, SHA-256)
function wpHkdf(string $salt, string $ikm, string $info, int $len): string {
    $prk = hash_hmac('sha256', $ikm, $salt, true);
    $okm = ''; $t = '';
    for ($i = 1; strlen($okm) < $len; $i++) {
        $t = hash_hmac('sha256', $t . $info . chr($i), $prk, true);
        $okm .= $t;
    }
    return substr($okm, 0, $len);
}

// Converte assinatura DER ECDSA → raw r||s (64 bytes) para JWT ES256
function wpDerToRaw(string $der): string {
    $i = 2;                      // skip SEQUENCE tag + 1-byte len (P-256 ≤ 70 bytes)
    $i++;                        // skip INTEGER tag
    $rl = ord($der[$i++]);
    $r  = substr($der, $i, $rl); $i += $rl;
    $i++;                        // skip INTEGER tag
    $sl = ord($der[$i++]);
    $s  = substr($der, $i, $sl);
    if (strlen($r) > 32) $r = substr($r, -32);
    if (strlen($s) > 32) $s = substr($s, -32);
    return str_pad($r, 32, "\x00", STR_PAD_LEFT) . str_pad($s, 32, "\x00", STR_PAD_LEFT);
}

// Monta VAPID JWT (ES256) para o endpoint informado
function wpBuildJwt(string $endpoint): string {
    $kv  = wpVapidKeys();
    $aud = parse_url($endpoint, PHP_URL_SCHEME) . '://' . parse_url($endpoint, PHP_URL_HOST);
    $hdr = wpB64Enc(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
    $pay = wpB64Enc(json_encode(['aud' => $aud, 'exp' => time() + 43200, 'sub' => 'mailto:admin@ta.app']));
    $inp = "$hdr.$pay";
    openssl_sign($inp, $sig, $kv['privateKeyPem'], OPENSSL_ALGO_SHA256);
    return "$inp." . wpB64Enc(wpDerToRaw($sig));
}

// Criptografa payload conforme RFC 8291 (ECDH + HKDF) + RFC 8188 (aes128gcm)
function wpEncrypt(string $payload, string $p256dhB64, string $authB64): string {
    $uaPub = wpB64Dec($p256dhB64);  // 65 bytes: ponto EC do browser
    $auth  = wpB64Dec($authB64);    // 16 bytes: segredo de autenticação

    // Gera par de chaves efêmero do servidor
    $cfg  = wpOpenSslConf();
    $opts = ['curve_name' => 'prime256v1', 'private_key_type' => OPENSSL_KEYTYPE_EC];
    if ($cfg) $opts['config'] = $cfg;
    $asKey = openssl_pkey_new($opts);
    $asDet = openssl_pkey_get_details($asKey);
    $asPub = "\x04" . $asDet['ec']['x'] . $asDet['ec']['y'];  // 65 bytes

    // ECDH: segredo compartilhado
    $shared = openssl_pkey_derive(openssl_pkey_get_public(wpEcPem($uaPub)), $asKey);

    // RFC 8291: derivação do IKM
    $ikm = wpHkdf($auth, $shared, "WebPush: info\x00" . $uaPub . $asPub, 32);

    // RFC 8188: CEK e nonce
    $salt  = random_bytes(16);
    $cek   = wpHkdf($salt, $ikm, "Content-Encoding: aes128gcm\x00", 16);
    $nonce = wpHkdf($salt, $ikm, "Content-Encoding: nonce\x00", 12);

    // Cifra com AES-128-GCM (último registro: payload + delimitador \x02)
    $ct = openssl_encrypt($payload . "\x02", 'aes-128-gcm', $cek, OPENSSL_RAW_DATA, $nonce, $tag, '', 16);

    // Corpo RFC 8188: salt(16) + rs(4) + idlen(1) + keyid(65) + ct + tag(16)
    return $salt . pack('N', 4096) . chr(65) . $asPub . $ct . $tag;
}

// Envia push para um endpoint; retorna o HTTP status code
function wpSend(string $endpoint, string $p256dh, string $auth, string $payload): int {
    $kv   = wpVapidKeys();
    $jwt  = wpBuildJwt($endpoint);
    $body = wpEncrypt($payload, $p256dh, $auth);
    $ctx  = stream_context_create(['http' => [
        'method'        => 'POST',
        'header'        => implode("\r\n", [
            'Authorization: vapid t=' . $jwt . ',k=' . $kv['publicKey'],
            'Content-Type: application/octet-stream',
            'Content-Encoding: aes128gcm',
            'TTL: 86400',
            'Content-Length: ' . strlen($body),
        ]),
        'content'       => $body,
        'timeout'       => 10,
        'ignore_errors' => true,
    ]]);
    @file_get_contents($endpoint, false, $ctx);
    preg_match('/\s(\d{3})\s/', $http_response_header[0] ?? '', $m);
    return (int)($m[1] ?? 0);
}
