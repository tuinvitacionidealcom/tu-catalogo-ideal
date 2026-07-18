<?php
/**
 * BACKEND ROUTER - Tu Catálogo Ideal v1.0
 */

// En producción: loguear errores, NO mostrarlos
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// CORS — permitir el dominio real + localhost para dev
$allowed_origins = [
    'https://www.tucatalogoideal.com',
    'https://tucatalogoideal.com',
    'http://127.0.0.1:5174',
    'http://localhost:5174'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://www.tucatalogoideal.com");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

define('SECURE_ACCESS', true);
date_default_timezone_set('America/Argentina/Buenos_Aires');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Conexión a la BD
require_once __DIR__ . '/config/db.php';

try {
    $request = $_GET['request'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Health Check
    if (empty($request)) {
        $db = Database::getInstance();
        echo json_encode([
            "status" => "online",
            "message" => "Tu Catálogo Ideal - Backend v1.0",
            "db" => "connected",
            "php_version" => phpversion()
        ]);
        exit;
    }

    $parts = explode('/', rtrim($request, '/'));
    $resource = $parts[0] ?? '';
    $param = $parts[1] ?? '';

    switch ($resource) {

        // =============================================
        // CONTACTOS / LEADS
        // =============================================
        case 'contacts':
            $db = Database::getInstance();

            if ($method === 'POST') {
                // Recibir lead desde formulario de contacto de un catálogo
                $input = json_decode(file_get_contents('php://input'), true);
                
                if (empty($input['name']) || empty($input['message'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "Nombre y mensaje son obligatorios"]);
                    exit;
                }

                $catalog_id = intval($input['catalog_id'] ?? 0);
                $name = htmlspecialchars(strip_tags($input['name']), ENT_QUOTES, 'UTF-8');
                $email = htmlspecialchars(strip_tags($input['email'] ?? ''), ENT_QUOTES, 'UTF-8');
                $phone = htmlspecialchars(strip_tags($input['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
                $message = htmlspecialchars(strip_tags($input['message']), ENT_QUOTES, 'UTF-8');

                $stmt = $db->query(
                    "INSERT INTO catalog_contacts (catalog_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)",
                    [$catalog_id, $name, $email, $phone, $message]
                );

                http_response_code(201);
                echo json_encode([
                    "status" => "ok",
                    "message" => "Consulta recibida correctamente",
                    "id" => $db->getConnection()->lastInsertId()
                ]);

            } elseif ($method === 'GET') {
                // Listar contactos de un catálogo (para el panel)
                if (empty($param)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Falta catalog_id"]);
                    exit;
                }
                $stmt = $db->query(
                    "SELECT * FROM catalog_contacts WHERE catalog_id = ? ORDER BY created_at DESC",
                    [intval($param)]
                );
                echo json_encode([
                    "status" => "ok",
                    "data" => $stmt->fetchAll()
                ]);
            }
            break;

        // =============================================
        // VISITAS / ANALYTICS
        // =============================================
        case 'visits':
            $db = Database::getInstance();

            if ($method === 'POST') {
                // Registrar una visita a un catálogo
                $input = json_decode(file_get_contents('php://input'), true);
                $catalog_id = intval($input['catalog_id'] ?? 0);
                
                if ($catalog_id <= 0) {
                    http_response_code(400);
                    echo json_encode(["error" => "catalog_id inválido"]);
                    exit;
                }

                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
                $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 255);

                $db->query(
                    "INSERT INTO catalog_visits (catalog_id, ip_address, user_agent) VALUES (?, ?, ?)",
                    [$catalog_id, $ip, $ua]
                );

                echo json_encode(["status" => "ok", "message" => "Visita registrada"]);

            } elseif ($method === 'GET') {
                // Obtener stats de visitas de un catálogo (para el panel)
                if (empty($param)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Falta catalog_id"]);
                    exit;
                }

                $cid = intval($param);

                // Total de visitas
                $total = $db->query(
                    "SELECT COUNT(*) as total FROM catalog_visits WHERE catalog_id = ?",
                    [$cid]
                )->fetch();

                // Visitas últimos 7 días
                $week = $db->query(
                    "SELECT COUNT(*) as total FROM catalog_visits WHERE catalog_id = ? AND visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
                    [$cid]
                )->fetch();

                // Visitas hoy
                $today = $db->query(
                    "SELECT COUNT(*) as total FROM catalog_visits WHERE catalog_id = ? AND DATE(visited_at) = CURDATE()",
                    [$cid]
                )->fetch();

                // Visitas por día (últimos 30 días)
                $daily = $db->query(
                    "SELECT DATE(visited_at) as fecha, COUNT(*) as visitas FROM catalog_visits WHERE catalog_id = ? AND visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(visited_at) ORDER BY fecha ASC",
                    [$cid]
                )->fetchAll();

                echo json_encode([
                    "status" => "ok",
                    "data" => [
                        "total" => intval($total['total']),
                        "last_7_days" => intval($week['total']),
                        "today" => intval($today['total']),
                        "daily" => $daily
                    ]
                ]);
            }
            break;

        // =============================================
        // CATÁLOGOS
        // =============================================
        case 'catalogs':
            $db = Database::getInstance();

            if ($method === 'GET') {
                if (!empty($param)) {
                    // Obtener catálogo por slug
                    $stmt = $db->query(
                        "SELECT * FROM catalogs WHERE slug = ? AND status = 'active'",
                        [$param]
                    );
                    $catalog = $stmt->fetch();
                    if ($catalog) {
                        echo json_encode(["status" => "ok", "data" => $catalog]);
                    } else {
                        http_response_code(404);
                        echo json_encode(["error" => "Catálogo no encontrado"]);
                    }
                } else {
                    // Listar catálogos activos
                    $stmt = $db->query("SELECT id, slug, business_name, business_type, status, created_at FROM catalogs WHERE status = 'active' ORDER BY created_at DESC");
                    echo json_encode(["status" => "ok", "data" => $stmt->fetchAll()]);
                }
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(["error" => "Recurso no encontrado: $resource"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error interno del servidor"]);
    // El error real se loguea en el servidor, no se expone al cliente
    error_log("Backend error: " . $e->getMessage());
}

