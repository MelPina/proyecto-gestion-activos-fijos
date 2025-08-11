"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Save } from "lucide-react"
import { updateDepartamento, type Departamento } from "@/lib/actions/departamentos"
import { toast } from "@/hooks/use-toast"

interface Props {
  isOpen: boolean
  onClose: () => void
  departamento: Departamento
  onSuccess: () => void
}

export function EditarDepartamentoModal({ isOpen, onClose, departamento, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [descripcion, setDescripcion] = useState("")
  const [activo, setActivo] = useState(true)

  useEffect(() => {
    if (isOpen && departamento) {
      setDescripcion(departamento.descripcion)
      setActivo(departamento.activo)
    }
  }, [isOpen, departamento])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!descripcion.trim()) {
      toast({
        title: "Error",
        description: "La descripción es requerida",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("descripcion", descripcion.trim())
    formData.append("activo", activo.toString())

    const result = await updateDepartamento(departamento.id, formData)

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Departamento actualizado correctamente",
      })
      onSuccess()
      onClose()
    } else {
      toast({
        title: "Error",
        description: result.error || "Error al actualizar departamento",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
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

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onClose()} className="bg-transparent">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
