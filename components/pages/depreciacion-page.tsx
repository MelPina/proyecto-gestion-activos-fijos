"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, RefreshCw, FileText, Download } from "lucide-react"
import { getDepreciaciones, getDepreciacionesStats, getAsientosDepreciacion, getMesesProceso } from "@/lib/actions/depreciacion"
import type { DepreciacionDto, AsientoActivoFijoDto } from "@/lib/api-client"

export function DepreciacionPage() {
  const [anio, setAnio] = useState(new Date().getFullYear().toString())
  const [mes, setMes] = useState("")
  const [depreciaciones, setDepreciaciones] = useState<DepreciacionDto[]>([])
  const [asientos, setAsientos] = useState<AsientoActivoFijoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meses, setMeses] = useState<{ id: number; nombre: string }[]>([])

  useEffect(() => {
    loadMeses()
    loadDepreciaciones()
  }, [])

  useEffect(() => {
    loadDepreciaciones()
  }, [anio, mes])

  async function loadMeses() {
    const m = await getMesesProceso()
    setMeses(m)
  }

  async function loadDepreciaciones() {
    setLoading(true)
    setError(null)
    try {
      const result = await getDepreciaciones(parseInt(anio), mes ? parseInt(mes) : undefined)
      if (result.success && result.data) {
        setDepreciaciones(result.data)
      }
      const asientoResult = await getAsientosDepreciacion(parseInt(anio), mes ? parseInt(mes) : undefined)
      if (asientoResult.success && asientoResult.data) {
        setAsientos(asientoResult.data)
      }
    } catch (e) {
      setError("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  function exportar(tipo: "pdf" | "csv") {
    console.log(`Exportar como ${tipo}`)
    // lógica futura para exportar como PDF o CSV
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Reporte de Depreciaciones</h1>
          <p className="text-gray-400 mt-1">Visualiza los movimientos y asientos contables</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportar("pdf")} variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Exportar PDF
          </Button>
          <Button onClick={() => exportar("csv")} variant="outline">
            <Download className="h-4 w-4 mr-2" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Año"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          className="bg-gray-700 text-white border-gray-600 w-32"
        />
        <Select value={mes} onValueChange={setMes}>
          <SelectTrigger className="w-64 bg-gray-700 text-white border-gray-600">
            <SelectValue placeholder="Mes (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los meses</SelectItem>
            {meses.map((m) => (
              <SelectItem key={m.id} value={m.id.toString()}>
                {m.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="text-white">Detalle de Depreciaciones</CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2">Activo</th>
                <th className="px-4 py-2">Fecha Proceso</th>
                <th className="px-4 py-2">Monto Depreciado</th>
                <th className="px-4 py-2">Depreciación Acumulada</th>
              </tr>
            </thead>
            <tbody>
              {depreciaciones.map((d) => (
                <tr key={d.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">#{d.activoFijoId}</td>
                  <td className="px-4 py-2">{new Date(d.fechaProceso).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-green-400">RD$ {d.montoDepreciado.toFixed(2)}</td>
                  <td className="px-4 py-2 text-blue-400">RD$ {d.depreciacionAcumulada.toFixed(2)}</td>
                </tr>
              ))}
              {depreciaciones.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    No hay datos para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="text-white">Asientos Contables Generados</CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2">Cuenta Gasto</th>
                <th className="px-4 py-2">Cuenta Depreciación</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {asientos.map((a, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="px-4 py-2">{a.cuentaCompra}</td>
                  <td className="px-4 py-2">{a.cuentaDepreciacion}</td>
                  <td className="px-4 py-2 text-green-400">RD$ {a.montoDepreciado.toFixed(2)}</td>
                  <td className="px-4 py-2 text-blue-400">RD$ {a.depreciacionAcumulada.toFixed(2)}</td>
                </tr>
              ))}
              {asientos.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    No hay asientos generados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
