"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Building2, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getDepartamentos, type Departamento } from "@/lib/actions/departamentos"
import { NuevoDepartamentoModal } from "@/components/modals/nuevo-departamento-modal"
import { EditarDepartamentoModal } from "@/components/modals/editar-departamento-modal"
import { DeleteDepartamentoModal } from "@/components/modals/delete-departamento-modal"

export function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [filtered, setFiltered] = useState<Departamento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nuevoOpen, setNuevoOpen] = useState(false)
  const [editarOpen, setEditarOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null)

  const fetchDepartamentos = async (showToast = false) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await getDepartamentos()

      if (result.success && result.data) {
        setDepartamentos(result.data)
        setFiltered(result.data)
        if (showToast) {
          toast({
            title: "Datos actualizados",
            description: "La lista de departamentos fue actualizada correctamente",
          })
        }
      } else {
        throw new Error(result.error || "Error desconocido")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDepartamentos()
  }, [])

  useEffect(() => {
    const result = departamentos.filter((d) =>
      d.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFiltered(result)
  }, [searchTerm, departamentos])

  const handleSuccess = () => fetchDepartamentos()

  const getBadge = (activo: boolean) =>
    activo ? (
      <Badge variant="default" className="bg-green-600">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    )

  if (isLoading) {
    return (
      <div className="p-6 text-white flex items-center space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span>Cargando departamentos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>Error de conexión</span>
        </div>
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
            <Button onClick={() => fetchDepartamentos()} className="mt-4 bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Departamentos</h1>
          <p className="text-gray-400">Gestión de departamentos organizacionales</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setIsRefreshing(true)
              fetchDepartamentos(true)
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </Button>
          <Button onClick={() => setNuevoOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Departamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{departamentos.length}</div>
            <div className="text-sm text-gray-400">Total Departamentos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{departamentos.filter((d) => d.activo).length}</div>
            <div className="text-sm text-gray-400">Activos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">{departamentos.filter((d) => !d.activo).length}</div>
            <div className="text-sm text-gray-400">Inactivos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">
              {departamentos.reduce((sum, d) => sum + (d.cantidadEmpleados || 0), 0)}
            </div>
            <div className="text-sm text-gray-400">Total Empleados</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar departamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">ID</th>
                  <th className="text-left py-3 px-4 text-gray-300">Descripción</th>
                  <th className="text-left py-3 px-4 text-gray-300">Empleados</th>
                  <th className="text-left py-3 px-4 text-gray-300">Estado</th>
                  <th className="text-left py-3 px-4 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((dept) => (
                  <tr key={dept.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-gray-400 font-mono">#{dept.id}</td>
                    <td className="py-3 px-4 text-white flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-blue-400" />
                      <span>{dept.descripcion}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{dept.cantidadEmpleados}</td>
                    <td className="py-3 px-4">{getBadge(dept.activo)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedDepartamento(dept); setEditarOpen(true) }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedDepartamento(dept); setDeleteOpen(true) }}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      {searchTerm
                        ? "No se encontraron departamentos que coincidan con la búsqueda"
                        : "No hay departamentos registrados"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modales */}
      <NuevoDepartamentoModal isOpen={nuevoOpen} onClose={() => setNuevoOpen(false)} onSuccess={handleSuccess} />

      {selectedDepartamento && (
        <>
          <EditarDepartamentoModal
            isOpen={editarOpen}
            onClose={() => {
              setEditarOpen(false)
              setSelectedDepartamento(null)
            }}
            departamento={selectedDepartamento}
            onSuccess={handleSuccess}
          />
          <DeleteDepartamentoModal
            isOpen={deleteOpen}
            onClose={() => {
              setDeleteOpen(false)
              setSelectedDepartamento(null)
            }}
            departamento={selectedDepartamento}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </div>
  )
}
