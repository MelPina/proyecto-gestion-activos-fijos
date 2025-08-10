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
import { deleteActivoFijo } from "@/lib/actions/activos-fijos"
import type { ActivoFijoDto } from "@/lib/api-client"

interface Props {
  activoFijo: ActivoFijoDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteActivoFijoModal({ activoFijo, open, onOpenChange, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    if (!activoFijo) return

    setLoading(true)
    setError("")

    const result = await deleteActivoFijo(activoFijo.id)

    if (result.success) {
      onSuccess()
      onOpenChange(false)
    } else {
      setError(result.error ?? "Ocurrió un error desconocido")
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
            ¿Está seguro que desea eliminar el activo fijo{" "}
            <span className="font-semibold text-white">{activoFijo?.descripcion}</span>?
            <br />
            <span className="text-sm text-yellow-400">
              Valor: ${activoFijo?.valor.toLocaleString()} - Estado: {activoFijo?.estadoDescripcion}
            </span>
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
