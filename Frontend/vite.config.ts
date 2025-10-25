// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Backend dev server commonly listens on http://localhost:5070 (see launchSettings)
        // Proxy to HTTP target to avoid HTTPS/dev-cert issues during local development.
        target: 'http://localhost:5070',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});