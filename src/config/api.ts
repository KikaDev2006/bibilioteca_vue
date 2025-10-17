import axios from 'axios'
import { getItem, removeItem } from '@/utils/storage'

// Función para obtener la URL del backend dinámicamente
const getBackendUrl = () => {
  // Si hay variable de entorno definida, usarla
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  // Construir URL del backend basada en la URL actual
  const currentUrl = new URL(window.location.href)
  return `${currentUrl.protocol}//${currentUrl.hostname}:8000`
}

const API_BASE_URL = getBackendUrl()

console.log('API_BASE_URL:', API_BASE_URL)
console.log('VITE_API_BASE_URL env:', import.meta.env.VITE_API_BASE_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
})

// Interceptor para agregar el token de autenticación y configurar headers
api.interceptors.request.use((config) => {
  const token = getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Si NO es FormData, agregar Content-Type: application/json
  // Si ES FormData, dejar que el navegador configure el Content-Type automáticamente
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }
  
  return config
})

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
  removeItem('token')
  removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
