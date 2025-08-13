"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { CreateEntradaContableDto } from "@/lib/actions/entradas-contables"

export interface NuevaEntradaContableModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateEntradaContableDto) => Promise<void>
  loading: boolean
}

export function NuevaEntradaContableModal({ open, onOpenChange, onSubmit, loading }: NuevaEntradaContableModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateEntradaContableDto>({
    descripcion: "",
    cuenta_Id: 3,
    auxiliar_Id: 8, // Fixed value as specified
    tipoMovimiento: "DB",
    fechaAsiento: new Date().toISOString().split("T")[0],
    montoAsiento: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (!formData.descripcion.trim()) {
        setError("La descripción es requerida")
        return
      }

      if (formData.montoAsiento <= 0) {
        setError("El monto debe ser mayor a 0")
        return
      }

      await onSubmit(formData)

      // Reset form on success
      setFormData({
        descripcion: "",
        cuenta_Id: 3,
        auxiliar_Id: 8,
        tipoMovimiento: "DB",
        fechaAsiento: new Date().toISOString().split("T")[0],
        montoAsiento: 0,
      })
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2a2d3a] border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Nueva Entrada Contable</DialogTitle>
          <DialogDescription className="text-gray-400">
            Crear una nueva entrada contable en el sistema externo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-gray-300">
              Descripción *
            </Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción de la entrada contable"
              className="bg-[#1e2028] border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuenta_Id" className="text-gray-300">
              Cuenta ID *
            </Label>
            <Input
              id="cuenta_Id"
              type="number"
              min="1"
              value={formData.cuenta_Id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cuenta_Id: Number.parseInt(e.target.value) || 0 }))
              }
              className="bg-[#1e2028] border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoMovimiento" className="text-gray-300">
              Tipo Movimiento *
            </Label>
            <Select
              value={formData.tipoMovimiento}
              onValueChange={(value: "DB" | "CR") => setFormData((prev) => ({ ...prev, tipoMovimiento: value }))}
            >
              <SelectTrigger className="bg-[#1e2028] border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2d3a] border-gray-700">
                <SelectItem value="DB" className="text-white">
                  DB - Débito
                </SelectItem>
                <SelectItem value="CR" className="text-white">
                  CR - Crédito
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaAsiento" className="text-gray-300">
              Fecha del Asiento *
            </Label>
            <Input
              id="fechaAsiento"
              type="date"
              value={formData.fechaAsiento}
              onChange={(e) => setFormData((prev) => ({ ...prev, fechaAsiento: e.target.value }))}
              className="bg-[#1e2028] border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="montoAsiento" className="text-gray-300">
              Monto *
            </Label>
            <Input
              id="montoAsiento"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.montoAsiento}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, montoAsiento: Number.parseFloat(e.target.value) || 0 }))
              }
              placeholder="0.00"
              className="bg-[#1e2028] border-gray-700 text-white"
              required
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Creando..." : "Crear Entrada"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
