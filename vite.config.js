import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  server: {
    port: 5173,
    open: true // Abre el navegador automáticamente
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html') // Punto de entrada
      }
    }
  },
  optimizeDeps: {
    include: ['three'] // Optimiza Three.js para desarrollo
  }
});