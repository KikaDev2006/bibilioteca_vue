<template>
  <Layout>
    <div class="w-full h-full bg-gray-100 px-10 pt-10">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">Cargando perfil...</p>
      </div>

      <!-- Profile Card -->
      <div v-else-if="usuario" class="relative mt-16 mb-32 max-w-sm mx-auto">
        <div class="rounded overflow-hidden shadow-md bg-white">
          <!-- Avatar -->
          <div class="absolute -mt-20 w-full flex justify-center">
            <div class="h-32 w-32">
              <div class="rounded-full bg-gradient-to-br from-green-400 to-emerald-600 h-full w-full shadow-md flex items-center justify-center text-white text-5xl font-bold">
                {{ usuario.nombre_completo.charAt(0).toUpperCase() }}
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 mt-16">
            <h1 class="font-bold text-3xl text-center mb-1">{{ usuario.nombre_completo }}</h1>
            <p class="text-gray-800 text-sm text-center">{{ usuario.email }}</p>
            
            <!-- User Info -->
            <div class="text-center text-gray-600 text-base pt-3 font-normal space-y-2">
              <p class="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Miembro desde {{ new Date(usuario.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </p>
              <p class="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Última actualización {{ new Date(usuario.updated_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </p>
            </div>

            <!-- Edit Button -->
            <div class="w-full flex justify-center pt-5 pb-5">
              <button
                @click="showEditModal = true"
                class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de edición -->
      <div v-if="showEditModal" class="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative mx-auto p-5 border-4 border-black max-w-md w-full shadow-2xl rounded-lg bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Editar Perfil</h3>
            <form @submit.prevent="handleUpdate">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
                  <input
                    v-model="form.nombre_completo"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nueva Contraseña (opcional)</label>
                  <input
                    v-model="form.contraseña"
                    type="password"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Dejar vacío para mantener la actual"
                  />
                </div>
              </div>
              
              <div v-if="error" class="text-red-600 text-sm mt-2">
                {{ error }}
              </div>
              
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {{ loading ? 'Actualizando...' : 'Actualizar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">


import { ref, reactive, onMounted } from 'vue'
import type { UsuarioUpdate } from '@/types'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const { user: usuario, loading } = authStore

const showEditModal = ref(false)
const error = ref('')

const form = reactive<UsuarioUpdate>({
  nombre_completo: '',
  email: '',
  contraseña: ''
})

onMounted(async () => {
  if (!usuario) {
    await authStore.getCurrentUser()
  }
  if (usuario) {
    form.nombre_completo = usuario.nombre_completo || ''
    form.email = usuario.email || ''
  }
})

const handleUpdate = async () => {
  error.value = ''

  try {
    const updateData: UsuarioUpdate = {
      nombre_completo: form.nombre_completo,
      email: form.email
    }

    if (form.contraseña && form.contraseña.trim() !== '') {
      updateData.contraseña = form.contraseña
    }

    await authStore.updateUser(updateData)
    closeModal()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al actualizar el perfil'
  }
}

const closeModal = () => {
  showEditModal.value = false
  error.value = ''
  if (usuario) {
    form.nombre_completo = usuario.nombre_completo || ''
    form.email = usuario.email || ''
  }
  form.contraseña = ''
}
</script>
