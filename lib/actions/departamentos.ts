"use server"

import { revalidatePath } from "next/cache"
import { apiClient, type ApiResponse } from "@/lib/api-client"

export interface Departamento {
  id: number
  descripcion: string
  activo: boolean
}

export interface CreateDepartamentoDto {
  descripcion: string
}

export interface UpdateDepartamentoDto {
  descripcion: string
  activo: boolean
}

export async function getDepartamentos(): Promise<ApiResponse<Departamento[]>> {
  try {
    console.log("🔍 Getting departamentos from API...")
    const result = await apiClient.get<Departamento[]>("/departamentos")
    console.log("📊 Departamentos result:", result)

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      }
    }

    return {
      success: false,
      error: result.error || "Error al cargar departamentos",
    }
  } catch (error) {
    console.error("❌ Error fetching departamentos:", error)
    return {
      success: false,
      error: "Error de conexión al cargar departamentos",
    }
  }
}

export async function getDepartamentoById(id: number): Promise<ApiResponse<Departamento>> {
  try {
    console.log(`🔍 Getting departamento ${id} from API...`)
    const result = await apiClient.get<Departamento>(`/departamentos/${id}`)
    console.log("📊 Departamento result:", result)

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      }
    }

    return {
      success: false,
      error: result.error || "Error al cargar departamento",
    }
  } catch (error) {
    console.error("❌ Error fetching departamento:", error)
    return {
      success: false,
      error: "Error de conexión al cargar departamento",
    }
  }
}

export async function createDepartamento(formData: FormData): Promise<ApiResponse<Departamento>> {
  try {
    const descripcion = formData.get("descripcion") as string
    console.log(`➕ Creating departamento: "${descripcion}"`)

    if (!descripcion || descripcion.trim().length === 0) {
      return { success: false, error: "La descripción es obligatoria" }
    }

    const createDto: CreateDepartamentoDto = {
      descripcion: descripcion.trim(),
    }

    const result = await apiClient.post<Departamento>("/departamentos", createDto)
    console.log("✅ Create departamento result:", result)

    if (result.success) {
      revalidatePath("/departamentos")
      return {
        success: true,
        data: result.data,
        error: "Departamento creado exitosamente",
      }
    }

    return result
  } catch (error) {
    console.error("❌ Error creating departamento:", error)
    return { success: false, error: "Error al crear departamento" }
  }
}

export async function updateDepartamento(id: number, formData: FormData): Promise<ApiResponse<Departamento>> {
  try {
    const descripcion = formData.get("descripcion") as string
    const activo = formData.get("activo") === "true"

    console.log(`✏️ Updating departamento ${id}:`, { descripcion, activo })

    if (!descripcion || descripcion.trim().length === 0) {
      return { success: false, error: "La descripción es obligatoria" }
    }

    const updateDto: UpdateDepartamentoDto = {
      descripcion: descripcion.trim(),
      activo: activo,
    }

    const result = await apiClient.put<Departamento>(`/departamentos/${id}`, updateDto)
    console.log("✅ Update departamento result:", result)

    if (result.success) {
      revalidatePath("/departamentos")
      return {
        success: true,
        data: result.data,
        error: "Departamento actualizado exitosamente",
      }
    }

    return result
  } catch (error) {
    console.error("❌ Error updating departamento:", error)
    return { success: false, error: "Error al actualizar departamento" }
  }
}

export async function deleteDepartamento(id: number): Promise<ApiResponse<void>> {
  try {
    console.log(`🗑️ Deleting departamento ${id}`)
    const result = await apiClient.delete(`/departamentos/${id}`)
    console.log("✅ Delete departamento result:", result)

    if (result.success) {
      revalidatePath("/departamentos")
      return { success: true, error: "Departamento eliminado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("❌ Error deleting departamento:", error)
    return { success: false, error: "Error al eliminar departamento" }
  }
}
