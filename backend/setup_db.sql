-- Usar la BD creada desde el panel de Hostinger
-- (En Hostinger NO se puede hacer CREATE DATABASE desde SQL, ya viene creada)
USE `u506439444_catalogoideal`;

-- =============================================
-- PANEL USERS — Un usuario por catálogo
-- =============================================
CREATE TABLE IF NOT EXISTS `panel_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `catalog_id` INT NOT NULL DEFAULT 0,     -- ID numérico del catálogo en la tabla catalogs
  `catalog_slug` VARCHAR(100) NOT NULL,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- PANEL SESSIONS — Tokens de sesión (7 días)
-- =============================================
CREATE TABLE IF NOT EXISTS `panel_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `token` VARCHAR(64) UNIQUE NOT NULL,
  `catalog_id` INT NOT NULL DEFAULT 0,     -- ID numérico del catálogo
  `catalog_slug` VARCHAR(100) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- USUARIO INICIAL: birromi / admin123
-- Cambiar la contraseña desde Hostinger tras el deploy.
-- Hash bcrypt de "admin123"
-- =============================================
INSERT IGNORE INTO `panel_users` (`catalog_id`, `catalog_slug`, `username`, `password_hash`)
VALUES (1, 'birromi', 'birromi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Para agregar un nuevo catálogo en el futuro:
-- INSERT IGNORE INTO `panel_users` (`catalog_id`, `catalog_slug`, `username`, `password_hash`)
-- VALUES (2, 'nuevo-slug', 'usuario2', 'hash_bcrypt');

-- Catalogs Table
CREATE TABLE IF NOT EXISTS `catalogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `business_name` VARCHAR(150) NOT NULL,
  `business_type` VARCHAR(100),
  `contact_name` VARCHAR(150),
  `phone` VARCHAR(50),
  `description` TEXT,
  `extras` TEXT, -- JSON string representation of active extras
  `theme_config` TEXT, -- JSON string for styling settings
  `status` VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'inactive'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Catalog Contacts Table (For contact form submissions per catalog)
CREATE TABLE IF NOT EXISTS `catalog_contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `catalog_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150),
  `phone` VARCHAR(50),
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`catalog_id`) REFERENCES `catalogs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Catalog Products Table
CREATE TABLE IF NOT EXISTS `catalog_products` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Catalogs Default
INSERT IGNORE INTO `catalogs` (`id`, `slug`, `business_name`) VALUES 
(1, 'mr-bebidas', 'M.R Bebidas'),
(2, 'perla-fit', 'Perla Fit'),
(3, 'bakery-limon', 'Bakery Limón');

