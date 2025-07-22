// Cambiar la URL base para usar HTTP por defecto
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

// Agregar logging más detallado
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      console.log(`🌐 API Request: ${options.method || "GET"} ${url}`)
      console.log(`🔧 Using API_BASE_URL: ${API_BASE_URL}`)
      console.log(`🔧 Environment variable: ${process.env.NEXT_PUBLIC_API_URL}`)

      const token = this.getAuthToken()
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      if (options.body) {
        console.log(`📤 Request Body:`, JSON.parse(options.body as string))
      }

      const response = await fetch(url, {
        headers,
        ...options,
      })

      console.log(`📡 API Response Status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ API Error Response:`, errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText || `HTTP error! status: ${response.status}` }
        }

        return {
          success: false,
          error: errorData.message || `HTTP error! status: ${response.status}`,
        }
      }

      const data = await response.json()
      console.log(`✅ API Success Response:`, data)

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error(`🚨 API Request Failed:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()

// Interfaces para los DTOs
export interface EmpleadoDto {
  id: number
  nombre: string
  cedula: string
  departamentoId: number
  departamentoDescripcion: string
  tipoPersona: number
  tipoPersonaDescripcion: string
  fechaIngreso: string
  activo: boolean
}

export interface CreateEmpleadoDto {
  nombre: string
  cedula: string
  departamentoId: number
  tipoPersona: number
  fechaIngreso: string
}

export interface UpdateEmpleadoDto {
  nombre: string
  cedula: string
  departamentoId: number
  tipoPersona: number
  fechaIngreso: string
}

export interface DepartamentoDto {
  id: number
  descripcion: string
  activo: boolean
  cantidadEmpleados: number
}

export interface CreateDepartamentoDto {
  descripcion: string
}

export interface UpdateDepartamentoDto {
  descripcion: string
  activo: boolean
}

export interface EmpleadoStatsDto {
  total: number
  porDepartamento: DepartamentoStatsDto[]
  porTipo: TipoPersonaStatsDto[]
}

export interface DepartamentoStatsDto {
  descripcion: string
  cantidad: number
}

export interface TipoPersonaStatsDto {
  tipo: string
  cantidad: number
}

// Tipos de Activos
export interface TipoActivoDto {
  id: number
  descripcion: string
  cuentaContableCompra: string
  cuentaContableDepreciacion: string
  activo: boolean
  cantidadActivos: number
}

export interface CreateTipoActivoDto {
  descripcion: string
  cuentaContableCompra: string
  cuentaContableDepreciacion: string
}

export interface UpdateTipoActivoDto {
  descripcion: string
  cuentaContableCompra: string
  cuentaContableDepreciacion: string
  activo: boolean
}

// Activos Fijos - Estructura corregida según la DB real
export interface ActivoFijoDto {
  id: number
  descripcion: string
  departamentoId?: number
  departamentoDescripcion: string
  tipoActivoId: number
  tipoActivoDescripcion: string
  fechaAdquisicion: string
  valor: number
  depreciacionAcumulada: number
  estado: number
  estadoDescripcion: string
}

export interface CreateActivoFijoDto {
  descripcion: string
  departamentoId?: number
  tipoActivoId: number
  fechaAdquisicion: string
  valor: number
}

export interface UpdateActivoFijoDto {
  descripcion: string
  departamentoId?: number
  tipoActivoId: number
  fechaAdquisicion: string
  valor: number
  estado: number
}

export interface ActivoFijoStatsDto {
  total: number
  enUso: number
  disponibles: number
  enMantenimiento: number
  valorTotal: number
}

// Usuarios y Autenticación - Corregido según la tabla real
export interface UsuarioDto {
  id: number
  nombre: string
  email: string
  idSistemaAuxiliar: number
  fechaCreacion: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  nombre: string
  email: string
  password: string
  idSistemaAuxiliar: number
}

export interface LoginResponseDto {
  token: string
  usuario: UsuarioDto
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}
