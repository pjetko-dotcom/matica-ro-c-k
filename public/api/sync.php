<?php
/**
 * Matica RO(C)K – Sync API
 * Ukladanie / načítanie harmonogramov ako JSON súbory na serveri.
 *
 * Endpoint:  https://fourseasons.sk/matica-ro(c)k/api/sync.php?code={kod}
 *   GET  → vráti JSON pre daný kód
 *   POST → uloží JSON pre daný kód (body = raw JSON)
 *
 * Súbory sa ukladajú do:  api/data/{kod}.json
 */

// ── CORS hlavičky ──────────────────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Validácia kódu ─────────────────────────────────────────────────────────
$rawCode = $_GET['code'] ?? '';
$code    = preg_replace('/[^a-zA-Z0-9_-]/', '', $rawCode);

if (strlen($code) < 2) {
    http_response_code(400);
    echo json_encode(['error' => 'Kód musí mať minimálne 2 znaky']);
    exit;
}

// ── Cesta k dátovému súboru ────────────────────────────────────────────────
$dataDir  = __DIR__ . '/data/';
$filePath = $dataDir . $code . '.json';

// Vytvor priečinok ak neexistuje
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// ── GET – načítaj dáta ─────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(['error' => 'Nič sa nenašlo pre kód: ' . $code]);
        exit;
    }

    $content = file_get_contents($filePath);
    if ($content === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Chyba pri čítaní súboru']);
        exit;
    }

    echo $content;
    exit;
}

// ── POST – ulož dáta ───────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');

    if (empty($body)) {
        http_response_code(400);
        echo json_encode(['error' => 'Telo požiadavky je prázdne']);
        exit;
    }

    // Overíme, že je to platný JSON
    $decoded = json_decode($body);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Neplatný JSON: ' . json_last_error_msg()]);
        exit;
    }

    $result = file_put_contents($filePath, $body, LOCK_EX);
    if ($result === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Chyba pri zápise súboru (skontroluj oprávnenia priečinka api/data/)']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Dáta uložené',
        'file'    => $code . '.json',
        'bytes'   => $result,
    ]);
    exit;
}

// ── Iná metóda ─────────────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(['error' => 'Metóda nie je povolená. Použi GET alebo POST.']);
