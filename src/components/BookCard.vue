<template>
  <div
    @click="handleClick"
    class="book-card bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
  >
    <!-- Portada del libro -->
    <div
      class="book-cover h-80 rounded-t-lg flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden"
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
    <div class="p-4 relative">
      <h3 class="text-lg font-bold text-gray-900 mb-2">{{ libro.nombre }}</h3>
      <p class="text-sm text-gray-600 mb-1">
        <span class="font-semibold">Autor:</span> {{ libro.autor }}
      </p>
      <p class="text-sm text-gray-600 mb-1">
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
      <div v-if="libro.calificacion_promedio && libro.calificacion_promedio > 0" class="mt-3 flex items-center gap-2">
        <span class="text-sm font-semibold text-gray-700">Calificación:</span>
        <div class="flex items-center gap-1">
          <span class="text-yellow-500 text-lg">⭐</span>
          <span class="text-sm font-bold text-gray-900">{{ libro.calificacion_promedio.toFixed(1) }}</span>
          <span class="text-xs text-gray-500">/5</span>
        </div>
      </div>

      <!-- Botones de acciones visibles (siempre visibles para usuarios autenticados) -->
      <div v-if="isAuthenticated" class="mt-4 pt-3 border-t border-gray-200">
        <div class="flex justify-around gap-2">
          <button
            @click.stop="$emit('toggle-favorito', libro)"
            :class="['action-btn-visible', { 'active': libro.es_favorito }]"
            :title="libro.es_favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          >
            <span class="text-xl">{{ libro.es_favorito ? '❤️' : '🤍' }}</span>
            <span class="text-xs">Favorito</span>
          </button>
          <button
            @click.stop="$emit('toggle-pendiente', libro)"
            :class="['action-btn-visible', { 'active': libro.pendiente_leer }]"
            :title="libro.pendiente_leer ? 'Quitar de pendientes' : 'Marcar como pendiente'"
          >
            <span class="text-xl">{{ libro.pendiente_leer ? '📚' : '📖' }}</span>
            <span class="text-xs">Pendiente</span>
          </button>
          <button
            @click.stop="openRatingModal"
            class="action-btn-visible rating-btn-visible"
            title="Calificar libro"
          >
            <span class="text-xl">⭐</span>
            <span class="text-xs">Calificar</span>
          </button>
        </div>
        
        <!-- Botones de gestión (solo para el dueño del libro) -->
        <div v-if="isOwner" class="flex gap-2 mt-3">
          <button
            @click.stop="$emit('edit', libro)"
            class="action-btn-visible edit-btn-visible"
            title="Editar libro"
          >
            <span class="text-xl">✏️</span>
            <span class="text-xs">Editar</span>
          </button>
          <button
            @click.stop="$emit('delete', libro.id)"
            class="action-btn-visible delete-btn-visible"
            title="Eliminar libro"
          >
            <span class="text-xl">🗑️</span>
            <span class="text-xs">Eliminar</span>
          </button>
        </div>
      </div>

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

/* Botones de acciones visibles (siempre visibles) */
.action-btn-visible {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.action-btn-visible:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn-visible.active {
  background: #eff6ff;
  border-color: #3b82f6;
  border-width: 2px;
}

.rating-btn-visible {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #fbbf24;
}

.rating-btn-visible:hover {
  background: linear-gradient(135deg, #fde68a 0%, #fbbf24 100%);
  border-color: #f59e0b;
}

.edit-btn-visible {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
}

.edit-btn-visible:hover {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
  border-color: #2563eb;
}

.delete-btn-visible {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #ef4444;
}

.delete-btn-visible:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-color: #dc2626;
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
