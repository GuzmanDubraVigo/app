import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4000,
    open: '/pages/register.html',
    proxy: {
      '/solicitar-premium': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/solicitar-premium/, '/solicitar-premium')
      }
    }
  }
});
