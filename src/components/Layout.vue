<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Desktop (solo en escritorio) -->
    <div class="hidden md:block">
      <Sidebar @create-book="$emit('create-book')" />
    </div>

    <!-- Sidebar Móvil (solo en móvil cuando está abierto) -->
    <Sidebar v-if="sidebarOpen" :isOpen="true" @close="sidebarOpen = false" @create-book="$emit('create-book')" />

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)

// Estado para la búsqueda
const searchQuery = ref('')

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
}
</style>
