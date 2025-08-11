"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import {
  createEntradaContable,
  type CreateEntradaContableDto,
  type DetalleAsiento,
} from "@/lib/actions/entradas-contables"

interface NuevaEntradaContableModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function NuevaEntradaContableModal({ open, onOpenChange, onSuccess }: NuevaEntradaContableModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateEntradaContableDto>({
    descripcion: "",
    fechaAsiento: new Date().toISOString().split("T")[0],
    detalles: [
      {
        cuentaId: 65,
        tipoMovimiento: "DB",
        montoAsiento: 0,
      },
    ],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validaciones básicas
      if (!formData.descripcion.trim()) {
        setError("La descripción es requerida")
        return
      }

      if (formData.detalles.length === 0) {
        setError("Debe agregar al menos un detalle")
        return
      }

      if (formData.detalles.some((d) => d.montoAsiento <= 0)) {
        setError("Todos los montos deben ser mayores a 0")
        return
      }

      const result = await createEntradaContable(formData)

      if (result.success) {
        onSuccess()
        onOpenChange(false)
        // Reset form
        setFormData({
          descripcion: "",
          fechaAsiento: new Date().toISOString().split("T")[0],
          detalles: [
            {
              cuentaId: 65,
              tipoMovimiento: "DB",
              montoAsiento: 0,
            },
          ],
        })
      } else {
        setError(result.error || "Error al crear la entrada contable")
      }
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const addDetalle = () => {
    setFormData((prev) => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        {
          cuentaId: 66,
          tipoMovimiento: "CR",
          montoAsiento: 0,
        },
      ],
    }))
  }

  const removeDetalle = (index: number) => {
    if (formData.detalles.length > 1) {
      setFormData((prev) => ({
        ...prev,
        detalles: prev.detalles.filter((_, i) => i !== index),
      }))
    }
  }

  const updateDetalle = (index: number, field: keyof DetalleAsiento, value: any) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles.map((detalle, i) => (i === index ? { ...detalle, [field]: value } : detalle)),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2a2d3a] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Nueva Entrada Contable</DialogTitle>
          <DialogDescription className="text-gray-400">
            Crear una nueva entrada contable en el sistema externo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="space-y-4">
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
          </div>

          {/* Detalles del Asiento */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-lg font-semibold">Detalles del Asiento</Label>
              <Button
                type="button"
                onClick={addDetalle}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Detalle
              </Button>
            </div>

            {formData.detalles.map((detalle, index) => (
              <div key={index} className="p-4 border border-gray-700 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-300 font-medium">Detalle {index + 1}</h4>
                  {formData.detalles.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeDetalle(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Cuenta ID *</Label>
                    <Select
                      value={detalle.cuentaId.toString()}
                      onValueChange={(value) => updateDetalle(index, "cuentaId", Number.parseInt(value))}
                    >
                      <SelectTrigger className="bg-[#1e2028] border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2a2d3a] border-gray-700">
                        <SelectItem value="65" className="text-white">
                          65 - Gasto Depreciación Activos Fijos
                        </SelectItem>
                        <SelectItem value="66" className="text-white">
                          66 - Depreciación Acumulada Activos Fijos
                        </SelectItem>
                        <SelectItem value="3" className="text-white">
                          3 - Cuenta General
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Tipo Movimiento *</Label>
                    <Select
                      value={detalle.tipoMovimiento}
                      onValueChange={(value) => updateDetalle(index, "tipoMovimiento", value)}
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
                    <Label className="text-gray-300">Monto *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={detalle.montoAsiento}
                      onChange={(e) => updateDetalle(index, "montoAsiento", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="bg-[#1e2028] border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
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
