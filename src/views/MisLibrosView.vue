<template>
  <Layout>
    <div class="minimal-container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Mis Libros</h1>
        <button
          @click="createLibro"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span class="mr-2">➕</span>
          Nuevo Libro
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Cargando tus libros...</p>
      </div>

      <div v-else-if="libros.length > 0" class="books-container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <BookCard
            v-for="libro in libros"
            :key="libro.id"
            :libro="libro"
            @edit="editLibro"
            @delete="deleteLibro"
            @toggle-favorito="toggleFavorite"
            @toggle-pendiente="togglePendiente"
          />
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-gray-600 text-lg mb-4">No tienes libros aún</p>
        <button
          @click="createLibro"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Crear tu primer libro
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '@/components/Layout.vue'
import BookCard from '@/components/BookCard.vue'
import { api } from '@/config/api'

import type { Libro } from '@/types'

const router = useRouter()
const libros = ref<Libro[]>([])
const loading = ref(true)

const fetchMisLibros = async () => {
  try {
    loading.value = true
    const response = await api.get('/libro/mis-libros')
    libros.value = response.data
  } catch (error) {
    console.error('Error al cargar mis libros:', error)
  } finally {
    loading.value = false
  }
}

const createLibro = () => {
  router.push('/libros/create')
}

const editLibro = (libro: Libro) => {
  router.push(`/libros/${libro.id}/edit`)
}

const deleteLibro = async (libroId: number) => {
  const libro = libros.value.find(l => l.id === libroId)
  if (libro && confirm(`¿Estás seguro de que quieres eliminar "${libro.nombre}"?`)) {
    try {
      await api.delete(`/libro/${libroId}`)
      await fetchMisLibros() // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar el libro:', error)
    }
  }
}

const toggleFavorite = async (libro: Libro) => {
  try {
    await api.post(`/libro/${libro.id}/favorito`)
    await fetchMisLibros() // Recargar la lista
  } catch (error) {
    console.error('Error al actualizar favorito:', error)
  }
}

const togglePendiente = async (libro: Libro) => {
  try {
    await api.post(`/libro/${libro.id}/pendiente`)
    await fetchMisLibros() // Recargar la lista
  } catch (error) {
    console.error('Error al actualizar pendiente:', error)
  }
}

onMounted(() => {
  fetchMisLibros()
})
</script>

<style scoped>
.minimal-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
