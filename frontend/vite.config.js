import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin para copiar backend a dist automáticamente
const copyBackend = () => ({
  name: 'copy-backend',
  closeBundle: () => {
    const src = path.resolve(__dirname, '../backend');
    const dest = path.resolve(__dirname, 'dist/backend');

    if (fs.existsSync(src)) {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

      const copyDir = (s, d) => {
        const entries = fs.readdirSync(s, { withFileTypes: true });
        for (let entry of entries) {
          const sPath = path.join(s, entry.name);
          const dPath = path.join(d, entry.name);
          if (entry.isDirectory()) {
            if (!fs.existsSync(dPath)) fs.mkdirSync(dPath);
            copyDir(sPath, dPath);
          } else {
            fs.copyFileSync(sPath, dPath);
          }
        }
      };
      copyDir(src, dest);
      console.log('✅ Carpeta backend copiada a dist/');
    }
  }
});

export default defineConfig({
  plugins: [react(), copyBackend()],
  server: {
    host: '127.0.0.1',
    port: 5174,
    proxy: {
      '/backend': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
