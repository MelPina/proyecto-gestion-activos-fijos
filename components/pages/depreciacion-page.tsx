"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingDown, FileText, RefreshCw, AlertCircle, DollarSign } from "lucide-react"
import { getActivosFijos } from "@/lib/actions/activos-fijos"
import { getTiposActivos } from "@/lib/actions/tipos-activos"
import {
  calcularDepreciacionMasiva,
  generarReporteDepreciacionPorTipo,
  formatearMoneda,
  formatearPorcentaje,
  type ActivoDepreciacion,
} from "@/lib/utils/depreciacion"
import type { ActivoFijoDto, TipoActivoDto } from "@/lib/api-client"

export function DepreciacionPage() {
  const [activosFijos, setActivosFijos] = useState<ActivoFijoDto[]>([])
  const [tiposActivos, setTiposActivos] = useState<TipoActivoDto[]>([])
  const [activosConDepreciacion, setActivosConDepreciacion] = useState<any[]>([])
  const [reportePorTipo, setReportePorTipo] = useState<any[]>([])
  const [filterTipo, setFilterTipo] = useState("0")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (activosFijos.length > 0) {
      calcularDepreciaciones()
    }
  }, [activosFijos, filterTipo])

  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const [activosResult, tiposResult] = await Promise.all([getActivosFijos(), getTiposActivos()])

      if (activosResult.success && activosResult.data) {
        setActivosFijos(activosResult.data)
      } else {
        setError(`Error cargando activos: ${activosResult.error}`)
      }

      if (tiposResult.success && tiposResult.data) {
        setTiposActivos(tiposResult.data)
      }
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  function calcularDepreciaciones() {
    let activosFiltrados = activosFijos

    if (filterTipo !== "0") {
      activosFiltrados = activosFijos.filter((a) => a.tipoActivoId === Number.parseInt(filterTipo))
    }

    // Convertir a formato para cálculo de depreciación
    const activosParaCalculo: ActivoDepreciacion[] = activosFiltrados.map((activo) => ({
      id: activo.id,
      descripcion: activo.descripcion,
      fechaAdquisicion: activo.fechaAdquisicion,
      valor: activo.valor,
      depreciacionAcumulada: activo.depreciacionAcumulada,
      tipoActivoId: activo.tipoActivoId,
      tipoActivoDescripcion: activo.tipoActivoDescripcion,
    }))

    // Calcular depreciaciones
    const activosCalculados = calcularDepreciacionMasiva(activosParaCalculo)
    setActivosConDepreciacion(activosCalculados)

    // Generar reporte por tipo
    const reporte = generarReporteDepreciacionPorTipo(activosParaCalculo)
    setReportePorTipo(reporte)
  }

  const totales = activosConDepreciacion.reduce(
    (acc, activo) => ({
      valorTotal: acc.valorTotal + activo.valor,
      depreciacionTotal: acc.depreciacionTotal + activo.depreciacionAcumulada,
      valorLibrosTotal: acc.valorLibrosTotal + activo.valorLibros,
    }),
    { valorTotal: 0, depreciacionTotal: 0, valorLibrosTotal: 0 },
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-white">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Calculando depreciaciones...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>Error de conexión</span>
        </div>
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
            <Button onClick={loadData} className="mt-4 bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Depreciación de Activos</h1>
          <p className="text-gray-400 mt-1">Cálculo automático de depreciación por método de línea recta</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={calcularDepreciaciones} className="bg-green-600 hover:bg-green-700">
            <Calculator className="h-4 w-4 mr-2" />
            Recalcular
          </Button>
          {/* <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button> */}
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-lg font-bold text-white">{formatearMoneda(totales.valorTotal)}</div>
                <div className="text-sm text-gray-400">Valor Original</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-lg font-bold text-red-400">{formatearMoneda(totales.depreciacionTotal)}</div>
                <div className="text-sm text-gray-400">Depreciación Acumulada</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-lg font-bold text-green-400">{formatearMoneda(totales.valorLibrosTotal)}</div>
                <div className="text-sm text-gray-400">Valor en Libros</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-lg font-bold text-purple-400">
                  {formatearPorcentaje(
                    totales.valorTotal > 0 ? (totales.depreciacionTotal / totales.valorTotal) * 100 : 0,
                  )}
                </div>
                <div className="text-sm text-gray-400">% Depreciado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-64 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos los tipos</SelectItem>
                {tiposActivos.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    {tipo.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Reporte por Tipo de Activo */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Resumen por Tipo de Activo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Tipo de Activo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Cantidad</th>
                  <th className="text-left py-3 px-4 text-gray-300">Valor Total</th>
                  <th className="text-left py-3 px-4 text-gray-300">Depreciación</th>
                  <th className="text-left py-3 px-4 text-gray-300">Valor Libros</th>
                  <th className="text-left py-3 px-4 text-gray-300">% Depreciado</th>
                </tr>
              </thead>
              <tbody>
                {reportePorTipo.map((reporte) => (
                  <tr key={reporte.tipo} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-white font-medium">{reporte.tipo}</td>
                    <td className="py-3 px-4 text-gray-300">{reporte.cantidad}</td>
                    <td className="py-3 px-4 text-gray-300">{formatearMoneda(reporte.valorTotal)}</td>
                    <td className="py-3 px-4 text-red-400">{formatearMoneda(reporte.depreciacionTotal)}</td>
                    <td className="py-3 px-4 text-green-400">{formatearMoneda(reporte.valorLibrosTotal)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-purple-400">
                        {formatearPorcentaje(reporte.porcentajeDepreciacionPromedio)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detalle de Activos */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Detalle de Depreciación por Activo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Activo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Fecha Adq.</th>
                  <th className="text-left py-3 px-4 text-gray-300">Valor Original</th>
                  <th className="text-left py-3 px-4 text-gray-300">Depr. Anual</th>
                  <th className="text-left py-3 px-4 text-gray-300">Depr. Acumulada</th>
                  <th className="text-left py-3 px-4 text-gray-300">Valor Libros</th>
                  <th className="text-left py-3 px-4 text-gray-300">Vida Restante</th>
                </tr>
              </thead>
              <tbody>
                {activosConDepreciacion.map((activo) => (
                  <tr key={activo.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{activo.descripcion}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{activo.tipoActivoDescripcion}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(activo.fechaAdquisicion).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{formatearMoneda(activo.valor)}</td>
                    <td className="py-3 px-4 text-blue-400">{formatearMoneda(activo.depreciacionAnual)}</td>
                    <td className="py-3 px-4 text-red-400">{formatearMoneda(activo.depreciacionAcumulada)}</td>
                    <td className="py-3 px-4 text-green-400">{formatearMoneda(activo.valorLibros)}</td>
                    <td className="py-3 px-4 text-yellow-400">{activo.vidaUtilRestante.toFixed(1)} años</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activosConDepreciacion.length === 0 && (
              <div className="text-center py-8 text-gray-400">No hay activos para mostrar</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
