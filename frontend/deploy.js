import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    
    try {
        console.log("🚀 Iniciando conexión FTP con Hostinger...");
        await client.access({
            host: "82.25.67.136",
            user: "u506439444.tucatalogoideal.com",
            password: "Morella11!",
            port: 21,
            secure: false
        });
        
        console.log("✅ Conectado con éxito.");
        
        // Cambiar al directorio public_html en Hostinger
        console.log("📁 Accediendo a public_html/...");
        await client.cd("public_html");
        
        // Subir local-dir (dist/) a server-dir (public_html/)
        const localDistPath = path.resolve(__dirname, 'dist');
        console.log(`📤 Subiendo archivos desde ${localDistPath}...`);
        await client.uploadFromDir(localDistPath);
        
        console.log("🎉 ¡Sitio web y Backend subidos con éxito a Hostinger!");
    } catch (err) {
        console.error("❌ Ocurrió un error en el despliegue:", err);
    } finally {
        client.close();
    }
}

deploy();