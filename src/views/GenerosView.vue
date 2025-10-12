<template>
  <Layout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Géneros</h1>
        <button 
          @click="showCreateModal = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + Nuevo Género
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">Cargando géneros...</p>
      </div>

      <!-- Géneros List -->
      <div v-else-if="generos.length > 0" class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="genero in generos" :key="genero.id" class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold">{{ genero.genero.charAt(0) }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ genero.genero }}</div>
                  <div class="text-sm text-gray-500">
                    Creado: {{ new Date(genero.created_at).toLocaleDateString() }}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="editGenero(genero)"
                  class="text-yellow-600 hover:text-yellow-800 text-sm"
                >
                  Editar
                </button>
                <button 
                  @click="deleteGenero(genero.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">🏷️</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes géneros aún</h3>
        <p class="text-gray-600 mb-4">Comienza creando tu primer género</p>
        <button 
          @click="showCreateModal = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Crear Primer Género
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ showCreateModal ? 'Crear Nuevo Género' : 'Editar Género' }}
            </h3>
            <form @submit.prevent="handleSubmit">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre del Género</label>
                  <input
                    v-model="form.genero"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: Ficción, Ciencia, Historia..."
                  />
                </div>
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
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {{ showCreateModal ? 'Crear' : 'Actualizar' }}
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
import { useGenerosStore } from '@/stores/generos'
import Layout from '@/components/Layout.vue'
import type { GeneroLibro, GeneroLibroIn } from '@/types'

const generosStore = useGenerosStore()

const { generos, loading } = generosStore

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingGenero = ref<GeneroLibro | null>(null)

const form = reactive<GeneroLibroIn>({
  genero: ''
})

onMounted(async () => {
  await generosStore.fetchGeneros()
})

const editGenero = (genero: GeneroLibro) => {
  editingGenero.value = genero
  form.genero = genero.genero
  showEditModal.value = true
}

const deleteGenero = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este género?')) {
    await generosStore.deleteGenero(id)
  }
}

const handleSubmit = async () => {
  try {
    if (showCreateModal.value) {
      await generosStore.createGenero(form)
    } else if (editingGenero.value) {
      await generosStore.updateGenero(editingGenero.value.id, form)
    }
    closeModal()
  } catch (error) {
    console.error('Error al guardar género:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingGenero.value = null
  form.genero = ''
}
</script>
