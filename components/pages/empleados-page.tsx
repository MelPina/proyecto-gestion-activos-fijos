"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, User, AlertCircle, RefreshCw } from "lucide-react"
import { getEmpleados, getDepartamentos, getEmpleadosStats } from "@/lib/actions/empleados"
import { DeleteEmpleadoModal } from "@/components/modals/delete-empleado-modal"
import type { EmpleadoDto, DepartamentoDto, EmpleadoStatsDto } from "@/lib/api-client"

export function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<EmpleadoDto[]>([])
  const [departamentos, setDepartamentos] = useState<DepartamentoDto[]>([])
  const [stats, setStats] = useState<EmpleadoStatsDto>({ total: 0, porDepartamento: [], porTipo: [] })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartamento, setFilterDepartamento] = useState("0") // Updated default value to be a non-empty string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; empleado: EmpleadoDto | null }>({
    open: false,
    empleado: null,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!loading) {
        loadEmpleados()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, filterDepartamento, loading])

  async function loadData() {
    console.log("Loading data...")
    setLoading(true)
    setError(null)

    try {
      const [empleadosResult, departamentosResult, statsResult] = await Promise.all([
        getEmpleados(),
        getDepartamentos(),
        getEmpleadosStats(),
      ])

      console.log("Results:", { empleadosResult, departamentosResult, statsResult })

      if (empleadosResult.success && empleadosResult.data) {
        setEmpleados(empleadosResult.data)
        console.log("Empleados loaded:", empleadosResult.data.length)
      } else {
        console.error("Error loading empleados:", empleadosResult.error)
        setError(`Error cargando empleados: ${empleadosResult.error}`)
      }

      if (departamentosResult.success && departamentosResult.data) {
        setDepartamentos(departamentosResult.data)
        console.log("Departamentos loaded:", departamentosResult.data.length)
      } else {
        console.error("Error loading departamentos:", departamentosResult.error)
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data)
        console.log("Stats loaded:", statsResult.data)
      } else {
        console.error("Error loading stats:", statsResult.error)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  async function loadEmpleados() {
    console.log("🔍 Loading empleados with filters:", { searchTerm, filterDepartamento })

    const result = await getEmpleados(
      searchTerm || undefined,
      filterDepartamento ? Number.parseInt(filterDepartamento) : undefined,
    )

    if (result.success && result.data) {
      setEmpleados(result.data)
      console.log("Filtered empleados loaded:", result.data.length)
    } else {
      console.error("Error filtering empleados:", result.error)
    }
  }

  function handleDeleteClick(empleado: EmpleadoDto) {
    setDeleteModal({ open: true, empleado })
  }

  function handleDeleteSuccess() {
    loadData() // Reload all data including stats
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-white">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando empleados...</span>
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
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p>Posibles soluciones:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verificar que la API esté ejecutándose en https://localhost:7001</li>
                <li>Verificar la variable NEXT_PUBLIC_API_URL en .env.local</li>
                <li>Revisar la consola del navegador para más detalles</li>
              </ul>
            </div>
            <Button onClick={loadData} className="mt-4 bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Link href="/debug">
            <Button variant="outline" className="bg-transparent">
              🔧 Ir a Herramientas de Debug
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Empleados</h1>
          <p className="text-gray-400 mt-1">Gestión del personal de la empresa</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/debug">
            <Button variant="outline" size="sm" className="bg-transparent">
              🔧 Debug
            </Button>
          </Link>
          <Link href="/empleados/nuevo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Empleados</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{stats.total}</div>
            <div className="text-sm text-gray-400">Activos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{departamentos.length}</div>
            <div className="text-sm text-gray-400">Departamentos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.porTipo.length}</div>
            <div className="text-sm text-gray-400">Tipos de Personal</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
              <SelectTrigger className="w-full md:w-64 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos los departamentos</SelectItem> // Updated value prop to be a non-empty
                string
                {departamentos.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Empleado</th>
                  <th className="text-left py-3 px-4 text-gray-300">Cédula</th>
                  <th className="text-left py-3 px-4 text-gray-300">Departamento</th>
                  <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Fecha Ingreso</th>
                  <th className="text-left py-3 px-4 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{emp.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono">{emp.cedula}</td>
                    <td className="py-3 px-4 text-gray-300">{emp.departamentoDescripcion}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{emp.tipoPersonaDescripcion}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{new Date(emp.fechaIngreso).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link href={`/empleados/${emp.id}/editar`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(emp)}
                          className="text-red-400 hover:text-red-300 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {empleados.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No se encontraron empleados
                <div className="mt-2 text-sm">
                  <Link href="/debug" className="text-blue-400 hover:text-blue-300">
                    🔧 Ejecutar diagnósticos
                  </Link>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DeleteEmpleadoModal
        empleado={deleteModal.empleado}
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
