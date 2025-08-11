"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Monitor,
  Car,
  Wrench,
  Briefcase,
  Home,
  Zap,
  Cpu,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { getTiposActivos, type TipoActivo } from "@/lib/actions/tipos-activos"
import { DeleteTipoActivoModal } from "@/components/modals/delete-tipo-activo-modal"
import { NuevoTipoActivoModal } from "@/components/modals/nuevo-tipo-activo-modal"
import { EditarTipoActivoModal } from "@/components/modals/editar-tipo-activo-modal"

const iconMap = {
  Monitor,
  Car,
  Wrench,
  Briefcase,
  Home,
  Zap,
  Cpu,
  Package,
}

export function TiposActivosPage() {
  const [tiposActivos, setTiposActivos] = useState<TipoActivo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; tipoActivo: TipoActivo | null }>({
    open: false,
    tipoActivo: null,
  })
  const [nuevoModal, setNuevoModal] = useState(false)
  const [editarModal, setEditarModal] = useState<{ open: boolean; tipoActivo: TipoActivo | null }>({
    open: false,
    tipoActivo: null,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const result = await getTiposActivos()
      if (result.success && result.data) {
        setTiposActivos(result.data)
      } else {
        setError(`Error cargando tipos de activos: ${result.error}`)
      }
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredTipos = tiposActivos.filter(
    (tipo) =>
      tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipo.cuentaContableCompra.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function handleDeleteClick(tipoActivo: TipoActivo) {
    setDeleteModal({ open: true, tipoActivo })
  }

  function handleEditClick(tipoActivo: TipoActivo) {
    setEditarModal({ open: true, tipoActivo })
  }

  function handleSuccess() {
    loadData()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-white">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando tipos de activos...</span>
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
          <h1 className="text-3xl font-bold text-white">Tipos de Activos</h1>
          <p className="text-gray-400 mt-1">Categorías y clasificación de activos fijos</p>
        </div>
        <Button onClick={() => setNuevoModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tipo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{tiposActivos.filter((t) => t.activo).length}</div>
            <div className="text-sm text-gray-400">Categorías Activas</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">
              {tiposActivos.reduce((sum, t) => sum + (t.cantidadActivos || 0), 0)}
            </div>
            <div className="text-sm text-gray-400">Total Activos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              ${tiposActivos.reduce((sum, t) => sum + (t.cantidadActivos || 0) * 1000, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Valor Estimado</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {tiposActivos.length > 0
                ? Math.round(tiposActivos.reduce((sum, t) => sum + (t.cantidadActivos || 0), 0) / tiposActivos.length)
                : 0}
            </div>
            <div className="text-sm text-gray-400">Promedio por Tipo</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar tipos de activos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTipos.map((tipo) => {
              const IconComponent = Package
              return (
                <Card key={tipo.id} className="bg-gray-700 border-gray-600 hover:bg-gray-600/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{tipo.descripcion}</CardTitle>
                          <p className="text-sm text-gray-400">Activos: {tipo.cantidadActivos || 0}</p>
                        </div>
                      </div>
                      <Badge variant={tipo.activo ? "default" : "secondary"}>
                        {tipo.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-gray-400">Cuenta Compra</div>
                        <div className="text-white font-mono">{tipo.cuentaContableCompra}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Cuenta Depreciación</div>
                        <div className="text-white font-mono">{tipo.cuentaContableDepreciacion}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditClick(tipo)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-300 bg-transparent"
                        onClick={() => handleDeleteClick(tipo)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {filteredTipos.length === 0 && (
            <div className="text-center py-8 text-gray-400">No se encontraron tipos de activos</div>
          )}
        </CardContent>
      </Card>

      <DeleteTipoActivoModal
        tipoActivo={deleteModal.tipoActivo}
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        onSuccess={handleSuccess}
      />

      <NuevoTipoActivoModal open={nuevoModal} onOpenChange={setNuevoModal} onSuccess={handleSuccess} />

      <EditarTipoActivoModal
        tipoActivo={editarModal.tipoActivo}
        open={editarModal.open}
        onOpenChange={(open) => setEditarModal({ ...editarModal, open })}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
