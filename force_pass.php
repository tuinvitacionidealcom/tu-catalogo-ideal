<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=catalogo_ideal_local;charset=utf8mb4', 'root', '');
    $hash = password_hash('admin123', PASSWORD_BCRYPT);
    $stmt = $db->prepare("UPDATE panel_users SET password_hash = ? WHERE username = 'celebrarte'");
    $stmt->execute([$hash]);
    echo "Clave actualizada a admin123 para el usuario celebrarte\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
