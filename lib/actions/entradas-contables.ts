"use server"

import { apiClient, type ApiResponse } from "@/lib/api-client"

export interface DetalleAsiento {
  cuentaId: number
  tipoMovimiento: string
  montoAsiento: number
}

export interface EntradaContable {
  id?: number
  descripcion: string
  sistemaAuxiliarId: number
  fechaAsiento: string
  detalles: DetalleAsiento[]
}

export interface EntradaContableFilters {
  fechaInicio?: string
  fechaFin?: string
  cuentaId?: number
}

export interface CreateEntradaContableDto {
  descripcion: string
  fechaAsiento: string
  detalles: DetalleAsiento[]
}

export interface UpdateEntradaContableDto {
  descripcion: string
  fechaAsiento: string
  detalles: DetalleAsiento[]
}

export interface EntradaContableStats {
  total: number
  montoTotal: number
  porFecha: Array<{
    fecha: string
    cantidad: number
  }>
}

export async function getEntradasContables(filters?: EntradaContableFilters): Promise<ApiResponse<EntradaContable[]>> {
  try {
    console.log("🔍 Getting entradas contables...")

    let endpoint = "/entradas-contables"
    const params = new URLSearchParams()

    if (filters?.fechaInicio) {
      params.append("fechaInicio", filters.fechaInicio)
    }
    if (filters?.fechaFin) {
      params.append("fechaFin", filters.fechaFin)
    }
    if (filters?.cuentaId) {
      params.append("cuentaId", filters.cuentaId.toString())
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    const result = await apiClient.get<EntradaContable[]>(endpoint)

    if (result.success && result.data) {
      console.log(`✅ Retrieved ${result.data.length} entradas contables`)
      return {
        success: true,
        data: result.data,
      }
    }

    return {
      success: false,
      error: result.error || "Error al obtener las entradas contables",
    }
  } catch (error) {
    console.error("❌ Error getting entradas contables:", error)
    return {
      success: false,
      error: "Error de conexión",
    }
  }
}

export async function getEntradaContableById(id: number): Promise<ApiResponse<EntradaContable>> {
  try {
    console.log(`🔍 Getting entrada contable ${id}...`)

    const result = await apiClient.get<EntradaContable>(`/entradas-contables/${id}`)

    if (result.success && result.data) {
      console.log(`✅ Retrieved entrada contable ${id}`)
      return {
        success: true,
        data: result.data,
      }
    }

    return {
      success: false,
      error: result.error || "Entrada contable no encontrada",
    }
  } catch (error) {
    console.error(`❌ Error getting entrada contable ${id}:`, error)
    return {
      success: false,
      error: "Error de conexión",
    }
  }
}

export async function createEntradaContable(entrada: CreateEntradaContableDto): Promise<ApiResponse<void>> {
  try {
    console.log("📝 Creating entrada contable...")

    const result = await apiClient.post<void>("/entradas-contables", entrada)

    if (result.success) {
      console.log("✅ Entrada contable created successfully")
      return {
        success: true,
      }
    }

    return {
      success: false,
      error: result.error || "Error al crear la entrada contable",
    }
  } catch (error) {
    console.error("❌ Error creating entrada contable:", error)
    return {
      success: false,
      error: "Error de conexión",
    }
  }
}

export async function updateEntradaContable(id: number, entrada: UpdateEntradaContableDto): Promise<ApiResponse<void>> {
  try {
    console.log(`📝 Updating entrada contable ${id}...`)

    const result = await apiClient.put<void>(`/entradas-contables/${id}`, entrada)

    if (result.success) {
      console.log(`✅ Entrada contable ${id} updated successfully`)
      return {
        success: true,
      }
    }

    return {
      success: false,
      error: result.error || "Error al actualizar la entrada contable",
    }
  } catch (error) {
    console.error(`❌ Error updating entrada contable ${id}:`, error)
    return {
      success: false,
      error: "Error de conexión",
    }
  }
}

export async function deleteEntradaContable(id: number): Promise<ApiResponse<void>> {
  try {
    console.log(`🗑️ Deleting entrada contable ${id}...`)

    const result = await apiClient.delete<void>(`/entradas-contables/${id}`)

    if (result.success) {
      console.log(`✅ Entrada contable ${id} deleted successfully`)
      return {
        success: true,
      }
    }

    return {
      success: false,
      error: result.error || "Error al eliminar la entrada contable",
    }
  } catch (error) {
    console.error(`❌ Error deleting entrada contable ${id}:`, error)
    return {
      success: false,
      error: "Error de conexión",
    }
  }
}

export async function contabilizarEntradas(entradaIds: number[]): Promise<ApiResponse<void>> {
  try {
    console.log(`📊 Contabilizando ${entradaIds.length} entradas...`)

    const result = await apiClient.post<void>("/entradas-contables/contabilizar", entradaIds)

    if (result.success) {
      console.log(`✅ ${entradaIds.length} entradas contabilizadas successfully`)
      return {
        success: true,
      }
    }

    return {
      success: false,
      error: result.error || "Error al contabilizar las entradas",
    }
  } catch (error) {
    console.error("❌ Error contabilizando entradas:", error)
    return {
      success: false,
      error: "Error de conexión",
    }
  }
}

export async function getEntradasContablesStats(
  filters?: EntradaContableFilters,
): Promise<ApiResponse<EntradaContableStats>> {
  try {
    console.log("📊 Getting entradas contables stats...")

    let endpoint = "/entradas-contables/stats"
    const params = new URLSearchParams()

    if (filters?.fechaInicio) {
      params.append("fechaInicio", filters.fechaInicio)
    }
    if (filters?.fechaFin) {
      params.append("fechaFin", filters.fechaFin)
    }
    if (filters?.cuentaId) {
      params.append("cuentaId", filters.cuentaId.toString())
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    const result = await apiClient.get<EntradaContableStats>(endpoint)

    if (result.success && result.data) {
      console.log("✅ Retrieved entradas contables stats")
      return {
        success: true,
        data: result.data,
      }
    }

    return {
      success: false,
      error: result.error || "Error al obtener las estadísticas",
    }
  } catch (error) {
    console.error("❌ Error getting entradas contables stats:", error)
    return {
      success: false,
      error: "Error de conexión",
    }
  }
}
