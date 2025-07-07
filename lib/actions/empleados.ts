"use server"

import { revalidatePath } from "next/cache"
import {
  apiClient,
  type EmpleadoDto,
  type CreateEmpleadoDto,
  type UpdateEmpleadoDto,
  type DepartamentoDto,
  type EmpleadoStatsDto,
} from "@/lib/api-client"

export async function getEmpleados(search?: string, departamentoId?: number) {
  try {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (departamentoId) params.append("departamentoId", departamentoId.toString())

    const queryString = params.toString()
    const endpoint = `/empleados${queryString ? `?${queryString}` : ""}`

    const result = await apiClient.get<EmpleadoDto[]>(endpoint)
    return result
  } catch (error) {
    console.error("Error fetching empleados:", error)
    return { success: false, error: "Error al obtener empleados" }
  }
}

export async function getEmpleadoById(id: number) {
  try {
    const result = await apiClient.get<EmpleadoDto>(`/empleados/${id}`)
    return result
  } catch (error) {
    console.error("Error fetching empleado:", error)
    return { success: false, error: "Error al obtener empleado" }
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

export async function createEmpleado(formData: FormData) {
  try {
    const createDto: CreateEmpleadoDto = {
      nombre: formData.get("nombre") as string,
      cedula: formData.get("cedula") as string,
      departamentoId: Number.parseInt(formData.get("departamento_id") as string),
      tipoPersona: Number.parseInt(formData.get("tipo_persona") as string),
      fechaIngreso: formData.get("fecha_ingreso") as string,
    }

    // Validaciones
    if (
      !createDto.nombre ||
      !createDto.cedula ||
      !createDto.departamentoId ||
      !createDto.tipoPersona ||
      !createDto.fechaIngreso
    ) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.post<EmpleadoDto>("/empleados", createDto)

    if (result.success) {
      revalidatePath("/empleados")
      return { success: true, message: "Empleado creado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error creating empleado:", error)
    return { success: false, error: "Error al crear empleado" }
  }
}

export async function updateEmpleado(id: number, formData: FormData) {
  try {
    const updateDto: UpdateEmpleadoDto = {
      nombre: formData.get("nombre") as string,
      cedula: formData.get("cedula") as string,
      departamentoId: Number.parseInt(formData.get("departamento_id") as string),
      tipoPersona: Number.parseInt(formData.get("tipo_persona") as string),
      fechaIngreso: formData.get("fecha_ingreso") as string,
    }

    // Validaciones
    if (
      !updateDto.nombre ||
      !updateDto.cedula ||
      !updateDto.departamentoId ||
      !updateDto.tipoPersona ||
      !updateDto.fechaIngreso
    ) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.put<EmpleadoDto>(`/empleados/${id}`, updateDto)

    if (result.success) {
      revalidatePath("/empleados")
      return { success: true, message: "Empleado actualizado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error updating empleado:", error)
    return { success: false, error: "Error al actualizar empleado" }
  }
}

export async function deleteEmpleado(id: number) {
  try {
    const result = await apiClient.delete(`/empleados/${id}`)

    if (result.success) {
      revalidatePath("/empleados")
      return { success: true, message: "Empleado eliminado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error deleting empleado:", error)
    return { success: false, error: "Error al eliminar empleado" }
  }
}

export async function getEmpleadosStats() {
  try {
    const result = await apiClient.get<EmpleadoStatsDto>("/empleados/stats")
    return result
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}
