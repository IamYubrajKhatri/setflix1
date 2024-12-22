import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: isProduction
            ? 'https://setflix1.azurewebsites.net' // Production URL
            : 'http://localhost:4001', // Local backend URL
          changeOrigin: true,
          secure: false, // Disable if your local server uses self-signed certificates
        }
      }
    }
  };
});
