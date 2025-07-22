"use server"

import { revalidatePath } from "next/cache"
import { apiClient } from "@/lib/api-client"

export interface TipoActivo {
  id: number
  descripcion: string
  cuentaContableCompra: string
  cuentaContableDepreciacion: string
  activo: boolean
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

export async function getTiposActivos() {
  try {
    console.log("🔍 Getting tipos activos from API...")
    const result = await apiClient.get<TipoActivo[]>("/tiposactivos")
    console.log("📊 Tipos activos result:", result)

    if (result.success && result.data) {
      return result.data
    }

    return []
  } catch (error) {
    console.error("❌ Error fetching tipos activos:", error)
    return []
  }
}

export async function getTipoActivoById(id: number) {
  try {
    console.log(`🔍 Getting tipo activo ${id} from API...`)
    const result = await apiClient.get<TipoActivo>(`/tiposactivos/${id}`)
    console.log("📊 Tipo activo result:", result)

    if (result.success && result.data) {
      return result.data
    }

    return null
  } catch (error) {
    console.error("❌ Error fetching tipo activo:", error)
    return null
  }
}

export async function createTipoActivo(formData: FormData) {
  try {
    const descripcion = formData.get("descripcion") as string
    const cuentaContableCompra = formData.get("cuentaContableCompra") as string
    const cuentaContableDepreciacion = formData.get("cuentaContableDepreciacion") as string

    console.log(`➕ Creating tipo activo: "${descripcion}"`)

    if (!descripcion || descripcion.trim().length === 0) {
      return { success: false, error: "La descripción es obligatoria" }
    }

    if (!cuentaContableCompra || cuentaContableCompra.trim().length === 0) {
      return { success: false, error: "La cuenta contable de compra es obligatoria" }
    }

    if (!cuentaContableDepreciacion || cuentaContableDepreciacion.trim().length === 0) {
      return { success: false, error: "La cuenta contable de depreciación es obligatoria" }
    }

    const createDto: CreateTipoActivoDto = {
      descripcion: descripcion.trim(),
      cuentaContableCompra: cuentaContableCompra.trim(),
      cuentaContableDepreciacion: cuentaContableDepreciacion.trim(),
    }

    const result = await apiClient.post<TipoActivo>("/tiposactivos", createDto)
    console.log("✅ Create tipo activo result:", result)

    if (result.success) {
      revalidatePath("/tipos-activos")
      return { success: true, message: "Tipo de activo creado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("❌ Error creating tipo activo:", error)
    return { success: false, error: "Error al crear tipo de activo" }
  }
}

export async function updateTipoActivo(id: number, formData: FormData) {
  try {
    const descripcion = formData.get("descripcion") as string
    const cuentaContableCompra = formData.get("cuentaContableCompra") as string
    const cuentaContableDepreciacion = formData.get("cuentaContableDepreciacion") as string
    const activo = formData.get("activo") === "true"

    console.log(`✏️ Updating tipo activo ${id}:`, {
      descripcion,
      cuentaContableCompra,
      cuentaContableDepreciacion,
      activo,
    })

    if (!descripcion || descripcion.trim().length === 0) {
      return { success: false, error: "La descripción es obligatoria" }
    }

    if (!cuentaContableCompra || cuentaContableCompra.trim().length === 0) {
      return { success: false, error: "La cuenta contable de compra es obligatoria" }
    }

    if (!cuentaContableDepreciacion || cuentaContableDepreciacion.trim().length === 0) {
      return { success: false, error: "La cuenta contable de depreciación es obligatoria" }
    }

    const updateDto: UpdateTipoActivoDto = {
      descripcion: descripcion.trim(),
      cuentaContableCompra: cuentaContableCompra.trim(),
      cuentaContableDepreciacion: cuentaContableDepreciacion.trim(),
      activo: activo,
    }

    const result = await apiClient.put<TipoActivo>(`/tiposactivos/${id}`, updateDto)
    console.log("✅ Update tipo activo result:", result)

    if (result.success) {
      revalidatePath("/tipos-activos")
      return { success: true, message: "Tipo de activo actualizado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("❌ Error updating tipo activo:", error)
    return { success: false, error: "Error al actualizar tipo de activo" }
  }
}

export async function deleteTipoActivo(id: number) {
  try {
    console.log(`🗑️ Deleting tipo activo ${id}`)
    const result = await apiClient.delete(`/tiposactivos/${id}`)
    console.log("✅ Delete tipo activo result:", result)

    if (result.success) {
      revalidatePath("/tipos-activos")
      return { success: true, message: "Tipo de activo eliminado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("❌ Error deleting tipo activo:", error)
    return { success: false, error: "Error al eliminar tipo de activo" }
  }
}
