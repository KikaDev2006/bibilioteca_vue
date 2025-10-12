<template>
  <div
    @click="handleClick"
    class="book-card bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
  >
    <!-- Portada del libro -->
    <div
      class="book-cover h-48 rounded-t-lg flex items-center justify-center text-white text-lg font-bold relative overflow-hidden"
      :style="{ backgroundColor: getBookColor(libro.color_portada) }"
    >
      <!-- Imagen de portada si existe -->
      <img
        v-if="getImageUrl(libro.imagen_portada)"
        :src="getImageUrl(libro.imagen_portada) || ''"
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

      <!-- Badge de calificación promedio -->
      <div v-if="libro.calificacion_promedio && libro.calificacion_promedio > 0" class="rating-badge">
        <span class="star-icon">⭐</span>
        <span class="rating-value">{{ libro.calificacion_promedio.toFixed(1) }}</span>
      </div>
    </div>

    <!-- Lomo del libro -->
    <div
      class="book-spine h-2"
      :style="{ backgroundColor: getBookColor(libro.color_portada) }"
    ></div>

    <!-- Información del libro -->
    <div class="p-3 relative">
      <h3 class="text-base font-bold text-gray-900 mb-1 leading-tight">{{ libro.nombre }}</h3>
      <p class="text-xs text-gray-600 mb-1">
        <span class="font-semibold">Autor:</span> {{ libro.autor }}
      </p>
      <p class="text-xs text-gray-600 mb-2">
        <span class="font-semibold">Versión:</span> {{ libro.version }}
      </p>

      <!-- Progreso de lectura -->
      <div v-if="libro.total_paginas && libro.ultima_pagina_leida" class="mt-2">
        <div class="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progreso</span>
          <span>{{ Math.round((libro.ultima_pagina_leida / libro.total_paginas) * 100) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :style="{ 
              width: `${(libro.ultima_pagina_leida / libro.total_paginas) * 100}%`,
              backgroundColor: getBookColor(libro.color_portada)
            }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Página {{ libro.ultima_pagina_leida }} de {{ libro.total_paginas }}
        </p>
      </div>

      <!-- Calificación promedio -->
      <div v-if="libro.calificacion_promedio && libro.calificacion_promedio > 0" class="mt-2 flex items-center gap-1">
        <span class="text-xs font-semibold text-gray-700">Calificación:</span>
        <div class="flex items-center gap-1">
          <span class="text-yellow-500 text-sm">⭐</span>
          <span class="text-xs font-bold text-gray-900">{{ libro.calificacion_promedio.toFixed(1) }}</span>
          <span class="text-xs text-gray-500">/5</span>
        </div>
      </div>

      <!-- Botones de acciones visibles (siempre visibles para usuarios autenticados) -->
      <div v-if="isAuthenticated" class="mt-3">
        <div class="flex justify-center gap-1 flex-wrap">
          <button
            @click.stop="$emit('toggle-favorito', libro)"
            :class="['action-btn-icon', { 'active': libro.es_favorito }]"
            :title="libro.es_favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          >
            {{ libro.es_favorito ? '❤️' : '🤍' }}
          </button>
          <button
            @click.stop="$emit('toggle-pendiente', libro)"
            :class="['action-btn-icon', { 'active': libro.pendiente_leer }]"
            :title="libro.pendiente_leer ? 'Quitar de pendientes' : 'Marcar como pendiente'"
          >
            {{ libro.pendiente_leer ? '📚' : '📖' }}
          </button>
          <button
            @click.stop="openRatingModal"
            class="action-btn-icon rating-btn-icon"
            title="Calificar libro"
          >
            ⭐
          </button>
          <button
            v-if="isOwner"
            @click.stop="$emit('edit', libro)"
            class="action-btn-icon edit-btn-icon"
            title="Editar libro"
          >
            ✏️
          </button>
          <button
            v-if="isOwner"
            @click.stop="$emit('delete', libro.id)"
            class="action-btn-icon delete-btn-icon"
            title="Eliminar libro"
          >
            🗑️
          </button>
        </div>
      </div>

    </div>
  </div>

  <!-- Modal de calificación -->
  <div
    v-if="showRatingModal"
    @click.stop="closeRatingModal"
    class="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <div @click.stop class="bg-white rounded-lg max-w-md w-full p-6 border-4 border-black shadow-2xl">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Calificar "{{ libro.nombre }}"</h3>
      
      <div class="flex justify-center gap-2 mb-6">
        <button
          v-for="star in 5"
          :key="star"
          @click="selectRating(star)"
          class="star-button"
          :class="{ 'active': star <= selectedRating, 'hover': star <= hoverRating }"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
        >
          {{ star <= (hoverRating || selectedRating) ? '⭐' : '☆' }}
        </button>
      </div>

      <p class="text-center text-gray-600 mb-6">
        {{ selectedRating > 0 ? `Has seleccionado ${selectedRating} estrella${selectedRating > 1 ? 's' : ''}` : 'Selecciona una calificación' }}
      </p>

      <div class="flex justify-end gap-3">
        <button
          @click="closeRatingModal"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          @click="submitRating"
          :disabled="selectedRating === 0"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Calificar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Libro } from '@/types'
