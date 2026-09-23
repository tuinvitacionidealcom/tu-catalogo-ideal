<?php
// seo.php - Interceptor para inyectar SEO dinámico
require_once __DIR__ . '/backend/config/db.php';

$requestUri = $_SERVER['REQUEST_URI'];
// Extraer el slug del catálogo (primer segmento después de la raíz)
$parts = explode('/', trim(parse_url($requestUri, PHP_URL_PATH), '/'));
$slug = $parts[0] ?? '';

// Variables por defecto (Tu Catálogo Ideal)
$title = "Tu Catálogo Ideal | Catálogos Digitales Profesionales para Emprendedores";
$description = "Creá tu catálogo digital profesional en minutos. One-page con diseño premium para mostrar tus productos y servicios.";
$image = "https://www.tucatalogoideal.com/og-image.jpg"; // Genérica

if (!empty($slug) && $slug !== 'backend') {
    // Buscar el catálogo en la BD
    try {
        $db = Database::getInstance();
        $stmt = $db->query("SELECT id, business_name, description FROM catalogs WHERE slug = ?", [$slug]);
        if ($catalog = $stmt->fetch()) {
            $title = htmlspecialchars($catalog['business_name']) . " | Catálogo Digital";
            
            // Limpiar y acortar la descripción
            $clean_desc = strip_tags(str_replace(["\r", "\n"], " ", $catalog['description']));
            $description = htmlspecialchars(mb_substr($clean_desc, 0, 140) . (mb_strlen($clean_desc) > 140 ? '...' : ''));
            
            // Intentar buscar la foto de algún producto para usar de portada en WhatsApp
            $imgStmt = $db->query("SELECT image FROM catalog_products WHERE catalog_id = ? AND image != '' LIMIT 1", [$catalog['id']]);
            if ($prodImg = $imgStmt->fetch()) {
                $image = htmlspecialchars($prodImg['image']);
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
