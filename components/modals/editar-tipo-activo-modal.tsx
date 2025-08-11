"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, Save } from "lucide-react"
import { updateTipoActivo } from "@/lib/actions/tipos-activos"
import type { TipoActivo } from "@/lib/actions/tipos-activos"

interface Props {
  tipoActivo: TipoActivo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditarTipoActivoModal({ tipoActivo, open, onOpenChange, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activo, setActivo] = useState(tipoActivo?.activo ?? true)

  async function handleSubmit(formData: FormData) {
    if (!tipoActivo) return

    setLoading(true)
    setError("")
    setSuccess("")

    formData.set("activo", activo.toString())

    const result = await updateTipoActivo(tipoActivo.id, formData)

    if (result.success) {
      setSuccess("Tipo de activo actualizado exitosamente")
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
        setSuccess("")
      }, 1000)
    } else {
      setError(result.error ?? "")
    }

    setLoading(false)
  }

  if (!tipoActivo) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-400" />
            <span>Editar Tipo de Activo</span>
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-gray-300">
              Descripción *
            </Label>
            <Input
              id="descripcion"
              name="descripcion"
              required
              defaultValue={tipoActivo.descripcion}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Ej: Equipos de Cómputo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuentaContableCompra" className="text-gray-300">
              Cuenta Contable Compra *
            </Label>
            <Input
              id="cuentaContableCompra"
              name="cuentaContableCompra"
              required
              defaultValue={tipoActivo.cuentaContableCompra}
              className="bg-gray-700 border-gray-600 text-white font-mono"
              placeholder="Ej: 1205001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuentaContableDepreciacion" className="text-gray-300">
              Cuenta Contable Depreciación *
            </Label>
            <Input
              id="cuentaContableDepreciacion"
              name="cuentaContableDepreciacion"
              required
              defaultValue={tipoActivo.cuentaContableDepreciacion}
              className="bg-gray-700 border-gray-600 text-white font-mono"
              placeholder="Ej: 1209001"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="activo" checked={activo} onCheckedChange={setActivo} />
            <Label htmlFor="activo" className="text-gray-300">
              Activo
            </Label>
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
              {loading ? "Guardando..." : "Actualizar"}
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
