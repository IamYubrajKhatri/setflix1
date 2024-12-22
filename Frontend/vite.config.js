import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  //const isProduction = mode === 'production' ; { mode}

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target:// Production URL
             'http://localhost:4001', // Local backend URL
          changeOrigin: true,
          secure: false, // Disable if your local server uses self-signed certificates
        }
      }
    }
  };
});
