<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Desktop (solo en escritorio) -->
    <div class="hidden md:block">
      <Sidebar />
    </div>

    <!-- Sidebar Móvil (solo en móvil cuando está abierto) -->
    <Sidebar v-if="sidebarOpen" :isOpen="true" @close="sidebarOpen = false" />

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <!-- Top Bar -->
      <div class="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
        <div class="flex items-center gap-3 flex-1">
          <!-- Botón hamburguesa (móvil) -->
          <button
            @click="sidebarOpen = true"
            class="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          <!-- Filtros para LibrosView -->
          <div class="hidden md:flex items-center gap-2">
            <slot name="filters" :closeSidebar="() => sidebarOpen = false"></slot>
          </div>

          <!-- Barra de búsqueda -->
          <div class="relative flex-1 max-w-md text-gray-600">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              class="border border-gray-300 h-10 w-full px-5 pr-10 rounded-lg text-sm placeholder-current focus:outline-none focus:border-green-500"
              type="search"
              name="search"
              placeholder="Buscar libros..."
            >
            <button
              v-if="searchQuery"
              @click="clearSearch"
              type="button"
              class="absolute right-8 top-0 mt-3 mr-1 text-gray-400 hover:text-gray-600"
              title="Limpiar búsqueda"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <button type="submit" class="absolute right-0 top-0 mt-3 mr-4">
              <svg class="text-gray-600 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.966 56.966">
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92 c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626-17-17S14.61,6,23.984,6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

// Estado para la búsqueda
const searchQuery = ref('')

// Computed para determinar si estamos en la vista de libros
const isLibrosView = computed(() => route.path === '/' || route.path.startsWith('/libros'))

// Función para manejar la búsqueda
const handleSearch = () => {
  // Emitir evento de búsqueda que las vistas pueden escuchar
  const searchEvent = new CustomEvent('search-query', {
    detail: { query: searchQuery.value }
  })
  window.dispatchEvent(searchEvent)
}

// Función para limpiar la búsqueda
const clearSearch = () => {
  searchQuery.value = ''
  const clearEvent = new CustomEvent('search-query', {
    detail: { query: '' }
  })
  window.dispatchEvent(clearEvent)
}

// Watch para cambios en autenticación
watch(() => authStore.isAuthenticated, (newVal) => {
  console.log('Auth changed in Layout:', newVal)
})

// Watch para cambios en ruta
watch(() => route.path, (newPath) => {
  console.log('Route changed in Layout:', newPath, 'isAuthenticated:', authStore.isAuthenticated)
})

// Debug logs
console.log('Layout Debug:', {
  isAuthenticated: authStore.isAuthenticated,
  user: authStore.user,
  currentRoute: route.path,
  isLibrosView: isLibrosView.value
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
  sidebarOpen.value = false
}

// Cerrar sidebar cuando la pantalla cambie a desktop
const handleResize = () => {
  if (window.innerWidth >= 768) { // md breakpoint
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Estilos básicos responsivos */
@media (max-width: 768px) {
  /* Mejorar espaciado en móviles */
  .flex-1.overflow-y-auto {
    padding: 1rem;
  }

  /* Asegurar que la barra superior se vea bien */
  .h-16 {
    height: auto;
    min-height: 4rem;
  }
}
</style>
