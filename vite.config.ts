import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(), // Habilitado en todos los entornos
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
  // Configuración específica para evitar problemas en SSR/construcción
  ssr: {
    noExternal: ['vue', '@vueuse/core']
  }
})
