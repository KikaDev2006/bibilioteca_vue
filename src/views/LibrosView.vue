<template>
  <Layout>
    <div class="minimal-container">
      <!-- Header con botón de crear -->
      <div class="books-header">
        <h1 class="page-title">Biblioteca Digital</h1>
        <div class="flex items-center gap-3">
          <button 
            v-if="authStore.isAuthenticated" 
            @click="toggleMisLibros"
            :class="['btn-secondary', { 'btn-active': mostrarSoloMisLibros }]"
          >
            {{ mostrarSoloMisLibros ? '📚 Todos los Libros' : '📖 Mis Libros' }}
          </button>
          <button v-if="authStore.isAuthenticated" @click="createLibro" class="btn-primary">+ Nuevo Libro</button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <p class="mt-2 text-gray-600">Cargando libros...</p>
      </div>
      <div v-else-if="libros.length > 0" class="books-container">
        <!-- Cards de géneros para filtrar -->
        <div class="genre-cards-container">
          <!-- Card "Todos" -->
          <div
            @click="selectedGenero = null"
            :class="['genre-card', { active: selectedGenero === null }]"
            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          >
            <div class="genre-card-content">
              <div class="genre-card-icon">📚</div>
              <div class="genre-card-name">Todos</div>
              <div class="genre-card-count">{{ libros.length }}</div>
            </div>
          </div>

          <!-- Cards de géneros -->
          <div
            v-for="(generoGroup, index) in librosPorGenero"
            :key="generoGroup.genero"
            @click="selectedGenero = generoGroup.genero"
            :class="['genre-card', { active: selectedGenero === generoGroup.genero }]"
            :style="{ background: getGenreColor(index) }"
          >
            <div class="genre-card-content">
              <div class="genre-card-icon">{{ getGenreIcon(generoGroup.genero) }}</div>
              <div class="genre-card-name">{{ generoGroup.genero }}</div>
              <div class="genre-card-count">{{ generoGroup.libros.length }}</div>
            </div>
          </div>
        </div>

        <!-- Libros filtrados por género -->
        <div class="filtered-books-section">
          <h2 class="section-title">
            {{ selectedGenero || 'Todos los libros' }}
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
            <div
              v-for="libro in librosFiltrados"
              :key="libro.id"
              @click="selectLibro(libro)"
              class="book-card bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <!-- Portada del libro -->
              <div
                class="book-cover h-80 rounded-t-lg flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden"
                :style="{ backgroundColor: getBookColor(libro.color_portada) }"
              >
                <!-- Imagen de portada si existe -->
                <img
                  v-if="getImageUrl((libro as any).imagen_portada)"
                  :src="getImageUrl((libro as any).imagen_portada)"
                  :alt="libro.nombre"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                
                <!-- Fallback con icono y nombre si no hay imagen -->
                <template v-else>
                  <div
                    class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"
                  ></div>
                  <div class="relative z-10 text-center">
                    <div class="text-4xl mb-2">📖</div>
                    <div class="text-sm opacity-90">{{ libro.nombre }}</div>
                  </div>
                </template>
              </div>

              <!-- Lomo del libro -->
              <div
                class="book-spine h-2"
                :style="{ backgroundColor: getBookColor(libro.color_portada) }"
              ></div>

              <!-- Información del libro -->
              <div class="p-4 relative">
                <!-- Botones de gestión (solo para el dueño del libro) -->
                <div v-if="authStore.isAuthenticated && authStore.user?.id === libro.usuario_id" class="book-actions">
                  <button
                    @click.stop="editLibro(libro)"
                    class="mini-btn edit-btn"
                    title="Editar libro"
                  >
                    ✏️
                  </button>
                  <button
                    @click.stop="deleteLibro(libro.id)"
                    class="mini-btn delete-btn"
                    title="Eliminar libro"
                  >
                    🗑️
                  </button>
                </div>

                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ libro.nombre }}</h3>
                <p class="text-sm text-gray-600 mb-1">
                  <span class="font-semibold">Autor:</span> {{ libro.autor }}
                </p>
                <p class="text-sm text-gray-600 mb-1">
                  <span class="font-semibold">Versión:</span> {{ libro.version }}
                </p>

                <!-- Páginas del libro -->
                <div class="flex space-x-1 mb-3 mt-3">
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="w-1 h-8 rounded-sm opacity-60"
                    :style="{ backgroundColor: getBookColor(libro.color_portada) }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para crear/editar libro -->
      <div
        v-if="showCreateModal || showEditModal"
        class="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border-4 border-black shadow-2xl">
          <!-- Header del modal (fijo) -->
          <div class="p-6 border-b flex-shrink-0">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showEditModal ? 'Editar Libro' : 'Nuevo Libro' }}
            </h3>
          </div>

          <!-- Formulario (con scroll) -->
          <div class="p-6 overflow-y-auto flex-1">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Libro</label>
                <input
                  v-model="form.nombre"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del libro"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Versión</label>
                  <input
                    v-model="form.version"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="v1.0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Género</label>
                  <select
                    v-model="form.genero_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar género</option>
                    <option v-for="genero in generos" :key="genero.id" :value="genero.id">
                      {{ genero.genero }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imagen de Portada</label>
                <div class="space-y-3">
                  <!-- Preview de la imagen -->
                  <div v-if="imagePreview" class="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                    <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      @click="removeImage"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <!-- Input de archivo -->
                  <div class="flex items-center gap-3">
                    <label class="flex-1 cursor-pointer">
                      <div class="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition">
                        <span class="text-sm text-gray-600">
                          {{ imagePreview ? 'Cambiar imagen' : '📷 Seleccionar imagen' }}
                        </span>
                      </div>
                      <input
                        type="file"
                        @change="handleImageUpload"
                        accept="image/*"
                        class="hidden"
                      />
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">Formatos: JPG, PNG, GIF (máx. 5MB)</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Color de Portada (si no hay imagen)</label>
                <div class="grid grid-cols-4 gap-2">
                  <label
                    v-for="color in [
                      'azul',
                      'verde',
                      'rojo',
                      'amarillo',
                      'morado',
                      'rosa',
                      'naranja',
                      'gris',
                    ]"
                    :key="color"
                    class="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      v-model="form.color_portada"
                      type="radio"
                      :value="color"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <div
                      class="w-6 h-6 rounded-full border-2"
                      :class="{
                        'border-gray-400': form.color_portada !== color,
                        'border-gray-800': form.color_portada === color,
                      }"
                      :style="{ backgroundColor: getBookColor(color) }"
                    ></div>
                    <span class="text-sm capitalize">{{ color }}</span>
                  </label>
                </div>
              </div>

              <!-- Campo Es Público -->
              <div>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="form.es_publico"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-gray-700">Hacer este libro público</span>
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">
                  Los libros públicos pueden ser vistos por cualquier usuario
                </p>
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
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {{ showEditModal ? 'Actualizar' : 'Crear' }} Libro
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/config/api'
import Layout from '@/components/Layout.vue'
import type { Libro } from '@/types'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const libros = ref<Libro[]>([])
const generos = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingLibro = ref<Libro | null>(null)
const selectedGenero = ref<string | null>(null)
const mostrarSoloMisLibros = ref(false)
const imagePreview = ref<string | null>(null)
const imageFile = ref<File | null>(null)

