# Tu Catálogo Ideal — Dirección de producto y frontend

Fecha: 23 de septiembre de 2026.

## Decisión de negocio

Modelo confirmado por Lucas: combinar armado inicial y autogestión. Tu Catálogo Ideal prepara el catálogo con la identidad y contenido del emprendimiento; el dueño mantiene productos, servicios, precios y disponibilidad desde el celular.

Propuesta: «Te armamos tu catálogo digital. Vos actualizás lo que vendés y recibís consultas por WhatsApp».

Propuesta comercial a validar: cobro inicial por configuración, identidad y carga acordada; mantenimiento mensual por alojamiento, panel y soporte acotado. Ofrecer carga de contenido como servicio adicional. Definir cantidad de artículos iniciales, revisiones, soporte incluido y plazos antes de fijar precios. No prometer entrega en minutos o 24 horas sin un proceso que lo respalde.

## Diagnóstico basado en el repositorio

No se verificó visualmente la web publicada: el lector web no pudo acceder al dominio. Esto no demuestra que esté caído. La revisión es de código local, con inspección detallada del flujo de MR. Bebidas y del servidor compartido; no equivale a probar todos los catálogos en producción.

Base existente: React y Vite; servidor PHP; acceso a MySQL; landing comercial; formulario que prepara una consulta por WhatsApp; cuatro catálogos con panel propio (MR. Bebidas, Celebrarte, Perla Fit y Bakery Limón). No se parte de cero.

| Prioridad | Evidencia | Consecuencia y trabajo |
| --- | --- | --- |
| P0 | backend/index.php: requireAuth verifica sesión; products POST acepta catalog_id del cliente, DELETE elimina por id sin acotar al catálogo; contacts y visits GET usan el id pedido sin compararlo con la sesión | Un usuario autenticado podría actuar sobre otro catálogo. Obtener pertenencia de la sesión y aplicarla a cada consulta privada. Verificar con dos usuarios de prueba en entorno aislado. |
| P0 | backend/index.php: login permite contraseñas en texto plano además de bcrypt | Preparar migración de cuentas a hash y retirar compatibilidad con texto plano sin bloquear usuarios existentes. |
| P0 | BirromiPanel.jsx: handleSaveProduct y handleDelete anuncian éxito aunque falle la petición; nudgeStock y saveStock usan guardado local | El dueño puede creer que publicó un cambio inexistente para otros visitantes. Confirmar éxito del servidor antes de anunciar publicación y ofrecer reintento. |
| P0 | constants/config.js contiene WhatsApp marcado CAMBIAR; ArmaTuCatalogoPage.jsx repite el número | Confirmar número comercial con Lucas y centralizarlo. No inventar ni publicar un contacto supuesto. |
| P1 | App.jsx enumera rutas por negocio; catalogos contiene cuatro familias de componentes y paneles | Cada alta exige copiar y mantener código. Extraer componentes comunes y configurar cada negocio por datos. |
| P1 | BirromiCatalogo.jsx combina datos iniciales, almacenamiento local y servidor; información comercial se lee del navegador | Definir servidor como fuente de datos publicados y distinguir borrador, carga, catálogo vacío y error. Auditar el mismo patrón en los otros negocios. |
| P1 | Hero.jsx promete «en minutos» y entrega «24hs»; ArmaTuCatalogoPage.jsx abre WhatsApp | El recorrido actual solicita un servicio; no crea automáticamente un catálogo. Alinear textos con armado asistido y plazo acordado. |
| P1 | Gallery.jsx muestra nombres y direcciones que no corresponden a las cuatro rutas de App.jsx | Usar ejemplos navegables comprobados; identificar como demo cualquier contenido de muestra. |
| P1 | App.jsx importa estáticamente todos los catálogos y paneles; compilación genera JS principal de 807,26 kB (222,06 kB gzip) | Separar carga por ruta y medir experiencia móvil antes y después. El tamaño por sí solo no mide velocidad percibida. |
| P1 | backend/index.php: subida de imágenes acepta extensión o prefijo base64 sin verificar contenido real y tamaño | Validar formato real, tamaño y límites antes de permitir cargas de más clientes. |

