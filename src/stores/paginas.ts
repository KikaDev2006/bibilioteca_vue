import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Pagina, PaginaIn } from '@/types'
import { api } from '@/config/api'

export const usePaginasStore = defineStore('paginas', () => {
  const paginas = ref<Pagina[]>([])
  const currentPagina = ref<Pagina | null>(null)
  const loading = ref(false)

  const fetchPaginas = async () => {
    loading.value = true
    try {
      const response = await api.get<Pagina[]>('/pagina/')
      paginas.value = response.data
      return response.data
    } finally {
      loading.value = false
    }
  }

  const fetchPagina = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get<Pagina>(`/pagina/${id}`)
      currentPagina.value = response.data
      return response.data
    } finally {
      loading.value = false
    }
  }

  const createPagina = async (paginaData: PaginaIn) => {
    loading.value = true
    try {
      const response = await api.post<Pagina>('/pagina/', paginaData)
      paginas.value.push(response.data)
      return response.data
    } finally {
      loading.value = false
    }
  }

  const updatePagina = async (id: number, paginaData: PaginaIn) => {
    loading.value = true
    try {
      const response = await api.put<Pagina>(`/pagina/${id}`, paginaData)
      const index = paginas.value.findIndex((pagina) => pagina.id === id)
      if (index !== -1) {
        paginas.value[index] = response.data
      }
      if (currentPagina.value?.id === id) {
        currentPagina.value = response.data
      }
      return response.data
    } finally {
      loading.value = false
    }
  }

  const deletePagina = async (id: number) => {
    loading.value = true
    try {
      await api.delete(`/pagina/${id}`)
      paginas.value = paginas.value.filter((pagina) => pagina.id !== id)
      if (currentPagina.value?.id === id) {
        currentPagina.value = null
      }
    } finally {
      loading.value = false
    }
  }

  return {
    paginas,
    currentPagina,
    loading,
    fetchPaginas,
    fetchPagina,
    createPagina,
    updatePagina,
    deletePagina,
  }
})
