"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { getTiposActivos, type TipoActivo } from "@/lib/actions/tipos-activos"
import { NuevoTipoActivoModal } from "@/components/modals/nuevo-tipo-activo-modal"
import { EditarTipoActivoModal } from "@/components/modals/editar-tipo-activo-modal"
import { DeleteTipoActivoModal } from "@/components/modals/delete-tipo-activo-modal"

export function TiposActivosPage() {
  const [tiposActivos, setTiposActivos] = useState<TipoActivo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNuevoModal, setShowNuevoModal] = useState(false)
  const [editingTipoActivo, setEditingTipoActivo] = useState<TipoActivo | null>(null)
  const [deletingTipoActivo, setDeletingTipoActivo] = useState<TipoActivo | null>(null)

  const loadData = async () => {
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

  useEffect(() => {
    loadData()
  }, [])

  const handleNuevoSuccess = () => {
    setShowNuevoModal(false)
    loadData()
  }

  const handleEditSuccess = () => {
    setEditingTipoActivo(null)
    loadData()
  }

  const handleDeleteSuccess = () => {
    setDeletingTipoActivo(null)
    loadData()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tipos de Activos</h1>
          {/* <p className="text-gray-400">Gestión de tipos de activos fijos</p> */}
        </div>
        <div className="flex items-center gap-4">
          <Package className="h-8 w-8 text-green-500" />
          <Button onClick={() => setShowNuevoModal(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Tipo
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-white">{error}</AlertDescription>
        </Alert>
      )}

      {/* Tipos Activos Table */}
      <Card className="bg-[#2a2d3a] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Tipos de Activos</CardTitle>
          <CardDescription className="text-gray-400">
            {tiposActivos.length} tipos de activos registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Cargando tipos de activos...</div>
            </div>
          ) : tiposActivos.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">No hay tipos de activos registrados</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Descripción</TableHead>
                  <TableHead className="text-gray-300">Cuenta Compra</TableHead>
                  <TableHead className="text-gray-300">Cuenta Depreciación</TableHead>
                  <TableHead className="text-gray-300">Estado</TableHead>
                  <TableHead className="text-gray-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiposActivos.map((tipo) => (
                  <TableRow key={tipo.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{tipo.id}</TableCell>
                    <TableCell className="text-gray-300">{tipo.descripcion}</TableCell>
                    <TableCell className="text-gray-300">{tipo.cuentaContableCompra}</TableCell>
                    <TableCell className="text-gray-300">{tipo.cuentaContableDepreciacion}</TableCell>
                    <TableCell>
                      <Badge variant={tipo.activo ? "default" : "secondary"}>
                        {tipo.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTipoActivo(tipo)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingTipoActivo(tipo)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <NuevoTipoActivoModal open={showNuevoModal} onOpenChange={setShowNuevoModal} onSuccess={handleNuevoSuccess} />

      {editingTipoActivo && (
        <EditarTipoActivoModal
          tipoActivo={editingTipoActivo ? { ...editingTipoActivo, cantidadActivos: editingTipoActivo.cantidadActivos ?? 0 } : null}
          open={!!editingTipoActivo}
          onOpenChange={(open) => !open && setEditingTipoActivo(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingTipoActivo && (
        <DeleteTipoActivoModal
          tipoActivo={deletingTipoActivo ? { ...deletingTipoActivo, cantidadActivos: deletingTipoActivo.cantidadActivos ?? 0 } : null}
          open={!!deletingTipoActivo}
          onOpenChange={(open) => !open && setDeletingTipoActivo(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}
