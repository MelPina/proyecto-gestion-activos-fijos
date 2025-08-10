"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calculator } from "lucide-react"
import type { ActivoFijoDto, DepreciacionDto } from "@/lib/api-client"

interface Props {
  activo: ActivoFijoDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CalcularDepreciacionModal({ activo, open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resultado, setResultado] = useState<{
    categoria: number | null
    tasa: number | null
    monto: number | null
    acumulada: number | null
  } | null>(null)

  // ==== Funciones de cálculo adaptadas a JS ====
  function categorizarActivo(tipoActivoId: number): number | null {
    if (tipoActivoId) {
      const categoria1 = [1, 2]
      const categoria2 = [3, 4, 5, 6, 7, 8]
      if (categoria1.includes(tipoActivoId)) return 1
      else if (categoria2.includes(tipoActivoId)) return 2
      else return 3
    }
    return null
  }

  function definirTasaDepreciacion(categoria: number | null): number | null {
    switch (categoria) {
      case 1: return 0.05
      case 2: return 0.25
      case 3: return 0.15
      default: return null
    }
  }

  function calcularMontoDepreciado(activo: ActivoFijoDto, fechaProceso: Date, categoria: number | null, porcentaje: number | null): number | null {
    if (categoria == null || porcentaje == null) return null
    const años = (fechaProceso.getTime() - new Date(activo.fechaAdquisicion).getTime()) / (1000 * 60 * 60 * 24 * 365)
    const vidaUtil = Math.floor(100 / porcentaje)
    if (años < 1 || vidaUtil < 1 || años > vidaUtil) return 0

    let valor = activo.valor
    let monto = 0

    if (categoria === 2 || categoria === 3) {
      let primerDep = (valor * 0.5) * porcentaje
      valor -= (valor * 0.5)
      monto += primerDep
      for (let i = 1; i < Math.floor(años); i++) {
        monto += valor * porcentaje
        valor -= valor * porcentaje
      }
    } else if (categoria === 1) {
      for (let i = 0; i < Math.floor(años); i++) {
        let dep = valor * porcentaje
        monto += dep
        valor -= dep
      }
    }
    return Number(monto.toFixed(2))
  }

  function calcularDepreciacionAcumulada(activo: ActivoFijoDto, fechaProceso: Date, categoria: number | null, porcentaje: number | null): number | null {
    if (categoria == null || porcentaje == null) return null
    const años = (fechaProceso.getTime() - new Date(activo.fechaAdquisicion).getTime()) / (1000 * 60 * 60 * 24 * 365)
    const vidaUtil = Math.floor(100 / porcentaje)
    let acumulada = 0
    let valor = activo.valor
    if (años < 1) return 0

    if (categoria === 1) {
      for (let i = 0; i < Math.min(Math.floor(años), vidaUtil); i++) {
        let dep = valor * porcentaje
        acumulada += dep
        valor -= dep
      }
    } else if (categoria === 2 || categoria === 3) {
      let primerDep = (valor * 0.5) * porcentaje
      acumulada += primerDep
      valor -= (valor * 0.5)
      for (let i = 1; i < Math.min(Math.floor(años), vidaUtil); i++) {
        let dep = valor * porcentaje
        acumulada += dep
        valor -= dep
      }
    }
    return Number(acumulada.toFixed(2))
  }

  // ==== Acción al confirmar ====
  async function handleCalcular() {
    if (!activo) return
    setLoading(true)
    setError("")
    try {
      const categoria = categorizarActivo(activo.tipoActivoId)
      const tasa = definirTasaDepreciacion(categoria)
      const fechaProceso = new Date()
      const monto = calcularMontoDepreciado(activo, fechaProceso, categoria, tasa)
      const acumulada = calcularDepreciacionAcumulada(activo, fechaProceso, categoria, tasa)
      setResultado({ categoria, tasa, monto, acumulada })
    } catch (err) {
      setError("Ocurrió un error al calcular la depreciación.")
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-400" />
            <span>Calcular Depreciación</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Calcular depreciación para el activo{" "}
            <span className="font-semibold text-white">{activo?.descripcion}</span>.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-md bg-red-900/20 border border-red-700">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {resultado && (
          <div className="p-3 rounded-md bg-gray-900 border border-gray-700 mt-2">
            <p><strong>Categoría:</strong> {resultado.categoria}</p>
            <p><strong>Tasa:</strong> {resultado.tasa}</p>
            <p><strong>Monto Depreciado:</strong> {resultado.monto}</p>
            <p><strong>Depreciación Acumulada:</strong> {resultado.acumulada}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="bg-transparent">
            Cerrar
          </Button>
          <Button onClick={handleCalcular} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Calculando..." : "Calcular"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
