"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Building2, AlertCircle, RefreshCw } from "lucide-react"
import { getDepartamentos } from "@/lib/actions/departamentos"
import { DeleteDepartamentoModal } from "@/components/modals/delete-departamento-modal"
import { NuevoDepartamentoModal } from "@/components/modals/nuevo-departamento-modal"
import { EditarDepartamentoModal } from "@/components/modals/editar-departamento-modal"
import type { DepartamentoDto } from "@/lib/api-client"

export function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState<DepartamentoDto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; departamento: DepartamentoDto | null }>({
    open: false,
    departamento: null,
  })
  const [nuevoModal, setNuevoModal] = useState(false)
  const [editarModal, setEditarModal] = useState<{ open: boolean; departamento: DepartamentoDto | null }>({
    open: false,
    departamento: null,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    console.log("🔄 Loading departamentos data...")
    setLoading(true)
    setError(null)

    try {
      const result = await getDepartamentos()
      console.log("📊 Departamentos loaded:", result)

      if (result.success && result.data) {
        console.log(`✅ Setting ${result.data.length} departamentos`)
        setDepartamentos(result.data)
      } else {
        console.error("❌ Failed to load departamentos:", result.error)
        setError(`Error cargando departamentos: ${result.error}`)
      }
    } catch (err) {
      console.error("🚨 Unexpected error loading departamentos:", err)
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredDepartamentos = departamentos.filter((dept) =>
    dept.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function handleDeleteClick(departamento: DepartamentoDto) {
    console.log("🗑️ Delete clicked for:", departamento)
    setDeleteModal({ open: true, departamento })
  }

  function handleEditClick(departamento: DepartamentoDto) {
    console.log("✏️ Edit clicked for:", departamento)
    setEditarModal({ open: true, departamento })
  }

  function handleSuccess() {
    console.log("✅ Operation successful, reloading data...")
    // Close modals first
    setDeleteModal({ open: false, departamento: null })
    setEditarModal({ open: false, departamento: null })
    setNuevoModal(false)
    // Then reload data
    loadData()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-white">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando departamentos...</span>
        </div>
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
            <Button onClick={loadData} className="mt-4 bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Departamentos</h1>
          <p className="text-gray-400 mt-1">Gestión de departamentos organizacionales</p>
        </div>
        <Button onClick={() => setNuevoModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Departamento
        </Button>
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
              {departamentos.reduce((sum, d) => sum + d.cantidadEmpleados, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Empleados</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar departamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button onClick={loadData} variant="outline" size="sm" className="bg-transparent">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">ID</th>
                  <th className="text-left py-3 px-4 text-gray-300">Departamento</th>
                  <th className="text-left py-3 px-4 text-gray-300">Empleados</th>
                  <th className="text-left py-3 px-4 text-gray-300">Estado</th>
                  <th className="text-left py-3 px-4 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartamentos.map((dept) => (
                  <tr key={dept.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-gray-400 font-mono">#{dept.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{dept.descripcion}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{dept.cantidadEmpleados}</td>
                    <td className="py-3 px-4">
                      <Badge variant={dept.activo ? "default" : "secondary"}>
                        {dept.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(dept)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(dept)}
                          className="text-red-400 hover:text-red-300 bg-transparent"
                          disabled={dept.cantidadEmpleados > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDepartamentos.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                {searchTerm
                  ? "No se encontraron departamentos que coincidan con la búsqueda"
                  : "No hay departamentos registrados"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DeleteDepartamentoModal
        departamento={deleteModal.departamento}
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        onSuccess={handleSuccess}
      />

      <NuevoDepartamentoModal open={nuevoModal} onOpenChange={setNuevoModal} onSuccess={handleSuccess} />

      <EditarDepartamentoModal
        departamento={editarModal.departamento}
        open={editarModal.open}
        onOpenChange={(open) => setEditarModal({ ...editarModal, open })}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
