"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Save } from "lucide-react"
import { createActivoFijo } from "@/lib/actions/activos-fijos"
import type { DepartamentoDto, TipoActivoDto } from "@/lib/api-client"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  departamentos: DepartamentoDto[]
  tiposActivos: TipoActivoDto[]
}

export function NuevoActivoFijoModal({ open, onOpenChange, onSuccess, departamentos, tiposActivos }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    setSuccess("")

    const result = await createActivoFijo(formData)

    if (result.success) {
      setSuccess(result.message ?? "Operación exitosa")
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
        setSuccess("")
      }, 1000)
    } else {
      setError(result.error ?? "Ocurrió un error desconocido")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <span>Nuevo Activo Fijo</span>
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion" className="text-gray-300">
                Descripción del Activo *
              </Label>
              <Input
                id="descripcion"
                name="descripcion"
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ej: Laptop Dell Inspiron 15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_activo_id" className="text-gray-300">
                Tipo de Activo *
              </Label>
              <Select name="tipo_activo_id" required>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Seleccione un tipo" />
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
              <Label htmlFor="departamento_id" className="text-gray-300">
                Departamento
              </Label>
              <Select name="departamento_id">
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sin asignar</SelectItem>
                  {departamentos.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_adquisicion" className="text-gray-300">
                Fecha de Adquisición *
              </Label>
              <Input
                id="fecha_adquisicion"
                name="fecha_adquisicion"
                type="date"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor" className="text-gray-300">
                Valor de Adquisición *
              </Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0"
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0.00"
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

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
