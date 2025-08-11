"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { deleteTipoActivo } from "@/lib/actions/tipos-activos"
import type { TipoActivo } from "@/lib/actions/tipos-activos"

interface Props {
  tipoActivo: TipoActivo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteTipoActivoModal({ tipoActivo, open, onOpenChange, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    if (!tipoActivo) return

    setLoading(true)
    setError("")

    const result = await deleteTipoActivo(tipoActivo.id)

    if (result.success) {
      onSuccess()
      onOpenChange(false)
    } else {
      setError(result.error ?? "")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span>Confirmar Eliminación</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            ¿Está seguro que desea eliminar el tipo de activo{" "}
            <span className="font-semibold text-white">{tipoActivo?.descripcion}</span>?
            {tipoActivo?.cantidadActivos && tipoActivo.cantidadActivos > 0 && (
              <span className="text-yellow-400"> Este tipo tiene {tipoActivo.cantidadActivos} activos asociados.</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-md bg-red-900/20 border border-red-700">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="bg-transparent">
            Cancelar
          </Button>
          <Button onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
