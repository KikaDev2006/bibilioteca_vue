import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

console.log('API_BASE_URL:', API_BASE_URL)
console.log('VITE_API_BASE_URL env:', import.meta.env.VITE_API_BASE_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
})

// Interceptor para agregar el token de autenticación y configurar headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
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
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
