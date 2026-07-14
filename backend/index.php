<?php
/**
 * BACKEND ROUTER - Tu Catálogo Ideal v1.0
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

define('SECURE_ACCESS', true);
date_default_timezone_set('America/Argentina/Buenos_Aires');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Health Check
    $request = $_GET['request'] ?? '';
    
    if (empty($request)) {
        echo json_encode([
            "status" => "online",
            "message" => "Tu Catálogo Ideal - Backend v1.0",
            "php_version" => phpversion()
        ]);
        exit;
    }

    $parts = explode('/', rtrim($request, '/'));
    $resource = $parts[0] ?? '';
    $slug = $parts[1] ?? '';

    switch ($resource) {
        case 'catalogs':
            // TODO: Catalog CRUD
            echo json_encode(["status" => "ok", "message" => "Catalogs endpoint ready"]);
            break;

        case 'contacts':
            // TODO: Contact form submissions
            echo json_encode(["status" => "ok", "message" => "Contacts endpoint ready"]);
            break;

        case 'visits':
            // TODO: Visit tracking
            echo json_encode(["status" => "ok", "message" => "Visits endpoint ready"]);
            break;

        default:
            http_response_code(404);
            echo json_encode(["error" => "Recurso no encontrado: $resource"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
