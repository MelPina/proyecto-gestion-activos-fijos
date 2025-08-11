"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, RefreshCw, Filter } from "lucide-react"
import { NuevoActivoFijoModal } from "@/components/modals/nuevo-activo-fijo-modal"
import { EditarActivoFijoModal } from "@/components/modals/editar-activo-fijo-modal"
import { DeleteActivoFijoModal } from "@/components/modals/delete-activo-fijo-modal"
import {
  getActivosFijos,
  getActivosFijosStats,
  searchActivosFijos,
  type ActivoFijo,
  type ActivoFijoStats,
} from "@/lib/actions/activos-fijos"
import { getDepartamentos, type Departamento } from "@/lib/actions/departamentos"
import { getTiposActivos, type TipoActivo } from "@/lib/actions/tipos-activos"

export function ActivosFijosPage() {
  const [activos, setActivos] = useState<ActivoFijo[]>([])
  const [filteredActivos, setFilteredActivos] = useState<ActivoFijo[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [tiposActivos, setTiposActivos] = useState<TipoActivo[]>([])
  
  const [stats, setStats] = useState<ActivoFijoStats>({
    total: 0,
    activos: 0,
    inactivos: 0,
    valorTotal: 0,
    depreciacionTotal: 0,
    valorNeto: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartamento, setFilterDepartamento] = useState("all")
  const [filterTipo, setFilterTipo] = useState("all")
  const [filterEstado, setFilterEstado] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showNuevoModal, setShowNuevoModal] = useState(false)
  const [showEditarModal, setShowEditarModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedActivo, setSelectedActivo] = useState<ActivoFijo | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [activosResult, departamentosResult, tiposResult, statsResult] = await Promise.all([
        getActivosFijos(),
        getDepartamentos(),
        getTiposActivos(),
        getActivosFijosStats(),
      ])

      if (activosResult.success && activosResult.data) {
        setActivos(activosResult.data)
        setFilteredActivos(activosResult.data)
      } else {
        setActivos([])
        setFilteredActivos([])
      }

      if (departamentosResult.success && departamentosResult.data) {
        setDepartamentos(departamentosResult.data)
      } else {
        setDepartamentos([])
      }
      const tiposActivosResult = await getTiposActivos()

      if (tiposActivosResult.success && Array.isArray(tiposActivosResult.data)) {
        setTiposActivos(tiposActivosResult.data)
      } else {
        setTiposActivos([]) 
      }
    
      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterDepartamento, filterTipo, filterEstado, activos])

  const applyFilters = async () => {
    let filtered = [...activos]

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      try {
        const searchResult = await searchActivosFijos(searchTerm)
        if (searchResult.success && searchResult.data) {
          filtered = searchResult.data
        }
      } catch (error) {
        console.error("Error searching:", error)
      }
    }

    // Filtro por departamento
    if (filterDepartamento !== "all") {
      const departamentoId = Number.parseInt(filterDepartamento)
      filtered = filtered.filter((activo) => activo.departamentoId === departamentoId)
    }

    // Filtro por tipo
    if (filterTipo !== "all") {
      const tipoId = Number.parseInt(filterTipo)
      filtered = filtered.filter((activo) => activo.tipoActivoId === tipoId)
    }

    // Filtro por estado
    if (filterEstado !== "all") {
      const estado = Number.parseInt(filterEstado)
      filtered = filtered.filter((activo) => activo.estado === estado)
    }

    setFilteredActivos(filtered)
  }

  const handleEdit = (activo: ActivoFijo) => {
    setSelectedActivo(activo)
    setShowEditarModal(true)
  }

  const handleDelete = (activo: ActivoFijo) => {
    setSelectedActivo(activo)
    setShowDeleteModal(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-DO")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Activos Fijos</h1>
          {/* <p className="text-gray-400 mt-1">Gestión del inventario de activos fijos</p> */}
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => setShowNuevoModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Activo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Activos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{stats.activos}</div>
            <div className="text-sm text-gray-400">Activos</div>
          </CardContent>
        </Card>
        {/* <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">{stats.inactivos}</div>
            <div className="text-sm text-gray-400">Inactivos</div>
          </CardContent>
        </Card> */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(stats.valorNeto)}</div>
            <div className="text-sm text-gray-400">Valor Neto</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar activos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {departamentos.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Tipo de Activo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {tiposActivos.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    {tipo.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="1">Activo</SelectItem>
                <SelectItem value="0">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activos Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Descripción</th>
                  <th className="text-left py-3 px-4 text-gray-300">Departamento</th>
                  <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Fecha Adquisición</th>
                  <th className="text-left py-3 px-4 text-gray-300">Valor</th>
                  <th className="text-left py-3 px-4 text-gray-300">Valor Neto</th>
                  <th className="text-left py-3 px-4 text-gray-300">Estado</th>
                  <th className="text-left py-3 px-4 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivos.map((activo) => (
                  <tr key={activo.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{activo.descripcion}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{activo.departamentoNombre}</td>
                    <td className="py-3 px-4 text-gray-300">{activo.tipoActivoNombre}</td>
                    <td className="py-3 px-4 text-gray-300">{formatDate(activo.fechaAdquisicion)}</td>
                    <td className="py-3 px-4 text-gray-300">{formatCurrency(activo.valor)}</td>
                    <td className="py-3 px-4 text-gray-300">{formatCurrency(activo.valorNeto)}</td>
                    <td className="py-3 px-4">
                      <Badge className={activo.estado === 1 ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                        {activo.estado === 1 ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(activo)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(activo)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredActivos.length === 0 && (
              <div className="text-center py-8 text-gray-400">No se encontraron activos fijos</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <NuevoActivoFijoModal open={showNuevoModal} onOpenChange={setShowNuevoModal} onSuccess={loadData} />

      {selectedActivo && (
        <>
          <EditarActivoFijoModal
            open={showEditarModal}
            onOpenChange={setShowEditarModal}
            activo={selectedActivo}
            onSuccess={loadData}
          />
          <DeleteActivoFijoModal
            open={showDeleteModal}
            onOpenChange={setShowDeleteModal}
            activo={selectedActivo}
            onSuccess={loadData}
          />
        </>
      )}
    </div>
  )
}
