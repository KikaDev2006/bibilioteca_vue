export interface Usuario {
  id: number
  nombre_completo: string
  email: string
  created_at: string
  updated_at: string
}

export interface UsuarioIn {
  nombre_completo: string
  email: string
  contraseña: string
}

export interface UsuarioUpdate {
  nombre_completo?: string
  email?: string
  contraseña?: string
}

export interface LoginIn {
  email: string
  contraseña: string
}

export interface LoginOut {
  success: boolean
  usuario: Usuario
  message: string
  token: string
}

export interface GeneroLibro {
  id: number
  genero: string
  created_at: string
  updated_at: string
}

export interface GeneroLibroIn {
  genero: string
}

export interface Libro {
  id: number
  nombre: string
  version: number
  genero_id: number | null
  genero: string | null
  color_portada: string
  imagen_portada: string | null
  es_publico: boolean
  usuario_id: number
  autor: string
  created_at: string
  updated_at: string
  ultima_pagina_leida: number | null
  ultima_pagina_leida_id: number | null
  esta_terminado: boolean | null
  total_paginas: number | null
  es_favorito: boolean | null
  pendiente_leer: boolean | null
  calificacion_promedio: number | null
}

export interface LibroIn {
  nombre: string
  version: number
  genero_id?: number | null
  color_portada: string
}

export interface Pagina {
  id: number
  contenido: string
  tipo: string
  titulo: string | null
  libro_id: number
  libro_nombre: string | null
  created_at: string
  updated_at: string
}

export interface PaginaIn {
  contenido: string
  tipo: string
  titulo?: string | null
  libro_id: number
}

export interface AccionUsuario {
  id: number
  usuario_id: number
  libro_id: number
  libro_nombre: string
  es_favorito: boolean
  ultima_pagina_leida: number
  pendiente_leer: boolean
  calificacion: number
  created_at: string
  updated_at: string
}

export interface AccionUsuarioIn {
  libro_id: number
  es_favorito?: boolean
  ultima_pagina_leida_id?: number
  pendiente_leer?: boolean
  calificacion?: number
}
