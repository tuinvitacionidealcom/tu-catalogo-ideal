-- Insertar el catálogo "Celebrarte"
INSERT INTO `catalogs` 
  (`slug`, `business_name`, `business_type`, `contact_name`, `phone`, `description`, `status`, `created_at`, `updated_at`) 
VALUES 
  ('celebrarte', 'Celebrarte by Juli', 'Eventos', 'Julieta', '5491131307799', 'Soy Julieta y te ayudo a que tu evento sea inolvidable!! 🎉\r\nRealizo ambientaciones 🌟\r\nFiesta del té ☕️🎂\r\nGlitter Bar ✨️✨️✨️\r\nCiudad Autónoma de BsAs', 'active', NOW(), NOW());

-- Obtener el ID del catálogo recién insertado (o reemplazar @catalog_id con el número correspondiente si ya existe)
SET @catalog_id = LAST_INSERT_ID();

-- Insertar los productos/servicios de Celebrarte
-- Nota: Asegurate de que los nombres de las columnas de `catalog_products` coincidan con tu base de datos.
INSERT INTO `catalog_products` 
  (`catalog_id`, `name`, `description`, `price`, `image`, `category`, `available`, `stock`) 
VALUES 
  (@catalog_id, 'Ambientaciones', 'Diseñamos y decoramos cada rincón para que tu evento sea único y mágico. Consultanos para conocer opciones y presupuesto a medida.', 0, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=60', 'SERVICIOS', 1, 99),
  (@catalog_id, 'Fiesta del Té', 'Toda la vajilla, decoración y detalles especiales para una tarde de té inolvidable con tus invitados.', 0, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=60', 'SERVICIOS', 1, 99),
  (@catalog_id, 'Glitter Bar', '¡Mucho brillo para tu fiesta! Un espacio divertido donde grandes y chicos pueden lookearse con maquillajes y glitter.', 0, 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=600&auto=format&fit=crop&q=60', 'SERVICIOS', 1, 99);
