<template>
  <Layout>
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-600">Cargando libro...</p>
    </div>

    <div v-else-if="currentLibro" class="space-y-6">
      <!-- Header del libro -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div 
          class="h-48 w-full"
          :style="{ backgroundColor: currentLibro.color_portada }"
        ></div>
        <div class="p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ currentLibro.nombre }}</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p><strong>Autor:</strong> {{ currentLibro.autor }}</p>
              <p><strong>Versión:</strong> {{ currentLibro.version }}</p>
            </div>
            <div>
              <p><strong>Género:</strong> {{ currentLibro.genero || 'Sin género' }}</p>
              <p><strong>Creado:</strong> {{ new Date(currentLibro.created_at).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Páginas del libro -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Páginas del Libro</h2>
          <button 
            @click="showCreatePaginaModal = true"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            + Nueva Página
          </button>
        </div>

        <div v-if="paginasStore.paginas.length > 0" class="space-y-4">
          <div 
            v-for="pagina in paginasStore.paginas" 
            :key="pagina.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ pagina.titulo || 'Sin título' }}</h3>
                <p class="text-sm text-gray-600 mb-2">Tipo: {{ pagina.tipo }}</p>
                <p class="text-gray-700 line-clamp-3">{{ pagina.contenido }}</p>
              </div>
              <div class="flex space-x-2 ml-4">
                <button 
                  @click="editPagina(pagina)"
                  class="text-yellow-600 hover:text-yellow-800"
                >
                  Editar
                </button>
                <button 
                  @click="deletePagina(pagina.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <p>Este libro no tiene páginas aún.</p>
          <button 
            @click="showCreatePaginaModal = true"
            class="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Crear primera página
          </button>
        </div>
      </div>

      <!-- Modal para crear/editar página -->
      <div v-if="showCreatePaginaModal || showEditPaginaModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ showCreatePaginaModal ? 'Crear Nueva Página' : 'Editar Página' }}
            </h3>
            <form @submit.prevent="handlePaginaSubmit">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    v-model="paginaForm.titulo"
                    type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    v-model="paginaForm.tipo"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="texto">Texto</option>
                    <option value="imagen">Imagen</option>
                    <option value="codigo">Código</option>
                    <option value="nota">Nota</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Contenido</label>
                  <textarea
                    v-model="paginaForm.contenido"
                    required
                    rows="6"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closePaginaModal"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {{ showCreatePaginaModal ? 'Crear' : 'Actualizar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600">Libro no encontrado</p>
      <router-link to="/libros" class="text-indigo-600 hover:text-indigo-800">
        Volver a libros
      </router-link>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLibrosStore } from '@/stores/libros'
import { usePaginasStore } from '@/stores/paginas'
import Layout from '@/components/Layout.vue'
import type { Pagina, PaginaIn } from '@/types'

const route = useRoute()
const librosStore = useLibrosStore()
const paginasStore = usePaginasStore()

const { currentLibro, loading: libroLoading } = librosStore
const { loading: paginasLoading } = paginasStore

// Create a local ref that will hold the filtered pages for this book
const paginas = ref<Pagina[]>([])

const loading = computed(() => libroLoading || paginasLoading)

const showCreatePaginaModal = ref(false)
const showEditPaginaModal = ref(false)
const editingPagina = ref<Pagina | null>(null)

const paginaForm = reactive<PaginaIn>({
  titulo: '',
  tipo: '',
  contenido: '',
  libro_id: 0
})

onMounted(async () => {
  const libroId = parseInt(route.params.id as string)
  if (libroId) {
    await librosStore.fetchLibro(libroId)
    await paginasStore.fetchPaginas()
    // Filtrar páginas del libro actual
    const libroPaginas = (paginasStore.paginas as any).value.filter((p: Pagina) => p.libro_id === libroId)
    paginas.value = libroPaginas
  }
})

const editPagina = (pagina: Pagina) => {
  editingPagina.value = pagina
  paginaForm.titulo = pagina.titulo || ''
  paginaForm.tipo = pagina.tipo
  paginaForm.contenido = pagina.contenido
  paginaForm.libro_id = pagina.libro_id
  showEditPaginaModal.value = true
}

const deletePagina = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta página?')) {
    await paginasStore.deletePagina(id)
    await paginasStore.fetchPaginas()
    const libroId = parseInt(route.params.id as string)
    const libroPaginas = (paginasStore.paginas as any).value.filter((p: Pagina) => p.libro_id === libroId)
    paginas.value = libroPaginas
  }
}

const handlePaginaSubmit = async () => {
  try {
    const libroId = parseInt(route.params.id as string)
    paginaForm.libro_id = libroId

    if (showCreatePaginaModal.value) {
      await paginasStore.createPagina(paginaForm)
    } else if (editingPagina.value) {
      await paginasStore.updatePagina(editingPagina.value.id, paginaForm)
    }
    
    closePaginaModal()
    // Recargar páginas del libro
    await paginasStore.fetchPaginas()
    const libroPaginas = (paginasStore.paginas as any).value.filter((p: Pagina) => p.libro_id === libroId)
    paginas.value = libroPaginas
  } catch (error) {
    console.error('Error al guardar página:', error)
  }
}

const closePaginaModal = () => {
  showCreatePaginaModal.value = false
  showEditPaginaModal.value = false
  editingPagina.value = null
  paginaForm.titulo = ''
  paginaForm.tipo = ''
  paginaForm.contenido = ''
  paginaForm.libro_id = 0
}
</script>
