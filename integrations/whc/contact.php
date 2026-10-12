<?php
declare(strict_types=1);
// Deploy separately only after configuring and verifying the secured upstream.
// Full product, buyer and tender validation is performed by handleContact upstream.
function bridgeReceipt(mixed $body): bool {
    return is_array($body) && ($body['status'] ?? null) === 'accepted'
        && is_string($body['reference'] ?? null)
        && preg_match('/^[A-Za-z0-9_-]{1,100}$/D', $body['reference']) === 1
        && is_string($body['acceptedAt'] ?? null)
        && preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/D', $body['acceptedAt']) === 1
        && strtotime($body['acceptedAt']) !== false;
}
function bridgeRateLimit(PDO $db, string $identity, int $now): bool {
    $db->exec('PRAGMA busy_timeout=2000');
    $db->exec('CREATE TABLE IF NOT EXISTS limits (identity TEXT PRIMARY KEY, start INTEGER NOT NULL, count INTEGER NOT NULL)');
    $db->exec('BEGIN IMMEDIATE');
    try {
        $delete = $db->prepare('DELETE FROM limits WHERE start <= ?');
        $delete->execute([$now - 600]);
        $insert = $db->prepare('INSERT INTO limits(identity,start,count) VALUES (?, ?, 1) ON CONFLICT(identity) DO UPDATE SET count=count+1');
        $insert->execute([$identity, $now]);
        $query = $db->prepare('SELECT count FROM limits WHERE identity=?');
        $query->execute([$identity]);
        $allowed = (int)$query->fetchColumn() <= 5;
        $db->exec('COMMIT');
        return $allowed;
    } catch (Throwable $e) {
        $db->exec('ROLLBACK');
        throw $e;
    }
}
function bridgeResponse(int $code, array $body): never {
    http_response_code($code);
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_THROW_ON_ERROR);
    exit;
}
function runBridge(): never {
    try {
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') bridgeResponse(405, ['error'=>'Method not allowed']);
        if (($_SERVER['HTTPS'] ?? '') !== 'on') bridgeResponse(403, ['error'=>'HTTPS required']);
        if (($_SERVER['HTTP_ORIGIN'] ?? '') !== 'https://beartraps.ca') bridgeResponse(403, ['error'=>'Origin not allowed']);
        if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') bridgeResponse(415, ['error'=>'Expected JSON']);
        $key = $_SERVER['HTTP_IDEMPOTENCY_KEY'] ?? '';
        if (!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/iD', $key)) bridgeResponse(400, ['error'=>'Invalid identifier']);
        $endpoint = getenv('CONTACT_UPSTREAM_URL') ?: '';
        $token = getenv('CONTACT_UPSTREAM_TOKEN') ?: '';
        $salt = getenv('CONTACT_RATE_SALT') ?: '';
        $dbPath = getenv('CONTACT_RATE_DB') ?: '';
        $parts = parse_url($endpoint);
        $parent = realpath(dirname($dbPath));
        $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
        if (!$parts || ($parts['scheme'] ?? '') !== 'https' || empty($parts['host']) || isset($parts['user']) || isset($parts['pass'])
            || strlen($token) < 32 || preg_match('/[\r\n]/', $token) || strlen($salt) < 32 || !$parent || !$root
            || $parent === $root || str_starts_with($parent, $root . DIRECTORY_SEPARATOR) || !is_writable($parent))
            bridgeResponse(503, ['error'=>'Online receipt unavailable. Email info@beartraps.ca directly.']);
        // REMOTE_ADDR only: forwarding headers supplied by clients are not trusted.
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        if (!filter_var($ip, FILTER_VALIDATE_IP)) bridgeResponse(503, ['error'=>'Unable to verify request']);
        umask(0077);
        $db = new PDO('sqlite:' . $dbPath, null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
        if (!bridgeRateLimit($db, hash_hmac('sha256', $ip, $salt), time())) {
            header('Retry-After: 600'); bridgeResponse(429, ['error'=>'Too many attempts. Retry later.']);
        }
        $raw = file_get_contents('php://input', false, null, 0, 128001);
        if ($raw === false || strlen($raw) > 128000) bridgeResponse(413, ['error'=>'Request too large']);
        try { $body = json_decode($raw, true, 32, JSON_THROW_ON_ERROR); }
        catch (JsonException) { bridgeResponse(400, ['error'=>'Invalid JSON']); }
        if (!is_array($body) || ($body['website'] ?? null) !== '' || ($body['consent'] ?? null) !== true
            || !is_string($body['message'] ?? null) || strlen($body['message']) > 12000)
            bridgeResponse(400, ['error'=>'Invalid message']);
        $curl = curl_init($endpoint);
        $response = '';
        curl_setopt_array($curl, [CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>$raw,
            CURLOPT_HTTPHEADER=>['Content-Type: application/json', 'Origin: https://beartraps.ca', 'Idempotency-Key: '.$key, 'Authorization: Bearer '.$token],
            CURLOPT_FOLLOWLOCATION=>false, CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS,
            CURLOPT_SSL_VERIFYPEER=>true, CURLOPT_SSL_VERIFYHOST=>2,
            CURLOPT_CONNECTTIMEOUT=>3, CURLOPT_TIMEOUT=>10,
            CURLOPT_WRITEFUNCTION=>static function($handle, string $chunk) use (&$response): int {
                if (strlen($response) + strlen($chunk) > 4096) return 0;
                $response .= $chunk; return strlen($chunk);
            }]);
        $ok = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        curl_close($curl);
        $receipt = json_decode($response, true);
        if ($ok !== false && $status === 202 && bridgeReceipt($receipt))
            bridgeResponse(202, array_intersect_key($receipt, array_flip(['status','reference','acceptedAt'])));
        if ($ok !== false && in_array($status, [400,403,409,429], true))
            bridgeResponse($status, ['error'=>'Request could not be accepted. Review your message or retry later.']);
        bridgeResponse(503, ['error'=>'Receipt was not confirmed. Keep your message and retry with the same identifier.']);
    } catch (Throwable) {
        // No payloads, IPs, exception messages or provider responses in logs.
        error_log('contact_bridge_unavailable');
        bridgeResponse(503, ['error'=>'Receipt unavailable. Email info@beartraps.ca directly.']);
    }
}
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) runBridge();
