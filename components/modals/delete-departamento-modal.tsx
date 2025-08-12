"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { deleteDepartamento, type Departamento } from "@/lib/actions/departamentos"
import { toast } from "@/hooks/use-toast"

interface Props {
  isOpen: boolean
  onClose: () => void
  departamento: Departamento
  onSuccess: () => void
}

export function DeleteDepartamentoModal({ isOpen, onClose, departamento, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)

    const result = await deleteDepartamento(departamento.id)

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Departamento eliminado correctamente",
      })
      onSuccess()
      onClose()
    } else {
      toast({
        title: "Error",
        description: result.error || "Error al eliminar departamento",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>Eliminar Departamento</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            ¿Estás seguro de que deseas eliminar el departamento "{departamento.descripcion}"?
            <br />
            <br />
            <strong className="text-red-400">
              Esta acción no se puede deshacer. El departamento será marcado como inactivo.
            </strong>
            <br />
            <br />
            <em className="text-sm text-gray-400">
              Nota: No se puede eliminar un departamento que tenga empleados o activos fijos asignados.
            </em>
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-4 pt-4">
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onClose()} className="bg-transparent">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
