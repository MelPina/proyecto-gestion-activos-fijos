"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Building } from "lucide-react"
import { updateDepartamento, getDepartamentosById } from "@/lib/actions/departamento"
import type { DepartamentoDto } from "@/lib/api-client"

interface Props {
  departamentoId: number
}

export function EditarDepartamentoForm({ departamentoId }: Props) {
  const router = useRouter()
  const [departamento, setDepartamento] = useState<DepartamentoDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function loadData() {
      const departamentoResult = await Promise.all(getDepartamentosById(departamentoId))

      if (departamentoResult.success) {
        setDepartamento(departamentoResult.data)
      } else {
        setError("Departamento no encontrado")
      }
    }
    loadData()
  }, [departamentoId])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    setSuccess("")

    const result = await updateDepartamento(departamentoId, formData)

    if (result.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push("/departamentos")
      }, 1500)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  if (!departamento) {
    return (
      <div className="p-6">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()} className="bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Departamento</h1>
          <p className="text-gray-400 mt-1">Modificar información del departamento</p>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700 max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Building className="h-5 w-5 text-blue-400" />
            <span>Información del Departamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-gray-300">
                Nombre del Departamento *
              </Label>
              <Input
                id="descripcion"
                name="descripcion"
                required
                defaultValue={departamento.descripcion}
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

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Guardando..." : "Actualizar Departamento"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
