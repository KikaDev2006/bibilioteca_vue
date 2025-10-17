import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Export an async config so we can conditionally load dev-only plugins
export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [vue(), tailwindcss()]

  if (mode !== 'production') {
    try {
      const devtools = await import('vite-plugin-vue-devtools')
      const factory = (devtools && (devtools.default || devtools))
      if (typeof factory === 'function') plugins.splice(1, 0, factory())
    } catch (err) {
      // don't fail the build if devtools isn't available
      // eslint-disable-next-line no-console
      console.warn('vite-plugin-vue-devtools not loaded:', err)
    }
  }

  return {
    plugins,
    define: {
      // keep global consistent with browser runtime
      global: 'globalThis'
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
  }
})
