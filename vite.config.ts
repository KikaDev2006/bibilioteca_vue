import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevtools from 'vite-plugin-vue-devtools'

// Mock para localStorage en producción
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  clear: () => {}
}

export default defineConfig({
  plugins: [
    vue(),
    vueDevtools(), // Mantenemos en ambos entornos
    tailwindcss()
  ],
  define: {
    global: 'globalThis',
    ...(process.env.NODE_ENV === 'production' ? { localStorage: localStorageMock } : {})
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
