<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Desktop -->
    <div class="hidden md:flex flex-col w-64 bg-green-800 rounded-2xl m-2 relative overflow-hidden">
      <!-- Iconos decorativos de fondo -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-10 left-5 text-6xl">📚</div>
        <div class="absolute top-32 right-8 text-5xl rotate-12">✏️</div>
        <div class="absolute top-56 left-8 text-4xl -rotate-12">📖</div>
        <div class="absolute bottom-40 right-6 text-5xl rotate-45">📝</div>
        <div class="absolute bottom-20 left-10 text-6xl -rotate-12">📕</div>
        <div class="absolute top-80 right-4 text-4xl">✍️</div>
      </div>
      
      <div class="flex flex-col flex-1 overflow-y-auto relative z-10">
        <nav class="flex flex-col flex-1 overflow-y-auto bg-gradient-to-b from-green-700 to-emerald-600 px-2 py-4 gap-10 rounded-2xl">
          <!-- Logo/Title - No clickable -->
          <div class="px-4 py-2 text-white font-bold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Biblioteca Digital
          </div> 

          <!-- Navigation Links -->
          <div class="flex flex-col flex-1 gap-3">
            <!-- Enlaces básicos (primero) -->
            <router-link
              to="/"
              class="flex items-center px-4 py-2 text-white hover:bg-green-800 hover:bg-opacity-50 rounded-2xl transition-colors"
              active-class="bg-green-800 bg-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-3">
                <path fill="currentColor" fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6l2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2z" clip-rule="evenodd" />
              </svg>
              Biblioteca
            </router-link>

            <!-- Filtros de Libros (solo si está autenticado) -->
            <div v-if="authStore.isAuthenticated">
              <slot name="filters" :closeSidebar="() => {}" />
            </div>

            <!-- Otros enlaces -->
            <router-link
              v-if="authStore.isAuthenticated"
              to="/profile"
              class="flex items-center px-4 py-2 text-white hover:bg-green-800 hover:bg-opacity-50 rounded-2xl transition-colors"
              active-class="bg-green-800 bg-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" class="mr-3">
                <path fill="currentColor" d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z" />
              </svg>
              Perfil
            </router-link>

            <router-link
              v-if="!authStore.isAuthenticated"
              to="/login"
              class="flex items-center px-4 py-2 text-white hover:bg-green-800 hover:bg-opacity-50 rounded-2xl transition-colors"
              active-class="bg-green-800 bg-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-3">
                <path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"/>
              </svg>
              Iniciar Sesión
            </router-link>
          </div>

          <!-- User Info & Logout (at bottom) -->
          <div v-if="authStore.isAuthenticated" class="border-t border-green-600 pt-4">
            <div class="px-4 py-2 text-gray-100 text-sm">
              <p class="font-semibold">{{ authStore.user?.nombre_completo || 'Usuario' }}</p>
              <p class="text-gray-300 text-xs">{{ authStore.user?.email }}</p>
            </div>
            <button
              @click="handleLogout"
              class="flex items-center w-full px-4 py-2 mt-2 text-gray-100 hover:bg-red-500 hover:bg-opacity-25 rounded-2xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-3">
                <path fill="currentColor" d="M5 11h8v2H5v3l-5-4l5-4zm-1 7h2.708a8 8 0 1 0 0-12H4a9.985 9.985 0 0 1 8-4c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.985 9.985 0 0 1-8-4" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Sidebar Móvil (overlay) -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    ></div>
    <div 
      :class="['fixed inset-y-0 left-0 w-64 bg-green-800 z-50 transform transition-transform duration-300 md:hidden', sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Iconos decorativos de fondo -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-10 left-5 text-6xl">📚</div>
        <div class="absolute top-32 right-8 text-5xl rotate-12">✏️</div>
        <div class="absolute top-56 left-8 text-4xl -rotate-12">📖</div>
        <div class="absolute bottom-40 right-6 text-5xl rotate-45">📝</div>
        <div class="absolute bottom-20 left-10 text-6xl -rotate-12">📕</div>
        <div class="absolute top-80 right-4 text-4xl">✍️</div>
      </div>
      
      <div class="flex flex-col h-full overflow-y-auto relative z-10">
        <nav class="flex flex-col flex-1 overflow-y-auto bg-gradient-to-b from-green-700 to-emerald-600 px-2 py-4 gap-10">
          <!-- Botón cerrar -->
          <div class="flex justify-between items-center px-4">
            <div class="flex items-center text-white font-bold text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Biblioteca Digital
            </div>
            <button @click="sidebarOpen = false" class="text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Navigation Links -->
          <div class="flex flex-col flex-1 gap-3">
            <!-- Enlaces básicos (primero) -->
            <router-link
              to="/"
              @click="sidebarOpen = false"
              class="flex items-center px-4 py-2 text-white hover:bg-green-800 hover:bg-opacity-50 rounded-2xl transition-colors"
              active-class="bg-green-800 bg-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-3">
                <path fill="currentColor" fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6l2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2z" clip-rule="evenodd" />
              </svg>
              Biblioteca
            </router-link>

            <!-- Filtros de Libros (solo si está autenticado) -->
            <div v-if="authStore.isAuthenticated">
              <slot name="filters" :closeSidebar="() => sidebarOpen = false" />
            </div>

            <!-- Otros enlaces -->
            <router-link
              v-if="authStore.isAuthenticated"
              to="/profile"
              @click="sidebarOpen = false"
              class="flex items-center px-4 py-2 text-white hover:bg-green-800 hover:bg-opacity-50 rounded-2xl transition-colors"
              active-class="bg-green-800 bg-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" class="mr-3">
                <path fill="currentColor" d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z" />
              </svg>
              Perfil
            </router-link>

            <router-link
              v-if="!authStore.isAuthenticated"
              to="/login"
              @click="sidebarOpen = false"
              class="flex items-center px-4 py-2 text-white hover:bg-green-800 hover:bg-opacity-50 rounded-2xl transition-colors"
              active-class="bg-green-800 bg-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-3">
                <path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"/>
              </svg>
              Iniciar Sesión
            </router-link>
          </div>

          <!-- User Info & Logout (at bottom) -->
          <div v-if="authStore.isAuthenticated" class="border-t border-green-600 pt-4">
            <div class="px-4 py-2 text-gray-100 text-sm">
              <p class="font-semibold">{{ authStore.user?.nombre_completo || 'Usuario' }}</p>
              <p class="text-gray-300 text-xs">{{ authStore.user?.email }}</p>
            </div>
            <button
              @click="handleLogout"
              class="flex items-center w-full px-4 py-2 mt-2 text-gray-100 hover:bg-red-500 hover:bg-opacity-25 rounded-2xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-3">
                <path fill="currentColor" d="M5 11h8v2H5v3l-5-4l5-4zm-1 7h2.708a8 8 0 1 0 0-12H4a9.985 9.985 0 0 1 8-4c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.985 9.985 0 0 1-8-4" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
    </div>

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

          <!-- Barra de búsqueda -->
          <div class="relative flex-1 max-w-md text-gray-600">
            <input 
              class="border border-gray-300 h-10 w-full px-5 pr-10 rounded-lg text-sm placeholder-current focus:outline-none focus:border-green-500"
              type="search" 
              name="search" 
              placeholder="Buscar libros..."
            >
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

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

// Computed para determinar si estamos en la vista de libros
const isLibrosView = computed(() => route.path === '/' || route.path.startsWith('/libros'))

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
