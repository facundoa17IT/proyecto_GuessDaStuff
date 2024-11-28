import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  build: {
    outDir: 'dist',
  },
  base: '/', // Esto asegura que las rutas relativas funcionen correctamente
})
