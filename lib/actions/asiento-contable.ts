"use server"

import { revalidatePath } from "next/cache"
import {
  apiClient,
  type AsientoContableDto,
  type CreateAsientoContableDto,
  type UpdateAsientoContableDto,
  type AsientoContableStatsDto,
} from "@/lib/api-client"

export async function getAsientosContables(
  anio?: number,
  mes?: number,
  tipoInventarioId?: number
) {
  try {
    const params = new URLSearchParams()
    if (anio) params.append("anio", anio.toString())
    if (mes) params.append("mes", mes.toString())
    if (tipoInventarioId) params.append("tipoInventarioId", tipoInventarioId.toString())

    const queryString = params.toString()
    const endpoint = `/asientos-contables${queryString ? `?${queryString}` : ""}`

    const result = await apiClient.get<AsientoContableDto[]>(endpoint)
    return result
  } catch (error) {
    console.error("Error fetching asientos contables:", error)
    return { success: false, error: "Error al obtener asientos contables" }
  }
}

export async function getAsientoContableById(id: number) {
  try {
    const result = await apiClient.get<AsientoContableDto>(`/asientos-contables/${id}`)
    return result
  } catch (error) {
    console.error("Error fetching asiento contable:", error)
    return { success: false, error: "Error al obtener asiento contable" }
  }
}

export async function createAsientoContable(formData: FormData) {
  try {
    const createDto: CreateAsientoContableDto = {
      tipoMovimiento: formData.get("tipo_movimiento") as string,
      descripcion: formData.get("descripcion") as string,
      fechaAsiento: new Date(formData.get("fecha_asiento") as string),
      tipoInventarioId: Number.parseInt(formData.get("tipo_inventario_id") as string),
      cuentaContable: formData.get("cuenta_contable") as string,
      montoAsiento: Number.parseFloat(formData.get("monto_asiento") as string),
      estado: formData.get("estado") === "true" || formData.get("estado") === "1",
    }

    if (
      !createDto.tipoMovimiento ||
      !createDto.descripcion ||
      !createDto.fechaAsiento ||
      !createDto.tipoInventarioId ||
      !createDto.cuentaContable ||
      !createDto.montoAsiento ||
      createDto.estado === undefined
    ) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.post<AsientoContableDto>("/asientos-contables", createDto)

    if (result.success) {
      revalidatePath("/asientos-contables")
      return { success: true, message: "Asiento contable creado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error creating asiento contable:", error)
    return { success: false, error: "Error al crear asiento contable" }
  }
}

export async function updateAsientoContable(id: number, formData: FormData) {
  try {
    const updateDto: UpdateAsientoContableDto = {
      id,
      tipoMovimiento: formData.get("tipo_movimiento") as string,
      descripcion: formData.get("descripcion") as string,
      fechaAsiento: new Date(formData.get("fecha_asiento") as string),
      tipoInventarioId: Number.parseInt(formData.get("tipo_inventario_id") as string),
      cuentaContable: formData.get("cuenta_contable") as string,
      montoAsiento: Number.parseFloat(formData.get("monto_asiento") as string),
      estado: formData.get("estado") === "true" || formData.get("estado") === "1",
    }

    if (
      !updateDto.tipoMovimiento ||
      !updateDto.descripcion ||
      !updateDto.fechaAsiento ||
      !updateDto.tipoInventarioId ||
      !updateDto.cuentaContable ||
      !updateDto.montoAsiento ||
      updateDto.estado === undefined
    ) {
      return { success: false, error: "Todos los campos son obligatorios" }
    }

    const result = await apiClient.put<AsientoContableDto>(`/asientos-contables/${id}`, updateDto)

    if (result.success) {
      revalidatePath("/asientos-contables")
      return { success: true, message: "Asiento contable actualizado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error updating asiento contable:", error)
    return { success: false, error: "Error al actualizar asiento contable" }
  }
}

export async function deleteAsientoContable(id: number) {
  try {
    const result = await apiClient.delete(`/asientos-contables/${id}`)

    if (result.success) {
      revalidatePath("/asientos-contables")
      return { success: true, message: "Asiento contable eliminado exitosamente" }
    }

    return result
  } catch (error) {
    console.error("Error deleting asiento contable:", error)
    return { success: false, error: "Error al eliminar asiento contable" }
  }
}

export async function getAsientosContablesStats(
  anio?: number,
  mes?: number,
  tipoInventarioId?: number
) {
  try {
    const params = new URLSearchParams()
    if (anio) params.append("anio", anio.toString())
    if (mes) params.append("mes", mes.toString())
    if (tipoInventarioId) params.append("tipoInventarioId", tipoInventarioId.toString())

    const queryString = params.toString()
    const endpoint = `/asientos-contables/stats${queryString ? `?${queryString}` : ""}`

    const result = await apiClient.get<AsientoContableStatsDto>(endpoint)
    return result
  } catch (error) {
    console.error("Error fetching asiento contable stats:", error)
    return { success: false, error: "Error al obtener estadísticas de asientos contables" }
  }
}
