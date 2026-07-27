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

// =============================================
// MIDDLEWARE — Autenticación por token Bearer
// =============================================
function requireAuth() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (strpos($authHeader, 'Bearer ') !== 0) {
        http_response_code(401);
        echo json_encode(["error" => "No autenticado"]);
        exit;
    }

    $token = substr($authHeader, 7);
    $db = Database::getInstance();

    $stmt = $db->query(
        "SELECT * FROM panel_sessions WHERE token = ? AND expires_at > NOW()",
        [$token]
    );
    $session = $stmt->fetch();

    if (!$session) {
        http_response_code(401);
        echo json_encode(["error" => "Sesión inválida o expirada"]);
        exit;
    }

    return $session;
}

try {
    $request = $_GET['request'] ?? '';
    $method  = $_SERVER['REQUEST_METHOD'];

    // Health Check
    if (empty($request)) {
        $db = Database::getInstance();
        echo json_encode([
            "status"      => "online",
            "message"     => "Tu Catálogo Ideal - Backend v1.0",
            "db"          => "connected",
            "php_version" => phpversion()
        ]);
        exit;
    }

    $parts    = explode('/', rtrim($request, '/'));
    $resource = $parts[0] ?? '';
    $sub      = $parts[1] ?? '';
    $param    = $parts[2] ?? '';

    switch ($resource) {

        // =============================================
        // AUTENTICACIÓN — /auth/login | /auth/logout | /auth/me
        // =============================================
        case 'auth':
            $db = Database::getInstance();

            if ($sub === 'login' && $method === 'POST') {
                $input    = json_decode(file_get_contents('php://input'), true);
                $username = trim($input['username'] ?? '');
                $password = trim($input['password'] ?? '');

                if (empty($username) || empty($password)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Usuario y contraseña son obligatorios"]);
                    exit;
                }

                $stmt = $db->query(
                    "SELECT * FROM panel_users WHERE username = ?",
                    [$username]
                );
                $user = $stmt->fetch();

                // Soporte dual: bcrypt (hash $2y$...) o texto plano (editable directo desde phpMyAdmin)
                $hash  = $user['password_hash'] ?? '';
                $valid = str_starts_with($hash, '$2y$')
                    ? password_verify($password, $hash)   // bcrypt
                    : ($password === $hash);              // texto plano

                if (!$user || !$valid) {
                    http_response_code(401);
                    echo json_encode(["error" => "Usuario o contraseña incorrectos"]);
                    exit;
                }

                // Generar token seguro (64 hex chars = 32 bytes)
                $token     = bin2hex(random_bytes(32));
                $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

                $db->query(
                    "INSERT INTO panel_sessions (token, catalog_id, catalog_slug, username, expires_at) VALUES (?, ?, ?, ?, ?)",
                    [$token, $user['catalog_id'], $user['catalog_slug'], $user['username'], $expiresAt]
                );

                $db->query(
                    "UPDATE panel_users SET last_login = NOW() WHERE id = ?",
                    [$user['id']]
                );

                echo json_encode([
                    "status"       => "ok",
                    "token"        => $token,
                    "catalog_id"   => intval($user['catalog_id']),
                    "catalog_slug" => $user['catalog_slug'],
                    "username"     => $user['username'],
                    "expires_at"   => $expiresAt
                ]);

            } elseif ($sub === 'logout' && $method === 'POST') {
                $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                if (strpos($authHeader, 'Bearer ') === 0) {
                    $token = substr($authHeader, 7);
                    $db->query("DELETE FROM panel_sessions WHERE token = ?", [$token]);
                }
                echo json_encode(["status" => "ok", "message" => "Sesión cerrada"]);

            } elseif ($sub === 'me' && $method === 'GET') {
                $session = requireAuth();
                echo json_encode([
                    "status"       => "ok",
                    "catalog_id"   => intval($session['catalog_id']),
                    "catalog_slug" => $session['catalog_slug'],
                    "username"     => $session['username'],
                    "expires_at"   => $session['expires_at']
                ]);

            } else {
                http_response_code(404);
                echo json_encode(["error" => "Ruta de auth no encontrada"]);
            }
            break;

        // =============================================
        // CONTACTOS / LEADS
        // =============================================
        case 'contacts':
            $db = Database::getInstance();

            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);

                if (empty($input['name']) || empty($input['message'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "Nombre y mensaje son obligatorios"]);
                    exit;
                }

                $catalog_id = intval($input['catalog_id'] ?? 0);
                $name       = htmlspecialchars(strip_tags($input['name']), ENT_QUOTES, 'UTF-8');
                $email      = htmlspecialchars(strip_tags($input['email'] ?? ''), ENT_QUOTES, 'UTF-8');
                $phone      = htmlspecialchars(strip_tags($input['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
                $message    = htmlspecialchars(strip_tags($input['message']), ENT_QUOTES, 'UTF-8');

                $db->query(
                    "INSERT INTO catalog_contacts (catalog_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)",
                    [$catalog_id, $name, $email, $phone, $message]
                );

                http_response_code(201);
                echo json_encode([
                    "status"  => "ok",
                    "message" => "Consulta recibida correctamente",
                    "id"      => $db->getConnection()->lastInsertId()
                ]);

            } elseif ($method === 'GET') {
                requireAuth();

                if (empty($sub)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Falta catalog_id"]);
                    exit;
                }
                $stmt = $db->query(
                    "SELECT * FROM catalog_contacts WHERE catalog_id = ? ORDER BY created_at DESC",
                    [intval($sub)]
                );
                echo json_encode([
                    "status" => "ok",
                    "data"   => $stmt->fetchAll()
                ]);
            }
            break;

        // =============================================
        // VISITAS / ANALYTICS
        // =============================================
        case 'visits':
            $db = Database::getInstance();

            if ($method === 'POST') {
                $input      = json_decode(file_get_contents('php://input'), true);
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
                requireAuth();

                if (empty($sub)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Falta catalog_id"]);
                    exit;
                }

                $cid = intval($sub);

                $total = $db->query(
                    "SELECT COUNT(*) as total FROM catalog_visits WHERE catalog_id = ?",
                    [$cid]
                )->fetch();

                $week = $db->query(
                    "SELECT COUNT(*) as total FROM catalog_visits WHERE catalog_id = ? AND visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
                    [$cid]
                )->fetch();

                $today = $db->query(
                    "SELECT COUNT(*) as total FROM catalog_visits WHERE catalog_id = ? AND DATE(visited_at) = CURDATE()",
                    [$cid]
                )->fetch();

                $daily = $db->query(
                    "SELECT DATE(visited_at) as fecha, COUNT(*) as visitas FROM catalog_visits WHERE catalog_id = ? AND visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(visited_at) ORDER BY fecha ASC",
                    [$cid]
                )->fetchAll();

                echo json_encode([
                    "status" => "ok",
                    "data"   => [
                        "total"       => intval($total['total']),
                        "last_7_days" => intval($week['total']),
                        "today"       => intval($today['total']),
                        "daily"       => $daily
                    ]
                ]);
            }
            break;

        // =============================================
        // SUBIDA DE IMÁGENES / ARCHIVOS
        // =============================================
        case 'upload':
            if ($method === 'POST') {
                $session = requireAuth();

                $uploadDir = __DIR__ . '/uploads/';
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
                $host = $_SERVER['HTTP_HOST'] ?? 'tucatalogoideal.com';
                $baseUrl = $protocol . $host . '/backend/uploads/';

                // 1. Archivo subido por multipart/form-data
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $fileTmp  = $_FILES['image']['tmp_name'];
                    $fileName = $_FILES['image']['name'];
                    $ext      = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                        $ext = 'webp';
                    }

                    $newFilename = 'img_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                    $targetPath  = $uploadDir . $newFilename;

                    if (move_uploaded_file($fileTmp, $targetPath)) {
                        echo json_encode(["status" => "ok", "url" => $baseUrl . $newFilename]);
                        exit;
                    }
                }

                // 2. Imagen base64 por JSON
                $input = json_decode(file_get_contents('php://input'), true);
                if (!empty($input['image_base64'])) {
                    $base64 = $input['image_base64'];
                    if (preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) {
                        $base64Data = substr($base64, strpos($base64, ',') + 1);
                        $type = strtolower($type[1]);
                        if (!in_array($type, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                            $type = 'webp';
                        }
                        $base64Data = base64_decode($base64Data);
                        if ($base64Data !== false) {
                            $newFilename = 'img_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $type;
                            file_put_contents($uploadDir . $newFilename, $base64Data);
                            echo json_encode(["status" => "ok", "url" => $baseUrl . $newFilename]);
                            exit;
                        }
                    }
                }

                http_response_code(400);
                echo json_encode(["error" => "No se envió ninguna imagen válida"]);
            }
            break;

        // =============================================
        // PRODUCTOS DE CATÁLOGOS
        // =============================================
        case 'products':
            $db = Database::getInstance();

            // Asegurar tabla catalog_products
            $db->query("CREATE TABLE IF NOT EXISTS `catalog_products` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `catalog_id` INT NOT NULL,
              `name` VARCHAR(255) NOT NULL,
              `description` TEXT,
              `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
              `category` VARCHAR(100) NOT NULL DEFAULT 'GENERAL',
              `image` TEXT,
              `available` TINYINT(1) DEFAULT 1,
              `stock` INT DEFAULT 0,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            if ($method === 'GET') {
                $catalog_id = intval($sub ?? 0);
                if ($catalog_id <= 0) {
                    http_response_code(400);
                    echo json_encode(["error" => "Falta catalog_id"]);
                    exit;
                }

                $stmt = $db->query(
                    "SELECT * FROM catalog_products WHERE catalog_id = ? ORDER BY id DESC",
                    [$catalog_id]
                );
                $products = $stmt->fetchAll();
                
                // Formatear tipos
                $formatted = array_map(function($p) {
                    return [
                        "id"          => intval($p['id']),
                        "catalog_id"  => intval($p['catalog_id']),
                        "name"        => $p['name'],
                        "description" => $p['description'] ?? '',
                        "price"       => floatval($p['price']),
                        "category"    => $p['category'],
                        "image"       => $p['image'],
                        "available"   => (bool)$p['available'],
                        "stock"       => intval($p['stock'])
                    ];
                }, $products);

                echo json_encode(["status" => "ok", "data" => $formatted]);

            } elseif ($method === 'POST') {
                $session = requireAuth();
                $input = json_decode(file_get_contents('php://input'), true);

                $catalog_id  = intval($input['catalog_id'] ?? $session['catalog_id'] ?? 1);
                $name        = trim($input['name'] ?? '');
                $description = trim($input['description'] ?? '');
                $price       = floatval($input['price'] ?? 0);
                $category    = trim($input['category'] ?? 'GENERAL');
                $image       = trim($input['image'] ?? '');
                $available   = isset($input['available']) ? ($input['available'] ? 1 : 0) : 1;
                $stock       = intval($input['stock'] ?? 0);
                $prod_id     = isset($input['id']) && is_numeric($input['id']) ? intval($input['id']) : null;

                if (empty($name)) {
                    http_response_code(400);
                    echo json_encode(["error" => "El nombre del producto es obligatorio"]);
                    exit;
                }

                if ($prod_id) {
                    // Verificar si existe para actualizar
                    $existing = $db->query("SELECT id FROM catalog_products WHERE id = ? AND catalog_id = ?", [$prod_id, $catalog_id])->fetch();
                    if ($existing) {
                        $db->query(
                            "UPDATE catalog_products SET name = ?, description = ?, price = ?, category = ?, image = ?, available = ?, stock = ? WHERE id = ? AND catalog_id = ?",
                            [$name, $description, $price, $category, $image, $available, $stock, $prod_id, $catalog_id]
                        );
                        echo json_encode(["status" => "ok", "message" => "Producto actualizado", "id" => $prod_id]);
                        exit;
                    }
                }

                // Insertar producto nuevo
                $db->query(
                    "INSERT INTO catalog_products (catalog_id, name, description, price, category, image, available, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [$catalog_id, $name, $description, $price, $category, $image, $available, $stock]
                );
                $newId = intval($db->getConnection()->lastInsertId());

                echo json_encode(["status" => "ok", "message" => "Producto creado", "id" => $newId]);

            } elseif ($method === 'DELETE') {
                $session = requireAuth();
                $prod_id = intval($sub ?? 0);

                if ($prod_id <= 0) {
                    http_response_code(400);
                    echo json_encode(["error" => "ID de producto inválido"]);
                    exit;
                }

                $db->query("DELETE FROM catalog_products WHERE id = ?", [$prod_id]);
                echo json_encode(["status" => "ok", "message" => "Producto eliminado"]);
            }
            break;

        // =============================================
        // CATÁLOGOS
        // =============================================
        case 'catalogs':
            $db = Database::getInstance();

            if ($method === 'GET') {
                if (!empty($sub)) {
                    $stmt    = $db->query(
                        "SELECT * FROM catalogs WHERE slug = ? AND status = 'active'",
                        [$sub]
                    );
                    $catalog = $stmt->fetch();
                    if ($catalog) {
                        echo json_encode(["status" => "ok", "data" => $catalog]);
                    } else {
                        http_response_code(404);
                        echo json_encode(["error" => "Catálogo no encontrado"]);
                    }
                } else {
                    $stmt = $db->query(
                        "SELECT id, slug, business_name, business_type, status, created_at FROM catalogs WHERE status = 'active' ORDER BY created_at DESC"
                    );
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
    error_log("Backend error: " . $e->getMessage());
}