La compilación local terminó correctamente con Vite. El comando habitual de npm falló por una instalación local incompleta; se ejecutó el Vite instalado directamente. No se validaron sesiones reales, base de datos, publicación ni recorrido visual móvil. No se modificó funcionalidad ni se desplegó el sitio.

## Producto mínimo para vender y operar

Tres recorridos:

1. Lucas recibe nombre, rubro, logo, WhatsApp y contenido; configura una plantilla, revisa y entrega enlace y acceso.
2. El emprendedor entra desde el celular, agrega o edita un artículo, ve el resultado y guarda en el servidor.
3. El comprador abre el enlace, encuentra lo que busca, consulta el detalle y prepara un pedido o consulta por WhatsApp.

Panel inicial: Mi catálogo, Productos y servicios, Categorías, Datos del negocio y Compartir. Priorizar agregar, editar, ocultar, precio, imagen y disponibilidad. Mostrar guardando, guardado y error de forma inequívoca; evitar descartar el formulario ante errores. Incorporar vista previa y aviso de cambios sin guardar.

Catálogo público: marca y descripción breve, búsqueda, categorías, tarjetas legibles, detalle con foto y atributos, contacto visible, entrega o zona de servicio y enlace para compartir. Pedidos para productos; solicitud de información, presupuesto o disponibilidad para servicios. Abrir WhatsApp no confirma una venta ni una reserva.

## Una base, diferencias por rubro

| Rubro | Datos relevantes | Acción principal |
| --- | --- | --- |
| Fitness | Plan, duración, modalidad, frecuencia | Consultar plan |
| Birras/bebidas | Estilo, presentación, volumen, unidad o pack | Armar pedido |
| Cumpleaños/eventos | Paquete, duración, zona, inclusiones | Consultar fecha y presupuesto |
| Ropa | Talle, color, material, disponibilidad por variante | Elegir variante y pedir |
| Zapatillas | Modelo, talle, color, disponibilidad por variante | Elegir talle y pedir |
| Perfumes | Marca, volumen, concentración | Elegir presentación y pedir |
| Celulares | Modelo, capacidad, estado, condición y garantía informadas por el vendedor | Consultar equipo |

Interpretación provisional: «cumplesueños» corresponde a cumpleaños/eventos; confirmar si es una marca o un rubro distinto. Para el piloto usar un negocio de productos y uno de servicios. Después sumar ropa o zapatillas para validar variantes. No crear siete aplicaciones diferentes.

## Dirección técnica propuesta

Conservar React/Vite y PHP inicialmente. Separar datos del negocio, tema visual y componentes. Incorporar una capa común de acceso al servidor y autenticación. Cada catálogo debe tener id, slug, rubro, marca, tema y módulos habilitados; cada artículo debe distinguir producto o servicio y permitir precio fijo, desde o a consultar.

Agregar variantes con precio y disponibilidad propios donde corresponda; no simularlas solo en la descripción. Preparar configuración persistida de marca y contacto. Reservar las rutas comerciales y mantener las direcciones existentes al incorporar rutas dinámicas. Migrar un catálogo piloto y comparar comportamiento antes de extenderlo.

Definir contratos de API antes de unificar paneles: respuestas de éxito y error, aislamiento por catálogo, validación, productos vacíos y subida de imágenes. Separar datos de demostración de los publicados. No usar una sesión guardada localmente como prueba de autorización del servidor.

Diseño: estructura y componentes coherentes, colores y logo por marca; textos en español claro; precios legibles; controles cómodos al tacto; etiquetas visibles; navegación por teclado; foco y cierre de modales; estados vacíos y de error. Verificar a 360, 390, 768 y 1440 px. No presentar una auditoría visual como realizada hasta abrir y probar la interfaz.

## Orden de ejecución y aceptación