const form = reactive({
  nombre: '',
  version: '',
  color_portada: 'azul',
  genero_id: null as number | null,
  imagen_portada: '' as string,
  es_publico: true,
})

// Computed property para organizar libros por género
const librosPorGenero = computed(() => {
  // Agrupar libros por género
  const grupos: { [key: string]: Libro[] } = {}

  libros.value.forEach((libro) => {
    const generoNombre = libro.genero || 'Sin género'
    if (!grupos[generoNombre]) {
      grupos[generoNombre] = []
    }
    grupos[generoNombre].push(libro)
  })

  // Convertir a array y ordenar por nombre de género
  return Object.keys(grupos)
    .sort()
    .map((genero) => ({
      genero,
      libros: grupos[genero],
    }))
})

// Computed property para filtrar libros por género seleccionado y "Mis Libros"
const librosFiltrados = computed(() => {
  let filtrados = libros.value
  
  // Filtrar por "Mis Libros" si está activo
  if (mostrarSoloMisLibros.value && authStore.user) {
    filtrados = filtrados.filter((libro) => libro.usuario_id === authStore.user?.id)
  }
  
  // Filtrar por género si hay uno seleccionado
  if (selectedGenero.value) {
    filtrados = filtrados.filter((libro) => {
      const generoNombre = libro.genero || 'Sin género'
      return generoNombre === selectedGenero.value
    })
  }
  
  return filtrados
})

// Función para obtener color de género
const getGenreColor = (index: number) => {
  const colors = [
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  ]
  return colors[index % colors.length]
}

