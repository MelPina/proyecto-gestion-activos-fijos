"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Package } from "lucide-react"
import { updateActivoFijo, getActivoFijoById, getDepartamentos, getTiposActivos } from "@/lib/actions/activosfijos"
import type { ActivoFijo, Departamento, TipoActivo } from "@/lib/database"

interface Props {
  activoFijoId: number
}

export function EditarActivoFijoForm({ activoFijoId }: Props) {
  const router = useRouter()
  const [activoFijo, setActivoFijo] = useState<ActivoFijo | null>(null)
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [tiposActivos, setTiposActivos] = useState<TipoActivo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
  async function loadData() {
    const [activoResult, deptResult, tiposResult] = await Promise.all([
      getActivoFijoById(activoFijoId),
      getDepartamentos(),
      getTiposActivos(),
    ])

    if (activoResult.success) {
      const data = activoResult.data
      setActivoFijo(data
        ? { ...data, departamentoId: data.departamentoId ?? null }
        : null
      )
    } else {
      setError("Activo fijo no encontrado")
    }

    if (deptResult.success) {
      setDepartamentos(deptResult.data!)
    }

    if (tiposResult.success) {
      setTiposActivos(tiposResult.data!)
    }
  }

  loadData()
}, [activoFijoId])

async function handleSubmit(formData: FormData) {
  setLoading(true)
  setError("")
  setSuccess("")

  const result = await updateActivoFijo(activoFijoId, formData)

  if (result.success) {
    setSuccess(result.message ?? "Operación exitosa")
    setTimeout(() => {
      router.push("/activos-fijos")
    }, 1500)
  } else {
    setError(result.error ?? "Error desconocido")
  }

  setLoading(false)
}
  if (!activoFijo) {
    return (
      <div className="p-6">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()} className="bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Activo Fijo</h1>
          <p className="text-gray-400 mt-1">Modificar información del activo fijo</p>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700 max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Package className="h-5 w-5 text-blue-400" />
            <span>Información del Activo Fijo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-gray-300">Descripción *</Label>
                <Input
                  id="descripcion"
                  name="descripcion"
                  required
                  defaultValue={activoFijo.descripcion}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Ingrese la descripción del activo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departamento_id" className="text-gray-300">Departamento *</Label>
                <Select
                  name="departamento_id"
                  required
                  defaultValue={activoFijo.departamentoId?.toString() ?? ""}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Seleccione un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_activo_id" className="text-gray-300">Tipo de Activo *</Label>
                <Select
                  name="tipo_activo_id"
                  required
                  defaultValue={activoFijo.tipoActivoId.toString()}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Seleccione el tipo de activo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposActivos.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-gray-300">Estado *</Label>
                <Select name="estado" required defaultValue={activoFijo.estado.toString()}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">En uso</SelectItem>
                    <SelectItem value="2">Disponible</SelectItem>
                    <SelectItem value="3">En mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_adquisicion" className="text-gray-300">Fecha de Adquisición *</Label>
                <Input
                  id="fecha_adquisicion"
                  name="fecha_adquisicion"
                  type="date"
                  required
                  defaultValue={activoFijo.fechaAdquisicion}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor" className="text-gray-300">Valor *</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={activoFijo.valor.toString()}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-900/20 border border-red-700">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-900/20 border border-green-700">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Guardando..." : "Actualizar Activo Fijo"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}