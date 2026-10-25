import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev proxy: set VITE_API_URL=/api in .env and run FastAPI on port 8000.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') } } },
})
