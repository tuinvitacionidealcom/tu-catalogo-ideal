-- Database Creation
CREATE DATABASE IF NOT EXISTS `catalogo_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `catalogo_db`;

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

-- Catalog Visits Table (For analytics)
CREATE TABLE IF NOT EXISTS `catalog_visits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `catalog_id` INT NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` VARCHAR(255),
  `visited_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`catalog_id`) REFERENCES `catalogs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
