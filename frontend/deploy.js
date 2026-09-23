import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    
    try {
        console.log("🚀 Iniciando conexión FTP con Hostinger...");
        try {
            await client.access({
                host: "82.25.67.136",
                user: "u506439444.deploy",
                password: "Morella2026!",
                port: 21,
                secure: false
            });
        } catch (authErr) {
            console.warn("⚠️ Falló con u506439444.deploy, intentando credenciales principales...");
            await client.access({
                host: "82.25.67.136",
                user: "u506439444.tucatalogoideal.com",
                password: "Morella11!",
                port: 21,
                secure: false
            });
        }
        
        console.log("✅ Conectado con éxito.");
        
        // 1. Ir a la raíz del hosting (/public_html)
        try {
            await client.cd('/public_html');
        } catch (e) {
            await client.cd('/');
        }
        
        let currentPath = await client.pwd();
        console.log(`📍 Posicionado en directorio raíz FTP: ${currentPath}`);

        // 2. Si existe la subcarpeta duplicada 'public_html', vaciarla y borrarla
        try {
            await client.cd('public_html');
            console.log("🧹 Subcarpeta duplicada 'public_html' detectada! Limpiando contenido...");
            await client.clearWorkingDir();
            await client.cd('..');
            await client.removeDir('public_html');
            console.log("✅ Subcarpeta duplicada eliminada con éxito.");
        } catch (e) {
            console.log("✅ No existe subcarpeta duplicada 'public_html'.");
        }

        // 3. Volver a estar seguros en /public_html
        try {
            await client.cd('/public_html');
        } catch (e) {
            await client.cd('/');
        }
        currentPath = await client.pwd();

        // 4. Copiar .htaccess al directorio de build (dist/) antes de subir
        const rootDir = path.resolve(__dirname, '..');
        const rootHtaccess = path.resolve(rootDir, '.htaccess');
        const distHtaccess = path.resolve(__dirname, 'dist/.htaccess');
        if (fs.existsSync(rootHtaccess)) {
            fs.copyFileSync(rootHtaccess, distHtaccess);
            console.log("✅ .htaccess copiado a dist/");
        }
        
        // 5. Subir frontend/dist/ directamente en la raíz /public_html
        const localDistPath = path.resolve(__dirname, 'dist');
        console.log(`📤 Subiendo frontend desde ${localDistPath} a ${currentPath}...`);
        await client.uploadFromDir(localDistPath);
        console.log("✅ Frontend subido.");

        // 6. Subir seo.php desde la raíz del proyecto
        const seoPhpPath = path.resolve(rootDir, 'seo.php');
        if (fs.existsSync(seoPhpPath)) {
            console.log("📤 Subiendo seo.php...");
            await client.uploadFrom(seoPhpPath, 'seo.php');
            console.log("✅ seo.php subido.");
        } else {
            console.warn("⚠️ seo.php no encontrado en la raíz del proyecto.");
        }

        // 7. Subir carpeta backend/ desde la raíz del proyecto
        const backendPath = path.resolve(rootDir, 'backend');
        if (fs.existsSync(backendPath)) {
            console.log("📤 Subiendo backend/...");
            await client.uploadFromDir(backendPath, 'backend');
            console.log("✅ backend/ subido.");
        } else {
            console.warn("⚠️ Carpeta backend/ no encontrada.");
        }
        
        console.log("🎉 ¡Sitio web y Backend subidos con éxito a Hostinger!");
    } catch (err) {
        console.error("❌ Ocurrió un error en el despliegue:", err);
        process.exit(1);
    } finally {
        client.close();
    }
}

deploy();