const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface LoginResponseDto {
  token: string
  usuario: {
    id: number
    nombre: string
    email: string
    idSistemaAuxiliar: number
    fechaCreacion: string
  }
}

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

export interface TipoActivoDto {
  id: number
  descripcion: string
  cuentaContableCompra: string
  cuentaContableDepreciacion: string
  activo: boolean
  cantidadActivos: number
}

export interface ActivoFijo {
  id: number
  descripcion: string
  departamentoId?: number
  tipoActivoId: number
  fechaAdquisicion: string
  valor: number
  depreciacionAcumulada: number
  estado: number
  departamentoDescripcion: string
  tipoActivoDescripcion: string
  estadoDescripcion: string
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

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type")
  const isJson = contentType && contentType.includes("application/json")

  if (!response.ok) {
    if (isJson) {
      const errorData = await response.json()
      console.log("API Error Response:", JSON.stringify(errorData))
      return {
        success: false,
        error: errorData.message || `Error ${response.status}: ${response.statusText}`,
      }
    } else {
      console.log("API Error Response (non-JSON):", response.statusText)
      return {
        success: false,
        error: `Error ${response.status}: ${response.statusText}`,
      }
    }
  }

  if (isJson) {
    const data = await response.json()
    console.log("API Success Response:", JSON.stringify(data))
    return {
      success: true,
      data,
    }
  }

  return {
    success: true,
  }
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`API Request: GET ${API_BASE_URL}${endpoint}`)
    console.log(`Using API_BASE_URL: ${API_BASE_URL}`)
    console.log(`Environment variable: ${process.env.NEXT_PUBLIC_API_URL}`)

    try {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
      })

      console.log(`API Response Status: ${response.status} ${response.statusText}`)
      return handleResponse<T>(response)
    } catch (error) {
      console.error("API Request Failed:", error)
      return {
        success: false,
        error: "Error de conexión",
      }
    }
  },

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    console.log(` API Request: POST ${API_BASE_URL}${endpoint}`)
    console.log(` Using API_BASE_URL: ${API_BASE_URL}`)
    console.log(` Environment variable: ${process.env.NEXT_PUBLIC_API_URL}`)

    if (data) {
      console.log(`Request Body:`, data)
    }

    try {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: data ? JSON.stringify(data) : undefined,
      })

      console.log(`📡 API Response Status: ${response.status} ${response.statusText}`)
      return handleResponse<T>(response)
    } catch (error) {
      console.error("API Request Failed:", error)
      return {
        success: false,
        error: "Error de conexión",
      }
    }
  },

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    console.log(`API Request: PUT ${API_BASE_URL}${endpoint}`)
    console.log(`Using API_BASE_URL: ${API_BASE_URL}`)
    console.log(`Request Body:`, data)

    try {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      })

      console.log(`API Response Status: ${response.status} ${response.statusText}`)
      return handleResponse<T>(response)
    } catch (error) {
      console.error("API Request Failed:", error)
      return {
        success: false,
        error: "Error de conexión",
      }
    }
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`API Request: DELETE ${API_BASE_URL}${endpoint}`)
    console.log(`Using API_BASE_URL: ${API_BASE_URL}`)

    try {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers,
      })

      console.log(`📡 API Response Status: ${response.status} ${response.statusText}`)
      return handleResponse<T>(response)
    } catch (error) {
      console.error("API Request Failed:", error)
      return {
        success: false,
        error: "Error de conexión",
      }
    }
  },
}
