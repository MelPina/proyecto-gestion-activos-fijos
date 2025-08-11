"use server"

import {
  apiClient,
  type DepreciacionDto,
  type DepreciacionStatsDto,
  type ActivoFijoDto,
  type TipoActivoDto,
} from "@/lib/api-client"

// Obtener depreciaciones filtradas
export async function getDepreciaciones(search?: string, anio?: number, mes?: number, tipoActivoId?: number, activoFijoId?: number) {
  if (!anio) {
    return { success: false, error: "El año es obligatorio para filtrar depreciaciones" }
  }

  try {
    const params = new URLSearchParams()
    params.append("anio", anio.toString())
    if (search) params.append("search", search)
    if (mes) params.append("mes", mes.toString())
    if (tipoActivoId) params.append("tipoActivoId", tipoActivoId.toString())
    if (activoFijoId) params.append("activoFijoId", activoFijoId.toString())

    const queryString = params.toString()
    const endpoint = `/depreciaciones${queryString ? `?${queryString}` : ""}`
    const result = await apiClient.get<DepreciacionDto[]>(endpoint)
    return result
  } catch (error) {
    console.error("Error al obtener depreciaciones:", error)
    return { success: false, error: "No se pudo cargar el detalle de depreciación" }
  }
}

// Obtener depreciación por ID
export async function getDepreciacionById(id: number) {
  try {
    const result = await apiClient.get<DepreciacionDto>(`/depreciaciones/${id}`)
    return result
  } catch (error) {
    console.error("Error fetching depreciacion:", error)
    return { success: false, error: "Error al obtener depreciacion" }
  }
}

// Obtener tipos de activos
export async function getTiposActivos() {
  try {
    const result = await apiClient.get<TipoActivoDto[]>("/tiposactivos")
    return result
  } catch (error) {
    console.error("Error fetching tipos de activos:", error)
    return { success: false, error: "Error al obtener tipos de activos" }
  }
}

// Obtener activos fijos
export async function getActivosFijos() {
  try {
    const result = await apiClient.get<ActivoFijoDto[]>("/activosfijos")
    return result
  } catch (error) {
    console.error("Error fetching activos fijos:", error)
    return { success: false, error: "Error al obtener activos fijos" }
  }
}

// Obtener estadísticas de depreciaciones
export async function getDepreciacionesStats() {
  try {
    const result = await apiClient.get<DepreciacionStatsDto>("/depreciaciones/stats")
    return result
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}

// 🔹 Obtener asientos de depreciación
export async function getAsientosDepreciacion(anio: number, mes?: number) {
  try {
    const params = new URLSearchParams()
    params.append("anio", anio.toString())
    if (mes) params.append("mes", mes.toString())

    const queryString = params.toString()
    const endpoint = `/asientosdepreciacion${queryString ? `?${queryString}` : ""}`
    const result = await apiClient.get<any[]>(endpoint)
    return result
  } catch (error) {
    console.error("Error fetching asientos de depreciación:", error)
    return { success: false, error: "Error al obtener asientos de depreciación" }
  }
}

// 🔹 Obtener meses de proceso disponibles
export async function getMesesProceso() {
  try {
    const response = await apiClient.get<{ id: number; descripcion: string }[]>("/depreciaciones/meses")
    return response.data
  } catch (error) {
    console.error("Error obteniendo meses:", error)
    return []
  }
}
