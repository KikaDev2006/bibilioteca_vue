import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevtools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevtools(),
    tailwindcss()
  ],
  define: {
    // Definir globales para compatibilidad
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Configuración limpia para evitar problemas
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
