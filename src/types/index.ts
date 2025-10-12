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
  usuario_id: number
  autor: string
  created_at: string
  updated_at: string
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
