import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // <-- Frontend en 5173 (por defecto)
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // <-- Apunta al puerto 3000
        changeOrigin: true,
      }
    }
  }
})
