"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Save } from "lucide-react"
import { updateDepartamento } from "@/lib/actions/departamentos"
import type { DepartamentoDto } from "@/lib/api-client"

interface Props {
  departamento: DepartamentoDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditarDepartamentoModal({ departamento, open, onOpenChange, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activo, setActivo] = useState(true)
  const [descripcion, setDescripcion] = useState("")

  // Reset form when departamento changes or modal opens/closes
  useEffect(() => {
    if (departamento && open) {
      console.log("🔄 Setting form data for departamento:", departamento)
      setDescripcion(departamento.descripcion)
      setActivo(departamento.activo)
      setError("")
      setSuccess("")
    } else if (!open) {
      // Reset when modal closes
      setError("")
      setSuccess("")
      setLoading(false)
    }
  }, [departamento, open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!departamento) return

    console.log("📝 Submitting departamento update:", {
      id: departamento.id,
      descripcion,
      activo,
    })

    setLoading(true)
    setError("")
    setSuccess("")

    // Create FormData manually to ensure we have the right values
    const formData = new FormData()
    formData.set("descripcion", descripcion.trim())
    formData.set("activo", activo.toString())

    const result = await updateDepartamento(departamento.id, formData)
    console.log("✅ Update result:", result)

    if (result.success) {
      setSuccess(result.message ?? "Operación exitosa")
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
      }, 1500)
    } else {
      setError(result.error ?? "Ocurrió un error desconocido")
    }

    setLoading(false)
  }

  if (!departamento) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            <span>Editar Departamento</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-gray-300">
              Nombre del Departamento *
            </Label>
            <Input
              id="descripcion"
              name="descripcion"
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Ingrese el nombre del departamento"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="activo" checked={activo} onCheckedChange={setActivo} />
            <Label htmlFor="activo" className="text-gray-300">
              Departamento activo
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
