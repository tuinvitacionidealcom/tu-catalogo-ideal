<?php
// seo.php - Interceptor para inyectar SEO dinámico

// Mostrar errores en staging - QUITAR en producción final
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

define('SECURE_ACCESS', true);

try {
    require_once __DIR__ . '/backend/config/db.php';
} catch (Throwable $e) {
    // Si db.php falla, seguimos igual (servimos el HTML sin SEO dinámico)
}

$requestUri = $_SERVER['REQUEST_URI'];
// Extraer el slug del catálogo (primer segmento después de la raíz)
$parts = explode('/', trim(parse_url($requestUri, PHP_URL_PATH), '/'));
$slug = $parts[0] ?? '';

// Variables por defecto (Tu Catálogo Ideal)
$title = "Tu Catálogo Ideal | Catálogos Digitales Profesionales para Emprendedores";
$description = "Creá tu catálogo digital profesional en minutos. One-page con diseño premium para mostrar tus productos y servicios.";
$image = "https://www.tucatalogoideal.com/og-image.jpg"; // Genérica

if (!empty($slug) && $slug !== 'backend' && class_exists('Database')) {
    // Buscar el catálogo en la BD
    try {
        $db = Database::getInstance();
        $targetSlug = ($slug === 'celebrarte-julieta') ? 'celebrarte' : $slug;
        $stmt = $db->query("SELECT id, slug, business_name, description FROM catalogs WHERE slug = ? OR slug = ? LIMIT 1", [$slug, $targetSlug]);
        if ($catalog = $stmt->fetch()) {
            $catSlug = $catalog['slug'];
            $title = htmlspecialchars($catalog['business_name']) . " | Catálogo Digital";
            
            // Limpiar y acortar la descripción
            $clean_desc = strip_tags(str_replace(["\r", "\n"], " ", $catalog['description']));
            $description = htmlspecialchars(mb_substr($clean_desc, 0, 160) . (mb_strlen($clean_desc) > 160 ? '...' : ''));
            
            // 1. Prioridad: Logo o Foto de portada oficial del catálogo
            $publicDir = __DIR__;
            if (file_exists($publicDir . "/catalogos/{$catSlug}/logo.webp")) {
                $image = "https://www.tucatalogoideal.com/catalogos/{$catSlug}/logo.webp";
            } elseif (file_exists($publicDir . "/catalogos/{$catSlug}/foto-portada.webp")) {
                $image = "https://www.tucatalogoideal.com/catalogos/{$catSlug}/foto-portada.webp";
            } else {
                // 2. Fallback: Foto del primer producto en la BD
                $imgStmt = $db->query("SELECT image FROM catalog_products WHERE catalog_id = ? AND image != '' LIMIT 1", [$catalog['id']]);
                if ($prodImg = $imgStmt->fetch()) {
                    $rawImg = trim($prodImg['image']);
                    // Si viene como array JSON de hasta 5 fotos, extraer la primera foto
                    if (str_starts_with($rawImg, '[') && str_ends_with($rawImg, ']')) {
                        $decoded = json_decode($rawImg, true);
                        if (is_array($decoded) && !empty($decoded[0])) {
                            $rawImg = $decoded[0];
                        }
                    }
                    $image = htmlspecialchars($rawImg);
                }
            }
        }
    } catch (Exception $e) {
        // Ignorar errores de BD y servir el SEO genérico
    }
}

// Leer el index.html original de React
// En producción, seo.php estará en la misma carpeta que index.html
$indexPath = __DIR__ . '/index.html'; 
if (!file_exists($indexPath)) {
    $indexPath = __DIR__ . '/frontend/dist/index.html'; // Fallback local
}

if (!file_exists($indexPath)) {
    die("Error: index.html not found. Asegurate de construir (build) la app de React.");
}

$html = file_get_contents($indexPath);

// Reemplazar las etiquetas SEO usando expresiones regulares
$html = preg_replace('/<title>.*?<\/title>/s', "<title>$title</title>", $html);
$html = preg_replace('/<meta name="description" content=".*?"\s*\/>/s', "<meta name=\"description\" content=\"$description\" />", $html);
$html = preg_replace('/<meta property="og:title" content=".*?"\s*\/>/s', "<meta property=\"og:title\" content=\"$title\" />", $html);
$html = preg_replace('/<meta property="og:description" content=".*?"\s*\/>/s', "<meta property=\"og:description\" content=\"$description\" />", $html);

// Inyectar o reemplazar og:image
if (strpos($html, '<meta property="og:image"') !== false) {
    $html = preg_replace('/<meta property="og:image" content=".*?"\s*\/>/s', "<meta property=\"og:image\" content=\"$image\" />", $html);
} else {
    // Si no existe, la insertamos antes de og:url
    $html = str_replace('<meta property="og:url"', "<meta property=\"og:image\" content=\"$image\" />\n    <meta property=\"og:url\"", $html);
}

// Imprimir el HTML modificado al navegador o scraper de WhatsApp
echo $html;
