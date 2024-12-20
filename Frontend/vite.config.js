import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


/* Access the environment variable
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://setflix.azurewebsites.net' // Production URL
  : 'http://localhost:8080'; // Local backend URL*/

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api":{
        target:'https://setflix.azurewebsites.net',
      }
    }
  }
})
