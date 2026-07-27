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
        
        let pwd = await client.pwd();
        console.log(`📍 Directorio inicial FTP: ${pwd}`);
        
        // Si el usuario no está ya dentro de public_html, ingresar a public_html
        if (!pwd.endsWith('/public_html') && !pwd.endsWith('/public_html/')) {
            try {
                await client.cd('public_html');
                pwd = await client.pwd();
                console.log(`📍 Navegado a: ${pwd}`);
            } catch (cdErr) {
                console.log("ℹ️ No se pudo cambiar a public_html, utilizando directorio actual.");
            }
        }
        
        // Si estando en /public_html existe una subcarpeta duplicala llamada 'public_html', eliminarla
        try {
            await client.removeDir('public_html');
            console.log("🧹 Subcarpeta duplicada 'public_html' eliminada correctamente.");
        } catch (e) {
            // No existe subcarpeta duplicada
        }
        
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