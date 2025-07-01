import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
/*   server: {
    port: 5173,
    open: true,
    middlewareMode: false,
    fs: {
      allow: ['.'],
    },
    // Middleware manual para redirigir todas las rutas al index.html
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (
          req.method === 'GET' &&
          !req.url?.startsWith('/@vite') &&
          !req.url?.includes('.') // evita archivos como .js o .css
        ) {
          req.url = '/index.html';
        }
        next();
      });
    },
  },
  build: {
    outDir: 'dist',
  },*/
  base: '/', 
});