// Función para obtener icono de género
const getGenreIcon = (genero: string) => {
  const iconMap: { [key: string]: string } = {
    'Ficción': '📖',
    'No Ficción': '📚',
    'Ciencia': '🔬',
    'Historia': '📜',
    'Biografía': '👤',
    'Fantasía': '🐉',
    'Romance': '💕',
    'Misterio': '🔍',
    'Terror': '👻',
    'Aventura': '🗺️',
    'Poesía': '✍️',
    'Drama': '🎭',
    'Comedia': '😄',
    'Tecnología': '💻',
    'Arte': '🎨',
    'Cocina': '🍳',
    'Viajes': '✈️',
    'Autoayuda': '🌟',
    'Negocios': '💼',
    'Sin género': '📄',
  }
  return iconMap[genero] || '📕'
}

// Función para obtener la URL correcta de la imagen
const getImageUrl = (imagenPortada: string | null | undefined) => {
  if (!imagenPortada) return null
  
  // Si ya es base64, devolverlo tal cual
  if (imagenPortada.startsWith('data:image')) {
    return imagenPortada
  }
  
  // Si es una ruta relativa, construir URL completa
  if (imagenPortada.startsWith('/media/') || imagenPortada.startsWith('media/')) {
    return `http://localhost:8000${imagenPortada.startsWith('/') ? '' : '/'}${imagenPortada}`
  }
  
  // Si es una URL completa, devolverla tal cual
  if (imagenPortada.startsWith('http://') || imagenPortada.startsWith('https://')) {
    return imagenPortada
  }
  
  return null
}

// Función para convertir colores de texto a colores reales
const getBookColor = (colorText: string) => {
  const colorMap: { [key: string]: string } = {
    verde: '#22c55e',
    azul: '#3b82f6',
    rojo: '#ef4444',
    amarillo: '#eab308',
    morado: '#a855f7',
    rosa: '#ec4899',
    naranja: '#f97316',
    gris: '#6b7280',
    negro: '#1f2937',
    blanco: '#f3f4f6',
  }

  return colorMap[colorText.toLowerCase()] || colorText || '#3b82f6'
}

// Función para manejar la carga de imagen
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. El tamaño máximo es 5MB.')
      return
    }
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.')
      return
    }
    
    imageFile.value = file
    
    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Función para eliminar imagen
const removeImage = () => {
  imagePreview.value = null
  imageFile.value = null
  form.imagen_portada = ''
}

