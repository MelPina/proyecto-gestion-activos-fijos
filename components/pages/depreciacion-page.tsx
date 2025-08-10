"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, RefreshCw, FileText, Download, Search } from "lucide-react"
import { getDepreciaciones, getAsientosDepreciacion, getMesesProceso } from "@/lib/actions/depreciacion"
import type { DepreciacionDto, AsientoActivoFijoDto, DepreciacionStatsDto, TipoActivoDto, ActivoFijoDto } from "@/lib/api-client"

export function DepreciacionPage() {
  const [anio, setAnio] = useState<string>(new Date().getFullYear().toString())
  const [mes, setMes] = useState<string>("") // usar string para Select
  const [search, setSearch] = useState<string>("")
  const [depreciaciones, setDepreciaciones] = useState<DepreciacionDto[]>([])
  const [asientos, setAsientos] = useState<AsientoActivoFijoDto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [meses, setMeses] = useState<{ id: number; nombre: string }[]>([])
  const [tipoActivoId, setTipoActivoId] = useState<number | undefined>(undefined);
  const [activoId, setActivoId] = useState<number | undefined>(undefined);

  const [tiposActivos, setTiposActivos] = useState<TipoActivoDto[]>([]);
  const [activos, setActivos] = useState<ActivoFijoDto[]>([]);

  const [data, setData] = useState<DepreciacionDto[]>([]);
  const [stats, setStats] = useState<DepreciacionStatsDto | null>(null);


  // cargar meses y primera carga
  useEffect(() => {
   
    loadDepreciaciones()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // recargar cuando cambien filtros (con debounce para search)
  useEffect(() => {
    const t = setTimeout(() => loadDepreciaciones(), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anio, mes, search])



  async function loadDepreciaciones() {
    setLoading(true)
    setError(null)

    // validación básica: año es obligatorio
    if (!anio || isNaN(Number(anio))) {
      setError("El año es obligatorio y debe ser numérico.")
      setDepreciaciones([])
      setAsientos([])
      setLoading(false)
      return
    }

    try {
      const year = parseInt(anio, 10)
      const month = mes ? parseInt(mes, 10) : undefined

      // Nota: la función getDepreciaciones tiene la firma (search?, anio?, mes?, ...)
      const result = await getDepreciaciones(search || undefined, year, month)
      if (result.success && result.data) {
        setDepreciaciones(result.data)
      } else {
        setDepreciaciones([])
        if (result.error) setError(result.error)
      }

      const asientoResult = await getAsientosDepreciacion(year, month)
      if (asientoResult.success && asientoResult.data) {
        setAsientos(asientoResult.data)
      } else {
        setAsientos([])
      }
    } catch (e) {
      console.error(e)
      setError("Error al cargar datos")
      setDepreciaciones([])
      setAsientos([])
    } finally {
      setLoading(false)
    }
  }

  // exportar CSV o PDF (básico)
  function exportar(tipo: "pdf" | "csv") {
    if (tipo === "csv") {
      exportCSV()
    } else {
      exportPDF()
    }
  }

  function exportCSV() {
    if (depreciaciones.length === 0) return
    const headers = [
      "Activo",
      "Tipo Activo",
      "Monto Inicial",
      "Fecha Proceso",
      "Monto Depreciado",
      "Depreciacion Acumulada",
      "Cuenta Compra",
      "Cuenta Depreciacion"
    ]
    const rows = depreciaciones.map((d) => {
      const desc =
        (d as any).descripcionActivoFijo ??
        (d as any).activoFijoDescripcion ??
        (d as any).activoDescripcion ??
        `#${d.activoFijoId}`

      const tipo =
        (d as any).tipoActivoDescripcion ??
        (d as any).tipoActivoFijo ??
        ""

      const montoInicial = Number((d as any).montoInicial ?? (d as any).valor ?? 0).toFixed(2)
      const fecha = new Date(d.fechaProceso).toLocaleDateString()
      const monto = Number(d.montoDepreciado ?? 0).toFixed(2)
      const acumulada = Number(d.depreciacionAcumulada ?? 0).toFixed(2)
      const cuentaCompra = d.cuentaCompra ?? ""
      const cuentaDep = d.cuentaDepreciacion ?? ""

      return [desc, tipo, montoInicial, fecha, monto, acumulada, cuentaCompra, cuentaDep]
    })

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `depreciaciones_${anio}${mes ? "_" + mes : ""}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportPDF() {
    // impresión simple: abrir nueva ventana con tabla y llamar print()
    const htmlRows = depreciaciones.map((d) => {
      const desc =
        (d as any).descripcionActivoFijo ??
        (d as any).activoFijoDescripcion ??
        (d as any).activoDescripcion ??
        `#${d.activoFijoId}`
      const tipo =
        (d as any).tipoActivoDescripcion ??
        (d as any).tipoActivoFijo ??
        ""
      const montoInicial = Number((d as any).montoInicial ?? (d as any).valor ?? 0).toFixed(2)
      const fecha = new Date(d.fechaProceso).toLocaleDateString()
      const monto = Number(d.montoDepreciado ?? 0).toFixed(2)
      const acumulada = Number(d.depreciacionAcumulada ?? 0).toFixed(2)
      return `<tr>
        <td>${desc}</td>
        <td>${tipo}</td>
        <td style="text-align:right;">RD$ ${montoInicial}</td>
        <td>${fecha}</td>
        <td style="text-align:right;">RD$ ${monto}</td>
        <td style="text-align:right;">RD$ ${acumulada}</td>
      </tr>`
    }).join("\n")

    const html = `<html>
      <head><title>Depreciaciones</title></head>
      <body>
        <h2>Depreciaciones - ${anio}${mes ? " / " + mes : ""}</h2>
        <table border="1" cellspacing="0" cellpadding="6">
          <thead>
            <tr>
              <th>Activo</th><th>Tipo</th><th>Monto Inicial</th><th>Fecha Proceso</th><th>Monto Depreciado</th><th>Dep. Acumulada</th>
            </tr>
          </thead>
          <tbody>${htmlRows}</tbody>
        </table>
      </body>
    </html>`
    const w = window.open("", "_blank", "noopener,noreferrer")
    if (!w) return
    w.document.write(html)
    w.document.close()
    w.focus()
    // dejar que el usuario imprima manualmente
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-white">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando depreciaciones...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>Error</span>
        </div>
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
            <Button onClick={loadDepreciaciones} className="mt-4 bg-red-600 hover:bg-red-700">
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

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por activo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Input
              placeholder="Año"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 w-32"
            />

            <Select value={mes} onValueChange={(v) => setMes(String(v))}>
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
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2">Activo</th>
                <th className="px-4 py-2">Tipo Activo</th>
                <th className="px-4 py-2">Monto Inicial</th>
                <th className="px-4 py-2">Fecha Proceso</th>
                <th className="px-4 py-2">Monto Depreciado</th>
                <th className="px-4 py-2">Depreciación Acumulada</th>
              </tr>
            </thead>
            <tbody>
              {depreciaciones.map((d) => {
                const desc =
                  (d as any).descripcionActivoFijo ??
                  (d as any).activoFijoDescripcion ??
                  (d as any).activoDescripcion ??
                  `#${d.activoFijoId}`

                const tipo =
                  (d as any).tipoActivoDescripcion ??
                  (d as any).tipoActivoFijo ??
                  ""

                const montoInicial = Number((d as any).montoInicial ?? (d as any).valor ?? 0)
                return (
                  <tr key={d.id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{desc}</td>
                    <td className="px-4 py-2">{tipo}</td>
                    <td className="px-4 py-2 text-yellow-400">RD$ {montoInicial.toFixed(2)}</td>
                    <td className="px-4 py-2">{new Date(d.fechaProceso).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-green-400">RD$ {Number(d.montoDepreciado ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-2 text-blue-400">RD$ {Number(d.depreciacionAcumulada ?? 0).toFixed(2)}</td>
                  </tr>
                )
              })}
              {depreciaciones.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">
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
                  <td className="px-4 py-2 text-green-400">RD$ {Number(a.montoDepreciado ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-blue-400">RD$ {Number(a.depreciacionAcumulada ?? 0).toFixed(2)}</td>
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
