<template>
  <Layout>
    <div class="minimal-container">
      <!-- Header compacto con navegación -->
      <div class="compact-header">
        <div class="header-info">
          <h1 v-if="selectedLibro" class="book-title">{{ selectedLibro.nombre }}</h1>
          <p v-if="selectedLibro" class="book-author">{{ selectedLibro.autor }}</p>
        </div>
        <div class="header-actions">
          <!-- Controles de navegación de páginas -->
          <div v-if="paginas.length > 0" class="page-nav-controls">
            <button @click="previousPage" :disabled="currentPageIndex === 0" class="nav-btn">
              ←
            </button>
            <span class="page-counter">{{ currentPageIndex + 1 }} / {{ paginas.length }}</span>
            <button
              @click="nextPage"
              :disabled="currentPageIndex === paginas.length - 1"
              class="nav-btn"
            >
              →
            </button>
          </div>
          <button @click="goBack" class="btn-secondary">← Volver</button>
          <button v-if="authStore.isAuthenticated && selectedLibro && authStore.user?.id === selectedLibro.usuario_id" @click="showAddModal = true" class="btn-primary">+ Nueva Página</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <p class="mt-2 text-gray-600">Cargando páginas...</p>
      </div>

      <!-- Lista de páginas -->
      <div v-else-if="paginas.length > 0" class="pages-container">
        <!-- Página actual completa -->
        <div class="single-page-container">
          <div class="single-page">
            <div class="page-number">{{ currentPageIndex + 1 }}</div>
            <div class="page-content">
              <div class="page-header">
                <!-- Título -->
                <div v-if="!editingPage">
                  <h3 class="page-title">
                    {{ currentPage.titulo || `Página ${currentPageIndex + 1}` }}
                  </h3>
                  <span class="page-type">{{ currentPage.tipo }}</span>
                </div>
                <div v-else class="edit-form">
                  <input
                    v-model="editForm.titulo"
                    type="text"
                    class="edit-input title-input"
                    placeholder="Título de la página"
                  />
                  <select v-model="editForm.tipo" class="edit-select">
                    <option value="texto">Texto</option>
                    <option value="imagen">Imagen</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <!-- Contenido -->
              <div class="page-text">
                <div v-if="!editingPage">
                  <p>{{ currentPage.contenido }}</p>
                </div>
                <div v-else class="edit-form">
                  <textarea
                    v-model="editForm.contenido"
                    class="edit-textarea"
                    placeholder="Contenido de la página..."
                    rows="8"
                  ></textarea>
                </div>
              </div>

              <!-- Botones de acción pequeños (solo para el dueño del libro) -->
              <div v-if="authStore.isAuthenticated && selectedLibro && authStore.user?.id === selectedLibro.usuario_id" class="page-actions">
                <div v-if="!editingPage" class="action-buttons">
                  <button @click="startEditing" class="mini-btn edit-btn" title="Editar página">
                    ✏️
                  </button>
                  <button
                    @click="deletePagina(currentPage.id)"
                    class="mini-btn delete-btn"
                    title="Eliminar página"
                  >
                    🗑️
                  </button>
                </div>
                <div v-else class="edit-buttons">
                  <button
                    @click="saveEdit"
                    class="mini-btn save-btn"
                    title="Guardar cambios"
                    :disabled="saving"
                  >
                    {{ saving ? '⏳' : '💾' }}
                  </button>
                  <button @click="cancelEdit" class="mini-btn cancel-btn" title="Cancelar edición">
                    ❌
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">📄</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay páginas en este libro</h3>
        <p v-if="authStore.isAuthenticated && selectedLibro && authStore.user?.id === selectedLibro.usuario_id" class="text-gray-600 mb-4">Agrega la primera página para comenzar</p>
        <p v-else class="text-gray-600 mb-4">Este libro aún no tiene contenido</p>
        <button
          v-if="authStore.isAuthenticated && selectedLibro && authStore.user?.id === selectedLibro.usuario_id"
          @click="showAddModal = true"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Agregar Primera Página
        </button>
      </div>

      <!-- Modal para agregar/editar página -->
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border-4 border-black shadow-2xl">
          <!-- Header del modal -->
          <div class="p-6 border-b">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showEditModal ? 'Editar Página' : 'Nueva Página' }}
            </h3>
          </div>

          <!-- Formulario -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  v-model="form.titulo"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Título de la página (opcional)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  v-model="form.tipo"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="contenido">Contenido</option>
                  <option value="indice">Índice</option>
                  <option value="portada">Portada</option>
                  <option value="texto">Texto</option>
                  <option value="imagen">Imagen</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea
                  v-model="form.contenido"
                  required
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contenido de la página..."
                ></textarea>
              </div>

              <!-- Botones -->
              <div class="flex justify-end space-x-3 pt-4">
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
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ showEditModal ? 'Actualizar' : 'Crear' }} Página
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/config/api'
import Layout from '@/components/Layout.vue'
import type { Libro } from '@/types'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const selectedLibro = ref<Libro | null>(null)
const paginas = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const currentPageIndex = ref(0)
const editingPage = ref(false)
const saving = ref(false)

const form = reactive({
  titulo: '',
  contenido: '',
  tipo: 'contenido',
})

const editForm = reactive({
  titulo: '',
  contenido: '',
  tipo: 'contenido',
})

// Computed para la página actual
const currentPage = computed(() => {
  return paginas.value[currentPageIndex.value] || null
})

