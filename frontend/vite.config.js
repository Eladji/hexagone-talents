import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app'],
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  preview: {
    port: 5174,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app'],
  },
});
