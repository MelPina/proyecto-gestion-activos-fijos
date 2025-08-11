"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { EntradaContable } from "@/lib/actions/entradas-contables"

interface DeleteEntradaContableModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entrada: EntradaContable
  onConfirm: () => void
  loading: boolean
}

export function DeleteEntradaContableModal({
  open,
  onOpenChange,
  entrada,
  onConfirm,
  loading,
}: DeleteEntradaContableModalProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(amount)
  }

  const getTotalMonto = () => {
    return entrada.detalles.reduce((sum, detalle) => sum + detalle.montoAsiento, 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2a2d3a] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Eliminar Entrada Contable
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Esta acción no se puede deshacer. La entrada contable será eliminada permanentemente del sistema externo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="bg-red-900/50 border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-white">
              ¿Está seguro que desea eliminar esta entrada contable?
            </AlertDescription>
          </Alert>

          <div className="bg-[#1e2028] p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">ID</p>
                <p className="text-white font-medium">#{entrada.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Sistema</p>
                <p className="text-white font-medium">Sistema {entrada.sistemaAuxiliarId}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Descripción</p>
              <p className="text-white font-medium">{entrada.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Fecha del Asiento</p>
                <p className="text-white font-medium">{formatDate(entrada.fechaAsiento)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Monto Total</p>
                <p className="text-white font-medium">{formatCurrency(getTotalMonto())}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Detalles ({entrada.detalles.length})</p>
              <div className="space-y-2">
                {entrada.detalles.map((detalle, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">
                      Cuenta {detalle.cuentaId} - {detalle.tipoMovimiento}
                    </span>
                    <span className="text-white font-medium">{formatCurrency(detalle.montoAsiento)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
