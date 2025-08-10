"use server"

import { revalidatePath } from "next/cache"
import { apiClient, type TipoActivoDto, type CreateTipoActivoDto, type UpdateTipoActivoDto } from "@/lib/api-client"

export async function getTiposActivos() {
  try {
    const result = await apiClient.get<TipoActivoDto[]>("/tiposactivos")
    return result
  } catch (error) {
    console.error("Error fetching tipos activos:", error)
    return { success: false, error: "Error al obtener tipos de activos" }
  }
}

export async function getTipoActivoById(id: number) {
  try {
    const result = await apiClient.get<TipoActivoDto>(`/tiposactivos/${id}`)
    return result
  } catch (error) {
    console.error("Error fetching tipo activo:", error)
    return { success: false, error: "Error al obtener tipo de activo" }
  }
}

export async function createTipoActivo(formData: FormData) {
  try {
    const createDto: CreateTipoActivoDto = {
      descripcion: formData.get("descripcion") as string,
      cuentaContableCompra: formData.get("cuenta_contable_compra") as string,
      cuentaContableDepreciacion: formData.get("cuenta_contable_depreciacion") as string,
    }

    if (!createDto.descripcion || !createDto.cuentaContableCompra || !createDto.cuentaContableDepreciacion) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.post<TipoActivoDto>("/tiposactivos", createDto)

    if (result.success) {
      revalidatePath("/tipos-activos")
      return { success: true, message: "Tipo de activo creado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error creating tipo activo:", error)
    return { success: false, error: "Error al crear tipo de activo" }
  }
}

export async function updateTipoActivo(id: number, formData: FormData) {
  try {
    const updateDto: UpdateTipoActivoDto = {
      descripcion: formData.get("descripcion") as string,
      cuentaContableCompra: formData.get("cuenta_contable_compra") as string,
      cuentaContableDepreciacion: formData.get("cuenta_contable_depreciacion") as string,
      activo: formData.get("activo") === "true",
    }

    if (!updateDto.descripcion || !updateDto.cuentaContableCompra || !updateDto.cuentaContableDepreciacion) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.put<TipoActivoDto>(`/tiposactivos/${id}`, updateDto)

    if (result.success) {
      revalidatePath("/tipos-activos")
      return { success: true, message: "Tipo de activo actualizado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error updating tipo activo:", error)
    return { success: false, error: "Error al actualizar tipo de activo" }
  }
}

export async function deleteTipoActivo(id: number) {
  try {
    const result = await apiClient.delete(`/tiposactivos/${id}`)

    if (result.success) {
      revalidatePath("/tipos-activos")
      return { success: true, message: "Tipo de activo eliminado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error deleting tipo activo:", error)
    return { success: false, error: "Error al eliminar tipo de activo" }
  }
}
