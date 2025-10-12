import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Libro, LibroIn } from '@/types'
import { api } from '@/config/api'

export const useLibrosStore = defineStore('libros', () => {
  const libros = ref<Libro[]>([])
  const currentLibro = ref<Libro | null>(null)
  const loading = ref(false)

  const fetchLibros = async () => {
    console.log('Store: Iniciando fetchLibros')
    loading.value = true
    try {
      const response = await api.get<Libro[]>('/libro/')
      console.log('Store: Respuesta recibida:', response.data)
      libros.value = response.data
      console.log('Store: Libros asignados:', libros.value)
      return response.data
    } catch (error) {
      console.error('Store: Error en fetchLibros:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchLibro = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get<Libro>(`/libro/${id}`)
      currentLibro.value = response.data
      return response.data
    } finally {
      loading.value = false
    }
  }

  const createLibro = async (libroData: LibroIn) => {
    loading.value = true
    try {
      const response = await api.post<Libro>('/libro/', libroData)
      libros.value.push(response.data)
      return response.data
    } finally {
      loading.value = false
    }
  }

  const updateLibro = async (id: number, libroData: LibroIn) => {
    loading.value = true
    try {
      const response = await api.put<Libro>(`/libro/${id}`, libroData)
      const index = libros.value.findIndex((libro) => libro.id === id)
      if (index !== -1) {
        libros.value[index] = response.data
      }
      if (currentLibro.value?.id === id) {
        currentLibro.value = response.data
      }
      return response.data
    } finally {
      loading.value = false
    }
  }

  const deleteLibro = async (id: number) => {
    loading.value = true
    try {
      await api.delete(`/libro/${id}`)
      libros.value = libros.value.filter((libro) => libro.id !== id)
      if (currentLibro.value?.id === id) {
        currentLibro.value = null
      }
    } finally {
      loading.value = false
    }
  }

  const fetchPaginasByLibro = async (libroId: number) => {
    try {
      const response = await api.get(`/libro/${libroId}/paginas`)
      return response.data
    } catch (error) {
      console.error('Error al obtener páginas del libro:', error)
      throw error
    }
  }

  return {
    libros,
    currentLibro,
    loading,
    fetchLibros,
    fetchLibro,
    createLibro,
    updateLibro,
    deleteLibro,
    fetchPaginasByLibro,
  }
})
