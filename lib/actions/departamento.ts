"use server"

import { revalidatePath } from "next/cache"
import {
  apiClient,
  type DepartamentoDto,
  type CreateDepartamentoDto,
  type UpdateDepartamentoDto,
  type DepartamentoStatsDto,
} from "@/lib/api-client"

export async function getDepartamentosById(search?: string, departamentoId?: number) {
  try {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (departamentoId) params.append("departamentoId", departamentoId.toString())

    const queryString = params.toString()
    const endpoint = `/departamentos${queryString ? `?${queryString}` : ""}`

    const result = await apiClient.get<DepartamentoDto[]>(endpoint)
    return result
  } catch (error) {
    console.error("Error fetching departamentos:", error)
    return { success: false, error: "Error al obtener departamentos" }
  }
}

export async function getDepartamentoByDescripcion(descripcion: string) {
  try {
    const result = await apiClient.get<DepartamentoDto>(`/departamentos/${descripcion}`)
    return result
  } catch (error) {
    console.error("Error fetching departamento:", error)
    return { success: false, error: "Error al obtener departamento" }
  }
}

export async function getDepartamentos() {
  try {
    const result = await apiClient.get<DepartamentoDto[]>("/departamentos")
    return result
  } catch (error) {
    console.error("Error fetching departamentos:", error)
    return { success: false, error: "Error al obtener departamentos" }
  }
}

export async function createDepartamento(formData: FormData) {
  try {
    const createDto: CreateDepartamentoDto = {
      descripcion: formData.get("desceipcion") as string,
    }

    // Validaciones
    if (
      !createDto.descripcion
    ) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.post<DepartamentoDto>("/departamentos", createDto)

    if (result.success) {
      revalidatePath("/departamentos")
      return { success: true, message: "Departamento creado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error creating departamento:", error)
    return { success: false, error: "Error al crear departamento" }
  }
}

export async function updateDepartamento(id: number, formData: FormData) {
  try {
    const updateDto: UpdateDepartamentoDto = {
      descripcion: formData.get("descripcion") as string,
    }

    // Validaciones
    if (
      !updateDto.descripcion
    ) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.put<DepartamentoDto>(`/departamentos/${id}`, updateDto)

    if (result.success) {
      revalidatePath("/departamentos")
      return { success: true, message: "Departamento actualizado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error updating departamento:", error)
    return { success: false, error: "Error al actualizar departamento" }
  }
}

export async function deleteDepartamento(id: number) {
  try {
    const result = await apiClient.delete(`/departamentos/${id}`)

    if (result.success) {
      revalidatePath("/departamentos")
      return { success: true, message: "Departamento eliminado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error deleting departamento:", error)
    return { success: false, error: "Error al eliminar departamento" }
  }
}

export async function getDepartamentosStats() {
  try {
    const result = await apiClient.get<DepartamentoStatsDto>("/departamento/stats")
    return result
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}
