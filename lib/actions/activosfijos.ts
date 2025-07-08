"use server"

import { revalidatePath } from "next/cache"
import {
  apiClient,
  type ActivoFijoDto,
  type CreateActivoFijoDto,
  type UpdateActivoFijoDto,
  type DepartamentoDto,
  type ActivoFijoStatsDto,
  type TipoActivoDto,
} from "@/lib/api-client"


export async function getActivosFijos(search?: string, departamentoId?: number) {
  try {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (departamentoId) params.append("departamentoId", departamentoId.toString())

    const queryString = params.toString()
    const endpoint = `/activos-fijos${queryString ? `?${queryString}` : ""}`

    const result = await apiClient.get<ActivoFijoDto[]>(endpoint)
    return result
  } catch (error) {
    console.error("Error fetching activos fijos:", error)
    return { success: false, error: "Error al obtener activos fijos" }
  }
}
export async function getTiposActivos() {
  try {
    const result = await apiClient.get<TipoActivoDto[]>("/tipos-activos")
    return result
  } catch (error) {
    console.error("Error fetching tipos de activos:", error)
    return { success: false, error: "Error al obtener tipos de activos" }
  }
}

export async function getActivoFijoById(id: number) {
  try {
    const result = await apiClient.get<ActivoFijoDto>(`/activos-fijos/${id}`)
    return result
  } catch (error) {
    console.error("Error fetching activo fijo:", error)
    return { success: false, error: "Error al obtener activo fijo" }
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

export async function createActivoFijo(formData: FormData) {
  try {
    const createDto: CreateActivoFijoDto = {
      descripcion: formData.get("descripcion") as string,
      departamentoId: formData.get("departamento_id") ? Number.parseInt(formData.get("departamento_id") as string) : undefined,
      tipoActivoId: Number.parseInt(formData.get("tipo_activo_id") as string),
      fechaAdquisicion: formData.get("fecha_adquisicion") as string,
      valor: Number.parseFloat(formData.get("valor") as string),
    }

    if (
      !createDto.descripcion ||
      createDto.tipoActivoId <= 0 ||
      !createDto.fechaAdquisicion ||
      isNaN(createDto.valor)
    ) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.post<ActivoFijoDto>("/activos-fijos", createDto)

    if (result.success) {
      revalidatePath("/activos-fijos")
      return { success: true, message: "Activo fijo creado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error creating activo fijo:", error)
    return { success: false, error: "Error al crear activo fijo" }
  }
}

export async function updateActivoFijo(id: number, formData: FormData) {
  try {
    const updateDto: UpdateActivoFijoDto = {
      descripcion: formData.get("descripcion") as string,
      departamentoId: formData.get("departamento_id") ? Number.parseInt(formData.get("departamento_id") as string) : undefined,
      tipoActivoId: Number.parseInt(formData.get("tipo_activo_id") as string),
      fechaAdquisicion: formData.get("fecha_adquisicion") as string,
      valor: Number.parseFloat(formData.get("valor") as string),
      estado: Number.parseInt(formData.get("estado") as string),
    }

    if (
      !updateDto.descripcion ||
      updateDto.tipoActivoId <= 0 ||
      !updateDto.fechaAdquisicion ||
      isNaN(updateDto.valor) ||
      isNaN(updateDto.estado)
    ) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.put<ActivoFijoDto>(`/activos-fijos/${id}`, updateDto)

    if (result.success) {
      revalidatePath("/activos-fijos")
      return { success: true, message: "Activo fijo actualizado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error updating activo fijo:", error)
    return { success: false, error: "Error al actualizar activo fijo" }
  }
}

export async function deleteActivoFijo(id: number) {
  try {
    const result = await apiClient.delete(`/activos-fijos/${id}`)

    if (result.success) {
      revalidatePath("/activos-fijos")
      return { success: true, message: "Activo fijo eliminado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error deleting activo fijo:", error)
    return { success: false, error: "Error al eliminar activo fijo" }
  }
}

export async function getActivosFijosStats() {
  try {
    const result = await apiClient.get<ActivoFijoStatsDto>("/activos-fijos/stats")
    return result
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}
