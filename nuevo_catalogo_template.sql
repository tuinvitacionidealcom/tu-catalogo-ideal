-- =========================================================================
-- PLANTILLA: ALTA DE NUEVO CATÁLOGO EN phpMyAdmin
-- Tu Catálogo Ideal (Arquitectura Unificada)
-- =========================================================================
-- Instrucciones:
--   1. Abrí phpMyAdmin en Hostinger (base de datos: u506439444_catalogoideal)
--   2. Hacé clic en la pestaña "SQL"
--   3. Personalizá las variables debajo (slug, nombre, teléfono, usuario, contraseña)
--   4. Hacé clic en "Continuar" para ejecutar.
--
-- ✅ ¡Listo! El catálogo quedará accesible en:
--    - Público: https://tucatalogoideal.com/tu-slug
--    - Panel de gestión: https://tucatalogoideal.com/tu-slug/panel
-- =========================================================================

-- 1. DEFINÍ LOS DATOS DE TU NUEVO CLIENTE AQUÍ:
SET @slug        = 'nombre-cliente';          -- El slug de la URL (minúsculas, sin espacios, con guiones)
SET @nombre      = 'Nombre Comercial';        -- Nombre visible del negocio
SET @tipo        = 'Indumentaria / Eventos';  -- Rubro o tipo de negocio
SET @contacto    = 'Nombre del Dueño';        -- Nombre del contacto
SET @telefono    = '5491112345678';           -- WhatsApp (con 549, sin 15, sin espacios ni guiones)
SET @descripcion = 'Bienvenidos a nuestro catálogo digital. Conocé nuestros productos y servicios.';
SET @usuario     = 'nombrecliente';           -- Usuario para ingresar al panel
SET @password    = 'admin123';                -- Contraseña del panel (texto plano o hash bcrypt)

-- =========================================================================
-- NO HACE FALTA TOCAR NADA DE ACÁ PARA ABAJO
-- =========================================================================

-- Paso 1: Registrar el catálogo en la tabla `catalogs`
INSERT INTO `catalogs` 
  (`slug`, `business_name`, `business_type`, `contact_name`, `phone`, `description`, `status`, `created_at`, `updated_at`) 
VALUES 
  (@slug, @nombre, @tipo, @contacto, @telefono, @descripcion, 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  `business_name` = @nombre,
  `business_type` = @tipo,
  `contact_name`  = @contacto,
  `phone`         = @telefono,
  `description`   = @descripcion,
  `status`        = 'active',
  `updated_at`    = NOW();

-- Paso 2: Obtener el ID asignado a este catálogo
SELECT `id` INTO @catalog_id FROM `catalogs` WHERE `slug` = @slug LIMIT 1;

-- Paso 3: Crear el usuario para el panel de control
INSERT INTO `panel_users` 
  (`catalog_id`, `catalog_slug`, `username`, `password_hash`, `created_at`) 
VALUES 
  (@catalog_id, @slug, @usuario, @password, NOW())
ON DUPLICATE KEY UPDATE 
  `catalog_id`    = @catalog_id,
  `catalog_slug`  = @slug,
  `password_hash` = @password;

-- Paso 4: (Opcional) Producto de bienvenida inicial
INSERT INTO `catalog_products` 
  (`catalog_id`, `name`, `description`, `price`, `category`, `image`, `available`, `stock`)
VALUES
  (@catalog_id, 'Producto o Servicio de Ejemplo', 'Descripción de muestra. Podés editarlo o eliminarlo desde tu panel.', 0, 'GENERAL', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60', 1, 10);

-- Verificación final
SELECT 
  c.id AS catalog_id,
  c.slug,
  c.business_name,
  u.username AS panel_usuario,
  CONCAT('https://tucatalogoideal.com/', c.slug) AS url_catalogo,
  CONCAT('https://tucatalogoideal.com/', c.slug, '/panel') AS url_panel
FROM `catalogs` c
JOIN `panel_users` u ON u.catalog_id = c.id
WHERE c.slug = @slug;
