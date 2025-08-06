"use server"

import {
  apiClient,
  type DepreciacionDto,
  type DepreciacioinStatsDto,
  type DepreciacionAcumuladaStatsDto,
  type ActivoFijoDto,
  type TipoActivoDto,
} from "@/lib/api-client"


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

export async function getDepreciacionById(id: number) {
  try {
    const result = await apiClient.get<DepreciacionDto>(`/depreciaciones/${id}`)
    return result
  } catch (error) {
    console.error("Error fetching depreciacion:", error)
    return { success: false, error: "Error al obtener depreciacion" }
  }
}

export async function getTiposActivos() {
  try {
    const result = await apiClient.get<TipoActivoDto[]>("/tiposactivos")
    return result
  } catch (error) {
    console.error("Error fetching tipos de activos:", error)
    return { success: false, error: "Error al obtener tipos de activos" }
  }
}

export async function getActivosFijos() {
  try {
    const result = await apiClient.get<ActivoFijoDto[]>("/activosfijos")
    return result
  } catch (error) {
    console.error("Error fetching activos fijos:", error)
    return { success: false, error: "Error al obtener activos fijos" }
  }
}

export async function getDepreciacionesStats() {
  try {
    const result = await apiClient.get<DepreciacioinStatsDto>("/depreciaciones/stats")
    return result
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}
export async function getDepreciacionAcumuladaStatsDto() {
  try {
    const result = await apiClient.get<DepreciacionAcumuladaStatsDto>("/depreciacionesacumladas/stats")
    return result
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}




