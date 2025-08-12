"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Calculator, AlertCircle, BarChart3, RefreshCw, Plus, Edit, Trash2 } from "lucide-react"
import {
  getEntradasContables,
  contabilizarEntradas,
  deleteEntradaContable,
  getEntradasContablesStats,
  createEntradaContable,
  updateEntradaContable,
  type EntradaContable,
  type EntradaContableFilters,
  type EntradaContableStats,
  type CreateEntradaContableDto,
  type UpdateEntradaContableDto,
} from "@/lib/actions/entradas-contables"
import { NuevaEntradaContableModal } from "@/components/modals/nueva-entrada-contable-modal"
import { EditarEntradaContableModal } from "@/components/modals/editar-entrada-contable-modal"
import { DeleteEntradaContableModal } from "@/components/modals/delete-entrada-contable-modal"


interface NuevaEntradaContableModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: CreateEntradaContableDto) => Promise<void>;
  loading: boolean;
}

interface EditarEntradaContableModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  entrada: EntradaContable | null; // Aceptar null aquí es crucial
  onSubmit: (data: UpdateEntradaContableDto) => Promise<void>;
  loading: boolean;
}

interface DeleteEntradaContableModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  entrada: EntradaContable | null;
  onConfirm: () => void;
  loading: boolean;
}

