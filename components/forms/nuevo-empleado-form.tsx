"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User } from "lucide-react"
import { createEmpleado, getDepartamentos } from "@/lib/actions/empleados"
import type { Departamento } from "@/lib/database"

export function NuevoEmpleadoForm() {
  const router = useRouter()
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function loadDepartamentos() {
      const result = await getDepartamentos()
      if (result.success) {
        setDepartamentos(result.data)
      }
    }
    loadDepartamentos()
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    setSuccess("")

    const result = await createEmpleado(formData)

    if (result.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push("/empleados")
      }, 1500)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()} className="bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Nuevo Empleado</h1>
          <p className="text-gray-400 mt-1">Agregar un nuevo empleado al sistema</p>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700 max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <User className="h-5 w-5 text-blue-400" />
            <span>Información del Empleado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-gray-300">
                  Nombre Completo *
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Ingrese el nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cedula" className="text-gray-300">
                  Cédula *
                </Label>
                <Input
                  id="cedula"
                  name="cedula"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Ingrese la cédula"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departamento_id" className="text-gray-300">
                  Departamento *
                </Label>
                <Select name="departamento_id" required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Seleccione un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_persona" className="text-gray-300">
                  Tipo de Persona *
                </Label>
                <Select name="tipo_persona" required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Empleado</SelectItem>
                    <SelectItem value="2">Contratista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fecha_ingreso" className="text-gray-300">
                  Fecha de Ingreso *
                </Label>
                <Input
                  id="fecha_ingreso"
                  name="fecha_ingreso"
                  type="date"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
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
                {loading ? "Guardando..." : "Guardar Empleado"}
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
