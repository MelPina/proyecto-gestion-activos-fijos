"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Save } from "lucide-react"
import { createDepartamento } from "@/lib/actions/departamentos"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function NuevoDepartamentoModal({ open, onOpenChange, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(formData: FormData) {
    const descripcion = formData.get("descripcion") as string
    console.log("Creating new departamento:", descripcion)

    setLoading(true)
    setError("")
    setSuccess("")

    const result = await createDepartamento(formData)
    console.log("Create result:", result)

    if (result.success) {
      setSuccess(result.message ?? "Operación exitosa")
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
        setSuccess("")
        // Reset form
        const form = document.querySelector("form") as HTMLFormElement
        form?.reset()
      }, 1000)
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
            <Building2 className="h-5 w-5 text-blue-400" />
            <span>Nuevo Departamento</span>
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-gray-300">
              Nombre del Departamento *
            </Label>
            <Input
              id="descripcion"
              name="descripcion"
              required
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Ingrese el nombre del departamento"
            />
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
              {loading ? "Guardando..." : "Guardar"}
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
