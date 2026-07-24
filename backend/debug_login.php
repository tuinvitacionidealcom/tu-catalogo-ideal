<?php
define('SECURE_ACCESS', true);
require_once __DIR__ . '/config/db.php';

$db = Database::getInstance();
$stmt = $db->query("SELECT * FROM panel_users WHERE username = ?", ['MR']);
$user = $stmt->fetch();

if (!$user) {
    echo "USER_NOT_FOUND";
} else {
    echo "USER_FOUND\n";
    echo "catalog_slug: " . $user['catalog_slug'] . "\n";
    echo "username: " . $user['username'] . "\n";
    echo "hash_in_db: " . $user['password_hash'] . "\n";
    $verify = password_verify('RomiMiguel2026', $user['password_hash']) ? 'TRUE' : 'FALSE';
    echo "verify_result: " . $verify . "\n";
}
