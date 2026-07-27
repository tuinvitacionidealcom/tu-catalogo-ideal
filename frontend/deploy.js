import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

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
        
        // Asegurar navegación dentro de public_html
        await client.ensureDir('public_html');
        const pwd = await client.pwd();
        console.log(`📍 Directorio FTP actual para el sitio: ${pwd}`);
        
        // Copiar .htaccess al directorio de build (dist/)
        const rootHtaccess = path.resolve(__dirname, '../.htaccess');
        const distHtaccess = path.resolve(__dirname, 'dist/.htaccess');
        if (fs.existsSync(rootHtaccess)) {
            fs.copyFileSync(rootHtaccess, distHtaccess);
            console.log("✅ .htaccess copiado a dist/");
        }
        
        // Subir local-dir (dist/) directamente dentro de public_html
        const localDistPath = path.resolve(__dirname, 'dist');
        console.log(`📤 Subiendo todos los archivos desde ${localDistPath} a ${pwd}...`);
        await client.uploadFromDir(localDistPath);
        
        console.log("🎉 ¡Sitio web y Backend subidos con éxito a Hostinger!");
    } catch (err) {
        console.error("❌ Ocurrió un error en el despliegue:", err);
    } finally {
        client.close();
    }
}

deploy();