import { useAuthStore } from '@/stores/auth'

interface Props {
  libro: Libro
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: [libro: Libro]
  edit: [libro: Libro]
  delete: [libroId: number]
  'toggle-favorito': [libro: Libro]
  'toggle-pendiente': [libro: Libro]
  'rate': [libroId: number, rating: number]
}>()

const authStore = useAuthStore()
const showRatingModal = ref(false)
const selectedRating = ref(0)
const hoverRating = ref(0)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isOwner = computed(() => authStore.isAuthenticated && authStore.user?.id === props.libro.usuario_id)

// Función para obtener la URL correcta de la imagen
const getImageUrl = (imagenPortada: string | null | undefined) => {
  if (!imagenPortada) return null
  
  // Si ya es base64, devolverlo tal cual
  if (imagenPortada.startsWith('data:image')) {
    return imagenPortada
  }
  
  // Si es una ruta relativa, construir URL completa
  if (imagenPortada.startsWith('/media/') || imagenPortada.startsWith('media/')) {
    // Construir URL del backend basada en la URL actual (igual que api.ts)
    const currentUrl = new URL(window.location.href)
    const backendUrl = `${currentUrl.protocol}//${currentUrl.hostname}:8000`
    return `${backendUrl}${imagenPortada.startsWith('/') ? '' : '/'}${imagenPortada}`
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

const handleClick = () => {
  emit('click', props.libro)
}

const openRatingModal = () => {
  showRatingModal.value = true
  selectedRating.value = 0
  hoverRating.value = 0
}

const closeRatingModal = () => {
  showRatingModal.value = false
  selectedRating.value = 0
  hoverRating.value = 0
}

const selectRating = (rating: number) => {
  selectedRating.value = rating
}

const submitRating = () => {
  if (selectedRating.value > 0) {
    emit('rate', props.libro.id, selectedRating.value)
    closeRatingModal()
  }
}
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


/* Badge de calificación */
.rating-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.star-icon {
  font-size: 16px;
}

.rating-value {
  font-size: 14px;
}

/* Botones de acciones - Solo iconos */
.action-btn-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.action-btn-icon:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.action-btn-icon.active {
  background: #eff6ff;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  transform: scale(1.1);
}

.rating-btn-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.rating-btn-icon:hover {
  background: linear-gradient(135deg, #fde68a 0%, #fbbf24 100%);
}

.edit-btn-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.edit-btn-icon:hover {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
}

.delete-btn-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.delete-btn-icon:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
}

/* Responsive para pantallas pequeñas */
@media (max-width: 640px) {
  .action-btn-icon {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
}

/* Modal de calificación */
.star-button {
  font-size: 40px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  filter: grayscale(100%);
}

.star-button.hover,
.star-button.active {
  filter: grayscale(0%);
  transform: scale(1.2);
}

.star-button:hover {
  transform: scale(1.3);
}
</style>