export function EntradasContablesPage() {
  const [entradas, setEntradas] = useState<EntradaContable[]>([])
  const [stats, setStats] = useState<EntradaContableStats | null>(null)
  const [selectedEntradas, setSelectedEntradas] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  // El tipo `EntradaContable | null` es correcto aquí, pero los componentes que lo usan
  // deben estar preparados para manejar el `null`.
  const [selectedEntrada, setSelectedEntrada] = useState<EntradaContable | null>(null)
  const [filters, setFilters] = useState<EntradaContableFilters>({
    fechaInicio: "",
    fechaFin: "",
    cuentaId:undefined,
  })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("🔄 Loading entradas contables data...")

      const [entradasResult, statsResult] = await Promise.all([
        getEntradasContables(filters),
        getEntradasContablesStats(filters),
      ])

      if (entradasResult.success && entradasResult.data) {
        setEntradas(entradasResult.data)
        setSelectedEntradas([])
        console.log(`✅ Loaded ${entradasResult.data.length} entradas contables`)
      } else {
        const errorMsg = entradasResult.error || "Error al cargar las entradas contables"
        setError(errorMsg)
        console.error("❌ Error loading entradas:", errorMsg)
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data)
        console.log("✅ Loaded stats successfully")
      } else {
        console.warn("⚠️ Could not load stats:", statsResult.error)
      }
    } catch (err) {
      const errorMsg = `Error inesperado: ${err instanceof Error ? err.message : String(err)}`
      setError(errorMsg)
      console.error("🔥 Unexpected error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleContabilizar = async () => {
    if (selectedEntradas.length === 0) {
      setError("Debe seleccionar al menos una entrada para contabilizar")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await contabilizarEntradas(selectedEntradas)

      if (result.success) {
        setSuccess(`${selectedEntradas.length} entradas contabilizadas exitosamente`)
        setSelectedEntradas([])
        await loadData()
      } else {
        setError(result.error || "Error al contabilizar las entradas")
      }
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const result = await deleteEntradaContable(id)

      if (result.success) {
        setSuccess("Entrada contable eliminada exitosamente")
        await loadData()
      } else {
        setError(result.error || "Error al eliminar la entrada contable")
      }
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
      setSelectedEntrada(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntradas(entradas.map((e) => e.id!).filter((id) => id !== undefined))
    } else {
      setSelectedEntradas([])
    }
  }

  const handleSelectEntrada = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedEntradas((prev) => [...prev, id])
    } else {
      setSelectedEntradas((prev) => prev.filter((entradaId) => entradaId !== id))
    }
  }

  const handleCreate = async (data: CreateEntradaContableDto) => {
    setLoading(true)
    setError(null)

    try {
      const result = await createEntradaContable(data)

      if (result.success) {
        setSuccess("Entrada contable creada exitosamente")
        await loadData()
        setShowNewModal(false)
      } else {
        setError(result.error || "Error al crear la entrada contable")
      }
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (data: UpdateEntradaContableDto) => {
    // Se añade un chequeo para asegurar que selectedEntrada existe y tiene un id
    if (!selectedEntrada?.id) {
      setError("No hay entrada seleccionada para actualizar.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await updateEntradaContable(selectedEntrada.id, data)

      if (result.success) {
        setSuccess("Entrada contable actualizada exitosamente")
        await loadData()
        setShowEditModal(false)
        setSelectedEntrada(null)
      } else {
        setError(result.error || "Error al actualizar la entrada contable")
      }
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(amount)
  }

  const getTotalMonto = (entrada: EntradaContable) => {
    return entrada.detalles.reduce((sum, detalle) => sum + detalle.montoAsiento, 0)
  }

  useEffect(() => {
    console.log("🚀 EntradasContablesPage mounted, loading initial data...")
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Entradas Contables</h1>
          <p className="text-gray-400">Gestión de entradas contables del sistema externo</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowNewModal(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Entrada
          </Button>
          <Button
            onClick={loadData}
            disabled={loading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <BookOpen className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#2a2d3a] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Entradas</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#2a2d3a] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monto Total</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.montoTotal)}</p>
                </div>
                <Calculator className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#2a2d3a] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Seleccionadas</p>
                  <p className="text-2xl font-bold text-white">{selectedEntradas.length}</p>
                </div>
                <Checkbox className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-[#2a2d3a] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure el rango de fechas para consultar las entradas contables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio" className="text-gray-300">
                Fecha Desde
              </Label>
              <Input
                id="fechaInicio"
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => setFilters((prev) => ({ ...prev, fechaInicio: e.target.value }))}
                className="bg-[#1e2028] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin" className="text-gray-300">
                Fecha Hasta
              </Label>
              <Input
                id="fechaFin"
                type="date"
                value={filters.fechaFin}
                onChange={(e) => setFilters((prev) => ({ ...prev, fechaFin: e.target.value }))}
                className="bg-[#1e2028] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuentaId" className="text-gray-300">
                ID Cuenta
              </Label>
              <Input
                id="cuentaId"
                type="number"
                value={filters.cuentaId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, cuentaId: Number.parseInt(e.target.value) || undefined }))
                }
                className="bg-[#1e2028] border-gray-700 text-white"
              />
              
            </div>
          </div>
          <Button onClick={loadData} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Buscando..." : "Buscar Entradas"}
          </Button>
        </CardContent>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-white">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/50 border-green-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-white">{success}</AlertDescription>
        </Alert>
      )}

      {/* Results Table */}
      <Card className="bg-[#2a2d3a] border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Entradas Contables</CardTitle>
              <CardDescription className="text-gray-400">
                {entradas.length} entradas encontradas
                {selectedEntradas.length > 0 && ` • ${selectedEntradas.length} seleccionadas`}
              </CardDescription>
            </div>
            {selectedEntradas.length > 0 && (
              <Button onClick={handleContabilizar} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Calculator className="h-4 w-4 mr-2" />
                Contabilizar ({selectedEntradas.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Cargando entradas contables...
              </div>
            </div>
          ) : entradas.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">No se encontraron entradas contables</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">
                    <Checkbox
                      checked={selectedEntradas.length === entradas.length && entradas.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-gray-300">Id. Transacción</TableHead>
                  <TableHead className="text-gray-300">Descripción</TableHead>
                  <TableHead className="text-gray-300">Fecha Asiento</TableHead>
                  <TableHead className="text-gray-300">Monto Total</TableHead>
                  <TableHead className="text-gray-300">Sistema</TableHead>
                  <TableHead className="text-gray-300">Detalles</TableHead>
                  <TableHead className="text-gray-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entradas.map((entrada) => (
                  <TableRow key={entrada.id} className="border-gray-700">
                    <TableCell>
                      <Checkbox
                        checked={selectedEntradas.includes(entrada.id!)}
                        onCheckedChange={(checked) => handleSelectEntrada(entrada.id!, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="text-white font-medium">{entrada.id}</TableCell>
                    <TableCell className="text-gray-300">{entrada.descripcion}</TableCell>
                    <TableCell className="text-gray-300">{formatDate(entrada.fechaAsiento)}</TableCell>
                    <TableCell className="text-gray-300">{formatCurrency(getTotalMonto(entrada))}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">
                        Sistema {entrada.sistemaAuxiliarId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {entrada.detalles.length} detalle{entrada.detalles.length !== 1 ? "s" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEntrada(entrada)
                            setShowEditModal(true)
                          }}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEntrada(entrada)
                            setShowDeleteModal(true)
                          }}
                          className="border-red-600 text-red-400 hover:bg-red-900/50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
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
      <NuevaEntradaContableModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
        onSubmit={handleCreate}
        loading={loading}
      />

      <EditarEntradaContableModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        entrada={selectedEntrada}
        onSubmit={handleUpdate}
        loading={loading}
      />

      {/* <DeleteEntradaContableModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        entrada={selectedEntrada}
        onConfirm={() => selectedEntrada?.id && handleDelete(selectedEntrada.id)}
        loading={loading}
      /> */}
    </div>
  )
}