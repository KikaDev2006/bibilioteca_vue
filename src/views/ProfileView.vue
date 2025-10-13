<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p class="text-gray-600">Gestiona tu información personal y preferencias</p>
        </div>

        <!-- Profile Information -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center mb-6">
            <div class="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
              {{ authStore.user?.nombre_completo?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-gray-900">{{ authStore.user?.nombre_completo || 'Usuario' }}</h2>
              <p class="text-gray-600">{{ authStore.user?.email || 'email@ejemplo.com' }}</p>
            </div>
          </div>

          <!-- Profile Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ authStore.user?.nombre_completo || 'No especificado' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ authStore.user?.email || 'No especificado' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Registro</label>
                <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ formatDate(authStore.user?.created_at) || 'No disponible' }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado de Cuenta</label>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
                <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">Usuario Regular</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Última Conexión</label>
                <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ formatDate(new Date()) }}</p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import Layout from '@/components/Layout.vue'

const authStore = useAuthStore()

const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'No disponible'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}
</script>