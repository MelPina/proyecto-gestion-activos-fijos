"use server"

import { revalidatePath } from "next/cache"
import { apiClient, type DepartamentoDto } from "@/lib/api-client"

export interface CreateDepartamentoDto {
  descripcion: string
}

export interface UpdateDepartamentoDto {
  descripcion: string
  activo: boolean
}

export async function getDepartamentos() {
  try {
    console.log("Getting departamentos from API...")
    const result = await apiClient.get<DepartamentoDto[]>("/departamentos")
    console.log("Departamentos result:", result)
    return result
  } catch (error) {
    console.error("Error fetching departamentos:", error)
    return { success: false, error: "Error al obtener departamentos" }
  }
}

export async function getDepartamentoById(id: number) {
  try {
    console.log(`Getting departamento ${id} from API...`)
    const result = await apiClient.get<DepartamentoDto>(`/departamentos/${id}`)
    console.log("Departamento result:", result)
    return result
  } catch (error) {
    console.error("Error fetching departamento:", error)
    return { success: false, error: "Error al obtener departamento" }
  }
}

export async function createDepartamento(formData: FormData) {
  try {
    const descripcion = formData.get("descripcion") as string
    console.log(`Creating departamento: "${descripcion}"`)

    if (!descripcion || descripcion.trim().length === 0) {
      return { success: false, error: "La descripción es obligatoria" }
    }

    const createDto: CreateDepartamentoDto = {
      descripcion: descripcion.trim(),
    }

    const result = await apiClient.post<DepartamentoDto>("/departamentos", createDto)
    console.log("Create departamento result:", result)

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
    const descripcion = formData.get("descripcion") as string
    const activo = formData.get("activo") === "true"

    console.log(`Updating departamento ${id}:`, { descripcion, activo })

    if (!descripcion || descripcion.trim().length === 0) {
      return { success: false, error: "La descripción es obligatoria" }
    }

    const updateDto: UpdateDepartamentoDto = {
      descripcion: descripcion.trim(),
      activo: activo,
    }

    const result = await apiClient.put<DepartamentoDto>(`/departamentos/${id}`, updateDto)
    console.log("Update departamento result:", result)

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
  debugger;
  try {
    console.log(`Deleting departamento ${id}`)
    debugger;
    const result = await apiClient.delete(`/departamentos/${id}`)
    console.log("Delete departamento result:", result)

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

