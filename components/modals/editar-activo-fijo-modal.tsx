"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit } from "lucide-react"
import { updateActivoFijo, type ActivoFijo } from "@/lib/actions/activos-fijos"
import { getDepartamentos, type Departamento } from "@/lib/actions/departamentos"
import { getTiposActivos, type TipoActivo } from "@/lib/actions/tipos-activos"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  activo: ActivoFijo
  onSuccess: () => void
}

export function EditarActivoFijoModal({ open, onOpenChange, activo, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [tiposActivos, setTiposActivos] = useState<TipoActivo[]>([])

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      const [deptResponse, tiposResponse] = await Promise.all([
        getDepartamentos(),
        getTiposActivos()
      ])

      // Se extrae la propiedad `data` del objeto de respuesta para `departamentos`
      if (deptResponse.success) {
        setDepartamentos(deptResponse.data || [])
      } else {
        setError(deptResponse.error || "Error al cargar los departamentos")
      }

      // Se extrae la propiedad `data` del objeto de respuesta para `tiposActivos`
      if (tiposResponse.success) {
        setTiposActivos(tiposResponse.data || [])
      } else {
        setError(tiposResponse.error || "Error al cargar los tipos de activos")
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Error al cargar los datos")
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await updateActivoFijo(activo.id, formData)

      if (result.success) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(result.error || "Error al actualizar activo fijo")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5 text-blue-400" />
            <span>Editar Activo Fijo</span>
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion" className="text-gray-300">
                Descripción *
              </Label>
              <Input
                id="descripcion"
                name="descripcion"
                defaultValue={activo.descripcion}
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Descripción del activo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamentoId" className="text-gray-300">
                Departamento
              </Label>
              <Select name="departamentoId" defaultValue={activo.departamentoId?.toString() || "0"}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sin departamento</SelectItem>
                  {departamentos.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoActivoId" className="text-gray-300">
                Tipo de Activo *
              </Label>
              <Select name="tipoActivoId" defaultValue={activo.tipoActivoId.toString()}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
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
              <Label htmlFor="fechaAdquisicion" className="text-gray-300">
                Fecha de Adquisición *
              </Label>
              <Input
                id="fechaAdquisicion"
                name="fechaAdquisicion"
                type="date"
                defaultValue={activo.fechaAdquisicion.split("T")[0]}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor" className="text-gray-300">
                Valor *
              </Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0"
                defaultValue={activo.valor}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciacionAcumulada" className="text-gray-300">
                Depreciación Acumulada
              </Label>
              <Input
                id="depreciacionAcumulada"
                name="depreciacionAcumulada"
                type="number"
                step="0.01"
                min="0"
                defaultValue={activo.depreciacionAcumulada}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-gray-300">
                Estado *
              </Label>
              <Select name="estado" defaultValue={activo.estado.toString()}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Activo</SelectItem>
                  <SelectItem value="0">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Actualizando..." : "Actualizar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
