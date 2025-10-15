<template>
<!-- component -->
<div>
  <!-- Desktop Sidebar (cuando isOpen es false o undefined) -->
  <nav v-if="!isOpen" class="hidden md:flex flex-col bg-green-700 w-64 h-screen px-4 text-gray-900 border border-purple-900">
    <div class="flex items-center justify-center mt-8 px-4">
      <div class="flex items-center space-x-3">
        <!-- Avatar del usuario -->
        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {{ authStore.user?.nombre_completo?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <div class="flex-1 min-w-0">
          <span class="font-semibold text-white text-sm block truncate">{{ authStore.user?.nombre_completo || 'Usuario' }}</span>
          <p class="text-white text-xs opacity-75 truncate">{{ authStore.user?.email || 'usuario@email.com' }}</p>
        </div>
      </div>
    </div>
    <div class="mt-10 mb-4">
      <ul class="ml-4">
        <li class="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
          <span>
            <svg class="fill-current h-5 w-5 " viewBox="0 0 24 24">
              <path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 3,6.55 3,8.5V15.5C3,17.45 4.55,19 6.5,19H8V21H16V19H17.5C19.45,19 21,17.45 21,15.5V8.5C21,6.55 19.45,5 17.5,5H6.5Z"/>
            </svg>
          </span>
          <router-link to="/libros" class="flex items-center w-full">
            <span class="ml-2">Todos los Libros</span>
          </router-link>
        </li>
        <li class="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
          <span>
            <svg class="fill-current h-5 w-5 " viewBox="0 0 24 24">
              <path
                d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0
                    014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4
                    8-4z"
              ></path>
            </svg>
          </span>
          <router-link to="/mis-libros" class="flex items-center w-full">
            <span class="ml-2">Mis Libros</span>
          </router-link>
        </li>
        <li class="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
          <span>
            <svg class="fill-current h-5 w-5 " viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
          <router-link to="/favoritos" class="flex items-center w-full">
            <span class="ml-2">Favoritos</span>
          </router-link>
        </li>
        <li class="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
          <span>
            <svg class="fill-current h-5 w-5 " viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </span>
          <router-link to="/pendientes" class="flex items-center w-full">
            <span class="ml-2">Pendientes</span>
          </router-link>
        </li>
        <li class="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-gray-300  hover:font-bold rounded rounded-lg">
          <span>
            <svg
              class="fill-current h-5 w-5 "
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7Z"
                fill="currentColor"
              />
              <path
                d="M16 15C16 14.4477 15.5523 14 15 14H9C8.44772 14 8 14.4477 8 15V21H6V15C6 13.3431 7.34315 12 9 12H15C16.6569 12 18 13.3431 18 15V21H16V15Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <router-link to="/profile" class="flex items-center w-full">
            <span class="ml-2">Perfil</span>
          </router-link>
        </li>

        <!-- Logout button -->
        <li class="mb-2 px-4 py-4 text-gray-100 flex flex-row border-gray-300 hover:text-black hover:bg-gray-300 hover:font-bold rounded rounded-lg cursor-pointer">
          <button @click="handleLogout" class="flex items-center w-full text-left">
            <span>
              <svg class="fill-current h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="ml-2">Cerrar Sesión</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>

  <!-- Mobile Sidebar Overlay -->
  <div v-if="isOpen" class="fixed inset-0 z-50 md:hidden">
    <!-- Backdrop with blur effect -->
    <div class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Sidebar -->
    <nav class="fixed left-0 top-0 h-full w-64 bg-green-700 text-gray-900 border-r border-green-900 shadow-lg transform transition-transform duration-300 ease-in-out">
      <!-- Close button -->
      <div class="flex justify-end p-4">
        <button @click="$emit('close')" class="text-white hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="px-4">
        <div class="flex items-center justify-center mb-8 px-4">
          <div class="flex items-center space-x-3">
            <!-- Avatar del usuario -->
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {{ authStore.user?.nombre_completo?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="font-semibold text-white text-sm block truncate">{{ authStore.user?.nombre_completo || 'Usuario' }}</span>
              <p class="text-white text-xs opacity-75 truncate">{{ authStore.user?.email || 'usuario@email.com' }}</p>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <ul class="space-y-2">
            <li class="px-4 py-3 text-gray-100 flex flex-row hover:text-black hover:bg-gray-300 hover:font-bold rounded-lg">
              <router-link to="/libros" class="flex items-center w-full" @click="$emit('close')">
                <span>
                  <svg class="fill-current h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 3,6.55 3,8.5V15.5C3,17.45 4.55,19 6.5,19H8V21H16V19H17.5C19.45,19 21,17.45 21,15.5V8.5C21,6.55 19.45,5 17.5,5H6.5Z"/>
                  </svg>
                </span>
                <span>Todos los Libros</span>
              </router-link>
            </li>
            <li class="px-4 py-3 text-gray-100 flex flex-row hover:text-black hover:bg-gray-300 hover:font-bold rounded-lg">
              <router-link to="/mis-libros" class="flex items-center w-full" @click="$emit('close')">
                <span>
                  <svg class="fill-current h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4z"/>
                  </svg>
                </span>
                <span>Mis Libros</span>
              </router-link>
            </li>
            <li class="px-4 py-3 text-gray-100 flex flex-row hover:text-black hover:bg-gray-300 hover:font-bold rounded-lg">
              <router-link to="/favoritos" class="flex items-center w-full" @click="$emit('close')">
                <span>
                  <svg class="fill-current h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </span>
                <span>Favoritos</span>
              </router-link>
            </li>
            <li class="px-4 py-3 text-gray-100 flex flex-row hover:text-black hover:bg-gray-300 hover:font-bold rounded-lg">
              <router-link to="/pendientes" class="flex items-center w-full" @click="$emit('close')">
                <span>
                  <svg class="fill-current h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </span>
                <span>Pendientes</span>
              </router-link>
            </li>
            <li class="px-4 py-3 text-gray-100 flex flex-row hover:text-black hover:bg-gray-300 hover:font-bold rounded-lg">
              <router-link to="/profile" class="flex items-center w-full" @click="$emit('close')">
                <span>
                  <svg class="fill-current h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7Z" fill="currentColor"/>
                    <path d="M16 15C16 14.4477 15.5523 14 15 14H9C8.44772 14 8 14.4477 8 15V21H6V15C6 13.3431 7.34315 12 9 12H15C16.6569 12 18 13.3431 18 15V21H16V15Z" fill="currentColor"/>
                  </svg>
                </span>
                <span>Perfil</span>
              </router-link>
            </li>

            <!-- Logout button -->
            <li class="px-4 py-3 text-gray-100 flex flex-row hover:text-black hover:bg-gray-300 hover:font-bold rounded-lg cursor-pointer">
              <button @click="handleLogoutAndClose" class="flex items-center w-full text-left">
                <span>
                  <svg class="fill-current h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
})

defineEmits<{
  close: []
}>()

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Forzar logout incluso si hay error en la API
    authStore.logout()
    router.push('/login')
  }
}

const handleLogoutAndClose = async () => {
  await handleLogout()
  // The close event will be emitted automatically when navigating away
}
</script>
