import { defineConfig } from 'vite';

export default defineConfig({
  base: '/app/', // Reemplaza '/app/' con el nombre de tu repositorio si es diferente
  build: {
    outDir: 'dist',
  },
  server: {
    port: 4000,
    open: '/index.html', // Asegúrate de que esta ruta es correcta
    proxy: {
      '/api': {
        target: 'https://app-pearl-phi.vercel.app', // URL de tu backend en Vercel
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