### Etapa 1 — Confianza en el servicio

- Corregir aislamiento entre catálogos y guardados. Con dos cuentas, A no puede modificar productos ni leer contactos o estadísticas de B. Probar creación, edición, borrado y lectura privada.
- Ante error de red o respuesta no exitosa, el panel conserva lo editado, informa el error y permite reintentar sin duplicar artículos.
- Precio, stock e información comercial guardados se ven desde otro navegador, tras recargar.
- Centralizar contacto real cuando Lucas lo proporcione. Revisar todos los botones comerciales.
- Alinear promesa y ejemplos con el servicio disponible.

### Etapa 2 — Alta rápida

- Extraer catálogo y panel compartidos; migrar un piloto conservando su dirección y contenido.
- Crear un segundo catálogo mediante datos y configuración, sin copiar componentes ni añadir una página por negocio.
- Validar producto y servicio con acciones distintas. Un catálogo nuevo vacío no muestra productos de otro negocio ni ejemplos inventados.
- Medir tiempo de configuración con contenido ya preparado. Objetivo provisional: menos de 30 minutos; es una meta interna, no una promesa comercial.

### Etapa 3 — Validación comercial

- Probar con tres emprendimientos y registrar dónde necesitan ayuda.
- Medir tiempo hasta publicación, porcentaje que actualiza su catálogo sin ayuda, consultas iniciadas y soporte mensual por cliente.
- Distinguir clic en WhatsApp, mensaje efectivamente recibido y venta confirmada; no reportarlos como equivalentes.
- Ajustar oferta y alcance a partir del esfuerzo real. Postergar pagos integrados, reservas automáticas y registro totalmente autónomo hasta validar demanda.

## Instagram como canal de adquisición

Propuesta editorial inicial, no estudio de mercado: demostraciones del catálogo desde el celular; tutoriales de actualización; ejemplos de rubros; antes/después con permiso del negocio. Tres piezas fijadas: qué incluye, ejemplos reales y cómo contratar. Cada publicación lleva a una demo o consulta concreta. No inventar testimonios o resultados ni anunciar una cuenta como activa antes de verificarla.

## Coordinación con Antigravity

Lucas define oferta, contacto real y prioridades comerciales. Codex coordina producto/frontend, alcance, criterios y revisión. Antigravity puede implementar tareas acotadas y devolver cambios, comprobaciones y pendientes. No hay conexión directa con Antigravity en esta sesión: este documento es el punto de traspaso y puede compartirse en su contexto.

Una tarea por entrega. Evitar que dos herramientas editen simultáneamente los mismos archivos. Revisar diferencias antes de incorporar trabajo; no sobrescribir cambios ajenos. No desplegar como parte de una revisión local.

### Primera tarea para Antigravity

Leer docs/DIRECCION-PRODUCTO.md y revisar las instrucciones locales aplicables. Implementar la Etapa 1 en entregas pequeñas, empezando por aislamiento de catálogos y persistencia fiable en MR. Bebidas. Antes de modificar, comprobar cómo usan la misma API los otros tres paneles. Mantener compatibilidad con las rutas existentes y no copiar más componentes por cliente. Obtener el catálogo autorizado de la sesión del servidor, no del cuerpo de la petición. No mostrar éxito antes de confirmar guardado o borrado. Persistir stock y comprobar el resultado desde una sesión independiente. Añadir pruebas que cubran acceso cruzado y errores de guardado. Trabajar con datos de prueba, nunca contra productos reales. Informar archivos cambiados, resultados de pruebas, riesgos y pendientes. No cambiar credenciales ni publicar. Dejar el WhatsApp como pendiente hasta recibir el número real de Lucas.

## Información pendiente

- Número comercial real y estado de la cuenta de Instagram.
- Qué catálogos corresponden a clientes activos y cuáles son demos.
- Primeros negocios piloto, contenido disponible y capacidad semanal de soporte.
- Alcance incluido en alta y mantenimiento; presupuesto y precios a validar.
