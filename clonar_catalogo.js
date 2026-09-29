const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log("Uso: node clonar_catalogo.js <nuevo-slug> <PrefijoComponente> <NombreNegocio>");
    console.log("Ejemplo: node clonar_catalogo.js mi-nuevo-catalogo MiNuevo Mi Nuevo Catalogo");
    process.exit(1);
}

const newSlug = args[0]; // ej: mi-nuevo-catalogo
const componentPrefix = args[1]; // ej: MiNuevo
const businessName = args.slice(2).join(' '); // ej: Mi Nuevo Catalogo

// Convert slug to variable formats (e.g. mi-nuevo-catalogo -> miNuevoCatalogo)
const toCamelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const newVarPrefix = toCamelCase(newSlug);

// The base template we are cloning from
const baseSlug = 'perla-fit-pri';
const baseComponentPrefix = 'PerlaFitPri';
const baseBusinessName = 'Perla Fit';
const baseVarPrefix = 'perlafit';

const srcDir = path.join(__dirname, 'frontend', 'src');
const baseDir = path.join(srcDir, 'catalogos', baseSlug);
const newDir = path.join(srcDir, 'catalogos', newSlug);

console.log(`Clonando de ${baseSlug} a ${newSlug}...`);

// 1. Copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        // Rename files if they contain the base component prefix or slug
        let newName = entry.name
            .replace(baseComponentPrefix, componentPrefix)
            .replace(baseSlug, newSlug);
        
        const destPath = path.join(dest, newName);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            // Read content and replace texts
            let content = fs.readFileSync(srcPath, 'utf8');
            
            // Reemplazar prefijos de componentes y clases
            content = content.replace(new RegExp(baseComponentPrefix, 'g'), componentPrefix);
            content = content.replace(new RegExp(baseSlug, 'g'), newSlug);
            content = content.replace(new RegExp(baseBusinessName, 'g'), businessName);
            
            // Reemplazar las llaves de localStorage y variables
            content = content.replace(new RegExp(baseVarPrefix, 'g'), newVarPrefix);
            
            // Para rutas en minúsculas sin guiones como 'perlafit' en localStorage
            content = content.replace(/perlafit/g, newSlug.replace(/-/g, ''));
            
            fs.writeFileSync(destPath, content, 'utf8');
        }
    }
}

copyDir(baseDir, newDir);
console.log(`✅ Archivos frontend copiados y adaptados en frontend/src/catalogos/${newSlug}`);

// 2. Modificar App.jsx para registrar las nuevas rutas
const appPath = path.join(srcDir, 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Insertar imports si no existen
const importLine1 = `import ${componentPrefix}Catalogo from './catalogos/${newSlug}/page/${componentPrefix}Catalogo';`;
const importLine2 = `import ${componentPrefix}Panel from './catalogos/${newSlug}/panel/${componentPrefix}Panel';`;

if (!appContent.includes(importLine1)) {
    appContent = appContent.replace('// HomePage: Landing principal', `// Catálogo ${businessName}\n${importLine1}\n${importLine2}\n\n// HomePage: Landing principal`);
}

// Insertar validación de ruta (isCatalogRoute)
if (!appContent.includes(`startsWith('/${newSlug}')`)) {
    appContent = appContent.replace('const isCatalogRoute = ', `const isCatalogRoute = location.pathname.toLowerCase().startsWith('/${newSlug}') ||\n        `);
}

// Insertar Rutas (Routes)
const routeLine1 = `<Route path="/${newSlug}" element={<${componentPrefix}Catalogo />} />`;
const routeLine2 = `<Route path="/${newSlug}/panel" element={<${componentPrefix}Panel />} />`;

if (!appContent.includes(routeLine1)) {
    appContent = appContent.replace('{/* 404 */}', `{/* Rutas del Catálogo ${businessName} */}\n                ${routeLine1}\n                ${routeLine2}\n\n                {/* 404 */}`);
}

fs.writeFileSync(appPath, appContent, 'utf8');
console.log(`✅ Rutas registradas en App.jsx`);

// 3. Generar el script SQL para la base de datos
const sqlContent = `-- ==========================================
-- SETUP DE NUEVO CATÁLOGO — ${businessName}
-- ==========================================
-- Instrucciones:
--   1. Abrí phpMyAdmin → catalogo_ideal_local (o la BD de producción)
--   2. Andá a la pestaña SQL
--   3. Pegá este script completo y ejecutalo
-- ==========================================

-- PASO 1: Registrar el catálogo
INSERT INTO \`catalogs\` (\`slug\`, \`business_name\`, \`business_type\`, \`contact_name\`, \`phone\`, \`description\`, \`status\`)
VALUES ('${newSlug}', '${businessName}', 'General', 'Contacto', '5491100000000', 'Catálogo de ${businessName}', 'active')
ON DUPLICATE KEY UPDATE
    \`business_name\` = '${businessName}',
    \`status\` = 'active';

-- Guardar el ID del catálogo recién insertado
SET @catalog_id = LAST_INSERT_ID();

-- PASO 2: Crear el usuario del panel (contraseña en texto plano)
INSERT INTO \`panel_users\` (\`catalog_id\`, \`catalog_slug\`, \`username\`, \`password_hash\`)
VALUES (@catalog_id, '${newSlug}', '${newSlug.replace(/-/g, '')}', '${newSlug.replace(/-/g, '')}')
ON DUPLICATE KEY UPDATE
    \`catalog_id\` = @catalog_id,
    \`catalog_slug\` = '${newSlug}',
    \`password_hash\` = '${newSlug.replace(/-/g, '')}';

-- ==========================================
-- ✅ LISTO! Panel accesible en:
--    URL: /perla-fit/panel   (en producción: tusitio.com/${newSlug}/panel)
--    Usuario: ${newSlug.replace(/-/g, '')}
--    Contraseña: ${newSlug.replace(/-/g, '')}
-- ==========================================
`;


const sqlPath = path.join(__dirname, `${newSlug}-setup.sql`);
fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log(`✅ Archivo SQL generado: ${newSlug}-setup.sql`);
console.log(`\n¡Listo! Tu catálogo se puede ver en http://localhost:5173/${newSlug}`);
console.log(`Panel de administración en http://localhost:5173/${newSlug}/panel`);
console.log(`Usuario: ${newSlug.replace(/-/g, '')} | Contraseña: password`);
