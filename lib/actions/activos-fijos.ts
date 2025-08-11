"use server"

import { revalidatePath } from "next/cache"
import { apiClient, type ApiResponse } from "@/lib/api-client"

export interface ActivoFijo {
  id: number
  descripcion: string
  departamentoId: number | null
  departamentoNombre: string
  tipoActivoId: number
  tipoActivoNombre: string
  fechaAdquisicion: string
  valor: number
  depreciacionAcumulada: number
  estado: number
  valorNeto: number
}

export interface CreateActivoFijo {
  descripcion: string
  departamentoId: number | null
  tipoActivoId: number
  fechaAdquisicion: string
  valor: number
  estado: number
}

export interface UpdateActivoFijo {
  descripcion?: string
  departamentoId?: number | null
  tipoActivoId?: number
  fechaAdquisicion?: string
  valor?: number
  depreciacionAcumulada?: number
  estado?: number
}

export interface ActivoFijoStats {
  total: number
  activos: number
  inactivos: number
  valorTotal: number
  depreciacionTotal: number
  valorNeto: number
}

export async function getActivosFijos(): Promise<ApiResponse<ActivoFijo[]>> {
  try {
    const result = await apiClient.get<ActivoFijo[]>("/activosfijos")
    return result
  } catch (error) {
    console.error("Error fetching activos fijos:", error)
    return { success: false, error: "Error al obtener activos fijos" }
  }
}

export async function getActivoFijoById(id: number): Promise<ApiResponse<ActivoFijo>> {
  try {
    const result = await apiClient.get<ActivoFijo>(`/activosfijos/${id}`)
    return result
  } catch (error) {
    console.error("Error fetching activo fijo:", error)
    return { success: false, error: "Error al obtener activo fijo" }
  }
}

export async function createActivoFijo(formData: FormData): Promise<ApiResponse<ActivoFijo>> {
  try {
    const departamentoIdStr = formData.get("departamentoId") as string
    const departamentoId = departamentoIdStr && departamentoIdStr !== "0" ? Number.parseInt(departamentoIdStr) : null

    const createData: CreateActivoFijo = {
      descripcion: formData.get("descripcion") as string,
      departamentoId: departamentoId,
      tipoActivoId: Number.parseInt(formData.get("tipoActivoId") as string),
      fechaAdquisicion: formData.get("fechaAdquisicion") as string,
      valor: Number.parseFloat(formData.get("valor") as string),
      estado: Number.parseInt(formData.get("estado") as string) || 1,
    }

    if (!createData.descripcion || !createData.tipoActivoId || !createData.fechaAdquisicion || !createData.valor) {
      return { success: false, error: "Todos los campos obligatorios deben ser completados" }
    }

    const result = await apiClient.post<ActivoFijo>("/activosfijos", createData)

    if (result.success) {
      revalidatePath("/activos-fijos")
    }

    return result
  } catch (error) {
    console.error("Error creating activo fijo:", error)
    return { success: false, error: "Error al crear activo fijo" }
  }
}

export async function updateActivoFijo(id: number, formData: FormData): Promise<ApiResponse<ActivoFijo>> {
  try {
    const departamentoIdStr = formData.get("departamentoId") as string
    const departamentoId = departamentoIdStr && departamentoIdStr !== "0" ? Number.parseInt(departamentoIdStr) : null

    const updateData: UpdateActivoFijo = {
      descripcion: formData.get("descripcion") as string,
      departamentoId: departamentoId,
      tipoActivoId: Number.parseInt(formData.get("tipoActivoId") as string),
      fechaAdquisicion: formData.get("fechaAdquisicion") as string,
      valor: Number.parseFloat(formData.get("valor") as string),
      depreciacionAcumulada: Number.parseFloat(formData.get("depreciacionAcumulada") as string) || 0,
      estado: Number.parseInt(formData.get("estado") as string) || 1,
    }

    const result = await apiClient.put<ActivoFijo>(`/activosfijos/${id}`, updateData)

    if (result.success) {
      revalidatePath("/activos-fijos")
    }

    return result
  } catch (error) {
    console.error("Error updating activo fijo:", error)
    return { success: false, error: "Error al actualizar activo fijo" }
  }
}

export async function deleteActivoFijo(id: number): Promise<ApiResponse<any>> {
  try {
    const result = await apiClient.delete(`/activosfijos/${id}`)

    if (result.success) {
      revalidatePath("/activos-fijos")
    }

    return result
  } catch (error) {
    console.error("Error deleting activo fijo:", error)
    return { success: false, error: "Error al eliminar activo fijo" }
  }
}

export async function searchActivosFijos(searchTerm: string): Promise<ApiResponse<ActivoFijo[]>> {
  try {
    const result = await apiClient.get<ActivoFijo[]>(`/activosfijos/search?term=${encodeURIComponent(searchTerm)}`)
    return result
  } catch (error) {
    console.error("Error searching activos fijos:", error)
    return { success: false, error: "Error al buscar activos fijos" }
  }
}

export async function getActivosFijosStats(): Promise<ApiResponse<ActivoFijoStats>> {
  try {
    const result = await apiClient.get<ActivoFijoStats>("/activosfijos/stats")
    return result
  } catch (error) {
    console.error("Error fetching activos fijos stats:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}