// Función para comprimir y convertir imagen a base64
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Crear canvas para redimensionar
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Calcular nuevas dimensiones (máximo 800px de ancho)
        let width = img.width
        let height = img.height
        const maxWidth = 800
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convertir a base64 con calidad reducida
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
        resolve(compressedBase64)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const loadLibros = async () => {
  try {
    console.log('Cargando libros...')
    loading.value = true
    const response = await api.get('/libro/')
    console.log('Respuesta:', response.data)
    libros.value = response.data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

// Cargar géneros desde la API
const loadGeneros = async () => {
  try {
    const response = await api.get('/genero_libro/')
    console.log('Géneros cargados:', response.data)
    generos.value = response.data
  } catch (error) {
    console.error('Error cargando géneros:', error)
  }
}

// Función para seleccionar un libro
const selectLibro = async (libro: Libro) => {
  // Redirigir a la vista de páginas del libro
  router.push(`/libros/${libro.id}/paginas`)
}

// Función para editar libro
const editLibro = (libro: Libro) => {
  editingLibro.value = libro
  form.nombre = libro.nombre
  form.version = libro.version
  form.color_portada = libro.color_portada
  form.genero_id = libro.genero_id
  form.imagen_portada = (libro as any).imagen_portada || ''
  form.es_publico = (libro as any).es_publico ?? true
  
  // Cargar preview si existe imagen
  if ((libro as any).imagen_portada) {
    imagePreview.value = (libro as any).imagen_portada
  }
  
  showEditModal.value = true
}

// Función para eliminar libro
const deleteLibro = async (libroId: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
    try {
      await api.delete(`/libro/${libroId}`)
      await loadLibros()
      alert('Libro eliminado correctamente')
    } catch (error) {
      console.error('Error eliminando libro:', error)
      alert('Error al eliminar el libro')
    }
  }
}

// Función para alternar entre "Todos" y "Mis Libros"
const toggleMisLibros = async () => {
  mostrarSoloMisLibros.value = !mostrarSoloMisLibros.value
  
  // Si se activa "Mis Libros", cargar desde el endpoint específico
  if (mostrarSoloMisLibros.value) {
    await loadMisLibros()
  } else {
    // Si se desactiva, volver a cargar todos los libros
    await loadLibros()
  }
  
  // Resetear el filtro de género al cambiar de vista
  selectedGenero.value = null
}

// Función para cargar solo mis libros
const loadMisLibros = async () => {
  try {
    loading.value = true
    const response = await api.get('/libro/mis-libros')
    libros.value = response.data
  } catch (error) {
    console.error('Error cargando mis libros:', error)
  } finally {
    loading.value = false
  }
}

// Función para crear nuevo libro
const createLibro = () => {
  resetForm()
  showCreateModal.value = true
}

// Resetear formulario
const resetForm = () => {
  form.nombre = ''
  form.version = ''
  form.color_portada = 'azul'
  form.genero_id = null
  form.imagen_portada = ''
  form.es_publico = true
  imagePreview.value = null
  imageFile.value = null
}

// Manejar envío del formulario
const handleSubmit = async () => {
  try {
    const formData = new FormData()
    
    // Agregar campos obligatorios como strings
    formData.append('nombre', form.nombre)
    formData.append('version', String(form.version))
    formData.append('color_portada', form.color_portada)
    formData.append('es_publico', String(form.es_publico))
    
    // Agregar genero_id solo si existe
    if (form.genero_id) {
      formData.append('genero_id', String(form.genero_id))
    }
    
    // Agregar imagen solo si el usuario seleccionó una nueva
    if (imageFile.value) {
      console.log('Agregando imagen al FormData:', imageFile.value)
      console.log('Tipo de archivo:', imageFile.value.type)
      console.log('Tamaño de archivo:', imageFile.value.size)
      formData.append('imagen_portada', imageFile.value)
    }
    
    // Debug: Ver contenido del FormData
    console.log('Contenido del FormData:')
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1])
    }
    
    if (showEditModal.value && editingLibro.value) {
      // Editar libro existente
      console.log('Enviando PUT a:', `/libro/${editingLibro.value.id}`)
      await api.put(`/libro/${editingLibro.value.id}`, formData)
      alert('Libro actualizado correctamente')
    } else {
      // Crear nuevo libro
      console.log('Enviando POST a:', '/libro/')
      await api.post('/libro/', formData)
      alert('Libro creado correctamente')
    }

    closeModal()
    await loadLibros()
  } catch (error) {
    console.error('Error guardando libro:', error)
    console.error('Detalles del error:', error.response?.data)
    alert('Error al guardar el libro: ' + (error.response?.data?.detail || error.message))
  }
}

// Cerrar modal
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingLibro.value = null
  resetForm()
}

// Cargar automáticamente al montar el componente
onMounted(async () => {
  await Promise.all([loadLibros(), loadGeneros()])
})
</script>

<style scoped>
.book-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px) rotateX(5deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.book-cover {
  position: relative;
  background: linear-gradient(135deg, var(--book-color) 0%, var(--book-color-dark) 100%);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.book-spine {
  background: linear-gradient(90deg, var(--book-color) 0%, var(--book-color-dark) 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover::before {
  opacity: 1;
}

/* Estilos minimalistas */
.minimal-container {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.books-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #eff6ff;
  transform: translateY(-1px);
}

.btn-secondary.btn-active {
  background: #3b82f6;
  color: white;
}

.books-grid {
  margin: 0;
  padding: 0;
}

.books-grid .grid {
  margin: 0;
  padding: 0;
}

.book-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.book-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Botones de gestión de libros */
.book-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.book-card:hover .book-actions {
  opacity: 1;
}

.mini-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
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

/* Estilos para el índice de géneros */
.books-container {
  margin: 0;
  padding: 0;
}

/* Cards de géneros */
.genre-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.genre-card {
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.genre-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.genre-card.active {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  border: 3px solid white;
}

.genre-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.genre-card:hover::before {
  opacity: 1;
}

.genre-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
  position: relative;
  z-index: 1;
}

.genre-card-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.genre-card-name {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.genre-card-count {
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Sección de libros filtrados */
.filtered-books-section {
  margin-top: 24px;
}

.filtered-books-section .grid {
  grid-auto-rows: 1fr;
}

.filtered-books-section .grid > div {
  display: flex;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e5e5;
}

.genre-section {
  margin-bottom: 48px;
}

.genre-header {
  border-bottom: 2px solid #e5e5e5;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.genre-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.genre-count {
  font-size: 16px;
  font-weight: 400;
  color: #6b7280;
}

/* Responsive para cards de géneros */
@media (max-width: 768px) {
  .genre-cards-container {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .genre-card {
    padding: 16px;
  }

  .genre-card-icon {
    font-size: 28px;
  }

  .genre-card-name {
    font-size: 14px;
  }
}
</style>
