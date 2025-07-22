"use server"

import { apiClient } from "@/lib/api-client"

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  nombre: string
  email: string
  password: string
  idSistemaAuxiliar: number
}

export interface LoginResponse {
  token: string
  usuario: {
    id: number
    nombre: string
    email: string
    idSistemaAuxiliar: number
    fechaCreacion: string
  }
}

export async function login(data: LoginData) {
  try {
    const result = await apiClient.post<LoginResponse>("/usuarios/login", data)

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        message: "Login exitoso",
      }
    }

    return {
      success: false,
      error: result.error || "Credenciales inválidas",
    }
  } catch (error) {
    return {
      success: false,
      error: "Error de conexión con el servidor",
    }
  }
}

export async function register(data: RegisterData) {
  try {
    const result = await apiClient.post("/usuarios/register", data)

    if (result.success) {
      return {
        success: true,
        message: "Cuenta creada exitosamente",
      }
    }

    return {
      success: false,
      error: result.error || "Error al crear la cuenta",
    }
  } catch (error) {
    return {
      success: false,
      error: "Error de conexión con el servidor",
    }
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const result = await apiClient.post("/usuarios/validate-token", { token })
    return result.success
  } catch (error) {
    return false
  }
}

export async function logout() {
  try {
    return { success: true }
  } catch (error) {
    return { success: false, error: "Error al cerrar sesión" }
  }
}
