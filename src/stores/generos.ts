import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GeneroLibro, GeneroLibroIn } from '@/types'
import { api } from '@/config/api'

export const useGenerosStore = defineStore('generos', () => {
  const generos = ref<GeneroLibro[]>([])
  const currentGenero = ref<GeneroLibro | null>(null)
  const loading = ref(false)

  const fetchGeneros = async () => {
    loading.value = true
    try {
      const response = await api.get<GeneroLibro[]>('/genero_libro/')
      generos.value = response.data
      return response.data
    } finally {
      loading.value = false
    }
  }

  const fetchGenero = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get<GeneroLibro>(`/genero_libro/${id}`)
      currentGenero.value = response.data
      return response.data
    } finally {
      loading.value = false
    }
  }

  const createGenero = async (generoData: GeneroLibroIn) => {
    loading.value = true
    try {
      const response = await api.post<GeneroLibro>('/genero_libro/', generoData)
      generos.value.push(response.data)
      return response.data
    } finally {
      loading.value = false
    }
  }

  const updateGenero = async (id: number, generoData: GeneroLibroIn) => {
    loading.value = true
    try {
      const response = await api.put<GeneroLibro>(`/genero_libro/${id}`, generoData)
      const index = generos.value.findIndex((genero) => genero.id === id)
      if (index !== -1) {
        generos.value[index] = response.data
      }
      if (currentGenero.value?.id === id) {
        currentGenero.value = response.data
      }
      return response.data
    } finally {
      loading.value = false
    }
  }

  const deleteGenero = async (id: number) => {
    loading.value = true
    try {
      await api.delete(`/genero_libro/${id}`)
      generos.value = generos.value.filter((genero) => genero.id !== id)
      if (currentGenero.value?.id === id) {
        currentGenero.value = null
      }
    } finally {
      loading.value = false
    }
  }

  return {
    generos,
    currentGenero,
    loading,
    fetchGeneros,
    fetchGenero,
    createGenero,
    updateGenero,
    deleteGenero,
  }
})
