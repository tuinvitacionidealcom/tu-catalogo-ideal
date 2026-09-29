-- ==========================================
-- SETUP DE NUEVO CATÁLOGO — Perla Fit
-- ==========================================
-- Instrucciones:
--   1. Abrí phpMyAdmin → catalogo_ideal_local
--   2. Andá a la pestaña SQL
--   3. Pegá este script completo y ejecutalo
-- ==========================================

-- PASO 1: Registrar el catálogo con su slug e ID fijo
INSERT INTO `catalogs` (`id`, `slug`, `business_name`, `business_type`, `contact_name`, `phone`, `description`, `status`)
VALUES (5, 'perla-fit', 'Perla Fit', 'Indumentaria Deportiva', 'Perla', '5491162721905',
        'Potenciá tu entrenamiento con indumentaria de alta compresión y calidad premium.', 'active')
ON DUPLICATE KEY UPDATE
    `slug` = 'perla-fit',
    `business_name` = 'Perla Fit',
    `status` = 'active';

-- PASO 2: Crear el usuario del panel (contraseña en texto plano, sin hash)
INSERT INTO `panel_users` (`catalog_id`, `catalog_slug`, `username`, `password_hash`)
VALUES (5, 'perla-fit', 'perlafit', 'password')
ON DUPLICATE KEY UPDATE
    `catalog_id` = 5,
    `catalog_slug` = 'perla-fit',
    `password_hash` = 'password';

-- ==========================================
-- ✅ LISTO! Panel accesible en:
--    URL: /perla-fit/panel
--    Usuario: perlafit
--    Contraseña: password
-- ==========================================
