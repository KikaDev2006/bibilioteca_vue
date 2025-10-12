import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Usuario, LoginIn, LoginOut } from '@/types'
import { api } from '@/config/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Usuario | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Inicializar usuario desde localStorage
  const initUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
      }
    }
  }

  // Inicializar automáticamente al crear el store
  initUser()

  const login = async (credentials: LoginIn): Promise<LoginOut> => {
    loading.value = true
    try {
      console.log('Auth Store: Iniciando login...')
      const response = await api.post<LoginOut>('/usuario/login', credentials)
      console.log('Auth Store: Respuesta del login:', response.data)

      const { token: newToken, usuario } = response.data

      token.value = newToken
      user.value = usuario

      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(usuario))

      console.log('Auth Store: Token guardado:', newToken)
      console.log('Auth Store: Usuario guardado:', usuario)
      console.log('Auth Store: isAuthenticated:', isAuthenticated.value)

      return response.data
    } catch (error) {
      console.error('Auth Store: Error en login:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: any) => {
    loading.value = true
    try {
      const response = await api.post('/usuario/', userData)
      return response.data
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/usuario/logout')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const getCurrentUser = async () => {
    if (!token.value) return null

    try {
      const response = await api.get<Usuario>('/usuario/me')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario actual:', error)
      logout()
      return null
    }
  }

  const updateUser = async (userData: any) => {
    if (!user.value) return null

    try {
      const response = await api.put(`/usuario/${user.value.id}`, userData)
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      throw error
    }
  }

  // Inicializar al crear el store
  initUser()

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getCurrentUser,
    updateUser,
  }
})
