"use server"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5001/api"

export interface DetalleAsiento {
  cuentaId: number
  tipoMovimiento: "DB" | "CR"
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
    descripcion: string;
    cuenta_Id: number;
    auxiliar_Id: number; // fijo 8
    tipoMovimiento: "DB" | "CR";
    fechaAsiento: string; // "YYYY-MM-DD"
    montoAsiento: number;
  }
  

export interface UpdateEntradaContableDto {
  descripcion: string;
    cuenta_Id: number;
    auxiliar_Id: number; 
    tipoMovimiento: string;
    fechaAsiento: string; 
    montoAsiento: number;
}

export interface EntradaContableStats {
  total: number
  montoTotal: number
  porFecha: Array<{
    fecha: string
    cantidad: number
  }>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

async function callLocalAPI<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    console.log(`🌐 Local API Call: ${url}`)

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    console.log(`📡 Local API Response: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Local API Error: ${errorText}`)
      return {
        success: false,
        error: `Error ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    console.log(`✅ Local API Success:`, data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("🔥 Local API Request Failed:", error)
    return {
      success: false,
      error: "Error de conexión con la API local",
    }
  }
}

export async function checkApiHealth(): Promise<ApiResponse<any>> {
  console.log("🔍 Checking API health...")
  return await callLocalAPI("/EntradasContables/health")
}

export async function getEntradasContables(filters?: EntradaContableFilters): Promise<ApiResponse<EntradaContable[]>> {
  console.log("🔍 Getting entradas contables from local API...")

  let endpoint = "/EntradasContables"
  const params = new URLSearchParams()

  if (filters?.fechaInicio) params.append("fechaInicio", filters.fechaInicio)
  if (filters?.fechaFin) params.append("fechaFin", filters.fechaFin)
  if (filters?.cuentaId) params.append("cuentaId", filters.cuentaId.toString())

  if (params.toString()) {
    endpoint = `${endpoint}?${params.toString()}`
  }

  const result = await callLocalAPI<EntradaContable[]>(endpoint)

  if (result.success && result.data) {
    console.log(`✅ Retrieved ${result.data.length} entradas contables from local API`)
  }

  return result
}

export async function createEntradaContable(entrada: CreateEntradaContableDto): Promise<ApiResponse<void>> {
  console.log("📝 Creating entrada contable in local API...")

  const entradaConSistema = {
    ...entrada,
    sistemaAuxiliarId: 1, // ID por defecto para el sistema
  }

  const result = await callLocalAPI<void>("/EntradasContables", {
    method: "POST",
    body: JSON.stringify(entradaConSistema),
  })

  if (result.success) {
    console.log("✅ Entrada contable created in local API")
  }

  return result
}

export async function updateEntradaContable(id: number, entrada: UpdateEntradaContableDto): Promise<ApiResponse<void>> {
  console.log(`📝 Updating entrada contable ${id} in local API...`)

  const entradaConSistema = {
    ...entrada,
    sistemaAuxiliarId: 1, // ID por defecto para el sistema
  }

  const result = await callLocalAPI<void>(`/EntradasContables/${id}`, {
    method: "PUT",
    body: JSON.stringify(entradaConSistema),
  })

  if (result.success) {
    console.log(`✅ Entrada contable ${id} updated in local API`)
  }

  return result
}

export async function deleteEntradaContable(id: number): Promise<ApiResponse<void>> {
  console.log(`🗑️ Deleting entrada contable ${id} from local API...`)

  const result = await callLocalAPI<void>(`/EntradasContables/${id}`, {
    method: "DELETE",
  })

  if (result.success) {
    console.log(`✅ Entrada contable ${id} deleted from local API`)
  }

  return result
}

export async function contabilizarEntradas(entradaIds: number[]): Promise<ApiResponse<void>> {
  console.log(`📊 Contabilizando ${entradaIds.length} entradas in local API...`)

  const result = await callLocalAPI<void>("/EntradasContables/contabilizar", {
    method: "POST",
    body: JSON.stringify(entradaIds),
  })

  if (result.success) {
    console.log(`✅ ${entradaIds.length} entradas contabilizadas in local API`)
  }

  return result
}

export async function getEntradasContablesStats(
  filters?: EntradaContableFilters,
): Promise<ApiResponse<EntradaContableStats>> {
  console.log("📊 Getting entradas contables stats from local API...")
  return await callLocalAPI<EntradaContableStats>(
    `/EntradasContables/stats?${new URLSearchParams(filters as any).toString()}`,
  )
}
