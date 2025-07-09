/**
 * Calcula la depreciación de un activo fijo
 */

export interface DepreciacionCalculation {
    depreciacionAnual: number
    depreciacionMensual: number
    depreciacionAcumulada: number
    valorLibros: number
    vidaUtilRestante: number
    porcentajeDepreciado: number
  }
  
  export interface ActivoDepreciacion {
    id: number
    descripcion: string
    fechaAdquisicion: string
    valor: number
    depreciacionAcumulada: number
    tipoActivoId: number
    tipoActivoDescripcion: string
  }
  
  // Tabla de vida útil por tipo de activo (en años)
  export const VIDA_UTIL_POR_TIPO: Record<string, number> = {
    "Equipos de Cómputo": 3,
    Vehículos: 5,
    "Mobiliario de Oficina": 10,
    Herramientas: 5,
    "Equipos de Oficina": 5,
    Inmuebles: 20,
    "Equipos Eléctricos": 10,
    "Equipos de Red": 5,
  }
  
  // Método de depreciación por defecto (línea recta)
  export const METODO_DEPRECIACION = {
    LINEA_RECTA: "linea_recta",
    ACELERADA: "acelerada",
    UNIDADES_PRODUCCION: "unidades_produccion",
  }
  
  /**
   * Calcula la depreciación de un activo usando el método de línea recta
   */
  export function calcularDepreciacionLineaRecta(
    valorAdquisicion: number,
    fechaAdquisicion: string,
    tipoActivoDescripcion: string,
    depreciacionAcumuladaActual = 0,
  ): DepreciacionCalculation {
    const vidaUtilAnios = VIDA_UTIL_POR_TIPO[tipoActivoDescripcion] || 5
    const fechaAdq = new Date(fechaAdquisicion)
    const fechaActual = new Date()
  
    // Calcular meses transcurridos
    const mesesTranscurridos =
      (fechaActual.getFullYear() - fechaAdq.getFullYear()) * 12 + (fechaActual.getMonth() - fechaAdq.getMonth())
  
    // Depreciación anual y mensual
    const depreciacionAnual = valorAdquisicion / vidaUtilAnios
    const depreciacionMensual = depreciacionAnual / 12
  
    // Depreciación acumulada calculada
    const depreciacionAcumuladaCalculada = Math.min(depreciacionMensual * mesesTranscurridos, valorAdquisicion)
  
    // Usar la mayor entre la calculada y la actual en BD
    const depreciacionAcumulada = Math.max(depreciacionAcumuladaCalculada, depreciacionAcumuladaActual)
  
    const valorLibros = Math.max(valorAdquisicion - depreciacionAcumulada, 0)
    const vidaUtilRestante = Math.max(vidaUtilAnios - mesesTranscurridos / 12, 0)
    const porcentajeDepreciado = (depreciacionAcumulada / valorAdquisicion) * 100
  
    return {
      depreciacionAnual,
      depreciacionMensual,
      depreciacionAcumulada,
      valorLibros,
      vidaUtilRestante,
      porcentajeDepreciado,
    }
  }
  
  /**
   * Calcula la depreciación para múltiples activos
   */
  export function calcularDepreciacionMasiva(
    activos: ActivoDepreciacion[],
  ): Array<ActivoDepreciacion & DepreciacionCalculation> {
    return activos.map((activo) => ({
      ...activo,
      ...calcularDepreciacionLineaRecta(
        activo.valor,
        activo.fechaAdquisicion,
        activo.tipoActivoDescripcion,
        activo.depreciacionAcumulada,
      ),
    }))
  }
  
  /**
   * Genera reporte de depreciación por tipo de activo
   */
  export function generarReporteDepreciacionPorTipo(activos: ActivoDepreciacion[]) {
    const reportePorTipo = new Map<
      string,
      {
        cantidad: number
        valorTotal: number
        depreciacionTotal: number
        valorLibrosTotal: number
      }
    >()
  
    activos.forEach((activo) => {
      const calculo = calcularDepreciacionLineaRecta(
        activo.valor,
        activo.fechaAdquisicion,
        activo.tipoActivoDescripcion,
        activo.depreciacionAcumulada,
      )
  
      const tipo = activo.tipoActivoDescripcion
      const actual = reportePorTipo.get(tipo) || {
        cantidad: 0,
        valorTotal: 0,
        depreciacionTotal: 0,
        valorLibrosTotal: 0,
      }
  
      reportePorTipo.set(tipo, {
        cantidad: actual.cantidad + 1,
        valorTotal: actual.valorTotal + activo.valor,
        depreciacionTotal: actual.depreciacionTotal + calculo.depreciacionAcumulada,
        valorLibrosTotal: actual.valorLibrosTotal + calculo.valorLibros,
      })
    })
  
    return Array.from(reportePorTipo.entries()).map(([tipo, datos]) => ({
      tipo,
      ...datos,
      porcentajeDepreciacionPromedio: (datos.depreciacionTotal / datos.valorTotal) * 100,
    }))
  }
  
  /**
   * Formatea valores monetarios
   */
  export function formatearMoneda(valor: number): string {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(valor)
  }
  
  /**
   * Formatea porcentajes
   */
  export function formatearPorcentaje(valor: number): string {
    return `${valor.toFixed(2)}%`
  }
  