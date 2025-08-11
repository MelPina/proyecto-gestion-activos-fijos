"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertTriangle } from "lucide-react"
import { deleteActivoFijo, type ActivoFijo } from "@/lib/actions/activos-fijos"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  activo: ActivoFijo
  onSuccess: () => void
}

export function DeleteActivoFijoModal({ open, onOpenChange, activo, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await deleteActivoFijo(activo.id)

      if (result.success) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(result.error || "Error al eliminar activo fijo")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-400">
            <Trash2 className="h-5 w-5" />
            <span>Eliminar Activo Fijo</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-3 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-200 font-medium">¿Estás seguro de que deseas eliminar este activo fijo?</p>
              <p className="text-yellow-300 text-sm mt-1">
                <strong>Activo:</strong> {activo.descripcion}
              </p>
              <p className="text-yellow-300 text-sm">
                <strong>Departamento:</strong> {activo.departamentoNombre}
              </p>
              <p className="text-yellow-300 text-sm">
                <strong>Tipo:</strong> {activo.tipoActivoNombre}
              </p>
              <p className="text-red-300 text-sm mt-2">Esta acción no se puede deshacer.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
            {isLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