// Cargar libro y páginas al montar
onMounted(async () => {
  const libroId = route.params.id
  if (libroId) {
    await loadLibro(Number(libroId))
    await loadPaginas(Number(libroId))
  }
})

// Cargar información del libro
const loadLibro = async (libroId: number) => {
  try {
    const response = await api.get(`/libro/${libroId}`)
    selectedLibro.value = response.data
  } catch (error) {
    console.error('Error cargando libro:', error)
  }
}

// Cargar páginas del libro
const loadPaginas = async (libroId: number) => {
  try {
    loading.value = true
    const response = await api.get(`/libro/${libroId}/paginas`)
    paginas.value = response.data
  } catch (error) {
    console.error('Error cargando páginas:', error)
  } finally {
    loading.value = false
  }
}

// Volver a la biblioteca
const goBack = () => {
  router.push('/')
}

// Navegación de páginas
const nextPage = () => {
  if (currentPageIndex.value < paginas.value.length - 1) {
    currentPageIndex.value++
  }
}

const previousPage = () => {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--
  }
}

const goToPage = () => {
  // La página se cambia automáticamente con v-model
}

// Iniciar edición inline
const startEditing = () => {
  if (currentPage.value) {
    editingPage.value = true
    editForm.titulo = currentPage.value.titulo || `Página ${currentPageIndex.value + 1}`
    editForm.contenido = currentPage.value.contenido
    editForm.tipo = currentPage.value.tipo
  }
}

// Guardar edición
const saveEdit = async () => {
  if (!currentPage.value) return

  try {
    saving.value = true
    const updateData = {
      titulo: editForm.titulo,
      contenido: editForm.contenido,
      tipo: editForm.tipo,
      libro_id: selectedLibro.value!.id,
    }

    await api.put(`/pagina/${currentPage.value.id}`, updateData)
    await loadPaginas(selectedLibro.value!.id)
    editingPage.value = false
  } catch (error) {
    console.error('Error guardando página:', error)
    alert('Error al guardar la página')
  } finally {
    saving.value = false
  }
}

// Cancelar edición
const cancelEdit = () => {
  editingPage.value = false
  editForm.titulo = ''
  editForm.contenido = ''
  editForm.tipo = 'contenido'
}

// Eliminar página
const deletePagina = async (paginaId: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta página?')) {
    try {
      await api.delete(`/pagina/${paginaId}`)
      await loadPaginas(selectedLibro.value!.id)
    } catch (error) {
      console.error('Error eliminando página:', error)
      alert('Error al eliminar la página')
    }
  }
}

// Manejar envío del formulario (solo para crear nuevas páginas)
const handleSubmit = async () => {
  try {
    // Crear nueva página
    const newPagina = {
      titulo: form.titulo,
      contenido: form.contenido,
      tipo: form.tipo,
      libro_id: selectedLibro.value!.id,
    }

    await api.post('/pagina/', newPagina)
    closeModal()
    await loadPaginas(selectedLibro.value!.id)
  } catch (error) {
    console.error('Error guardando página:', error)
    alert('Error al guardar la página')
  }
}

// Cerrar modal
const closeModal = () => {
  showAddModal.value = false
  form.titulo = ''
  form.contenido = ''
  form.tipo = 'contenido'
}
</script>

<style scoped>
/* Contenedor minimalista */
.minimal-container {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.compact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 20px;
}

.header-info {
  flex: 1;
}

.book-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.book-author {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-nav-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.pages-container {
  margin: 0;
  padding: 0;
}

.page-counter {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  min-width: 60px;
  text-align: center;
}

.nav-btn {
  padding: 8px 16px;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.page-select {
  padding: 8px 12px;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-width: 200px;
}

.page-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Estilos para página única */
.single-page-container {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.single-page {
  background: white;
  min-height: 60vh;
  position: relative;
  box-shadow: none;
  border-radius: 0;
  overflow: hidden;
  transition: transform 0.3s ease;
  border: none;
  border-top: 1px solid #e5e5e5;
}

.single-page:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.single-page:hover .page-actions {
  opacity: 1;
}

.page-number {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.page-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-type {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.page-text {
  flex: 1;
  line-height: 1.6;
  color: #555;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
}

.page-text p {
  margin: 0;
  text-align: justify;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
}

.page-actions {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.mini-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.edit-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-btn:hover {
  background: #1976d2;
  color: white;
  transform: scale(1.1);
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.delete-btn:hover {
  background: #d32f2f;
  color: white;
  transform: scale(1.1);
}

/* Estilos para edición inline */

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-input,
.edit-select,
.edit-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.edit-input:focus,
.edit-select:focus,
.edit-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.title-input {
  font-size: 18px;
  font-weight: 600;
}

.edit-textarea {
  resize: vertical;
  min-height: 200px;
  font-family: inherit;
  line-height: 1.6;
}

.action-buttons,
.edit-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.save-btn {
  background: #4caf50;
  color: white;
}

.save-btn:hover {
  background: #45a049;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #ff9800;
  color: white;
}

.cancel-btn:hover {
  background: #f57c00;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-controls {
    flex-direction: column;
    gap: 12px;
  }

  .page-selector {
    flex-direction: column;
    gap: 8px;
  }

  .page-select {
    min-width: 100%;
  }

  .single-page-container {
    padding: 10px;
  }

  .single-page {
    min-height: 60vh;
  }

  .page-content {
    padding: 20px;
  }
}
</style>
