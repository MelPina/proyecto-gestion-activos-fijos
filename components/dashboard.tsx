"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Package, FileText, RefreshCw } from "lucide-react"
import { getDepartamentos } from "@/lib/actions/departamentos"
import { getEmpleadosStats } from "@/lib/actions/empleados"

interface DashboardStats {
  departamentos: {
    total: number
    activos: number
  }
  empleados: {
    total: number
    porDepartamento: Array<{ descripcion: string; cantidad: number }>
  }
  
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    departamentos: { total: 0, activos: 0 },
    empleados: { total: 0, porDepartamento: [] }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    setError(null)

    try {
      console.log("📊 Loading dashboard data...")

      const [departamentosResult, empleadosStatsResult, ] =
        await Promise.all([getDepartamentos(), getEmpleadosStats()])

      console.log("📊 Dashboard results:", {
        departamentosResult,
        empleadosStatsResult,
       
      })

      // Procesar departamentos
      let departamentosStats = { total: 0, activos: 0 }
      if (departamentosResult.success && departamentosResult.data) {
        departamentosStats = {
          total: departamentosResult.data.length,
          activos: departamentosResult.data.filter((d) => d.activo).length,
        }
      }

      // Procesar empleados
      let empleadosStats: DashboardStats["empleados"] = { total: 0, porDepartamento: [] }
      if (empleadosStatsResult.success && empleadosStatsResult.data) {
        empleadosStats = {
          total: empleadosStatsResult.data.total,
          porDepartamento: empleadosStatsResult.data.porDepartamento.slice(0, 5), // Top 5
        }
      }

      

      setStats({
        departamentos: departamentosStats,
        empleados: empleadosStats
       
      })

      console.log("Dashboard data loaded successfully")
    } catch (err) {
      console.error("Error loading dashboard data:", err)
      setError("Error al cargar los datos del dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-white">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Bienvenido al sistema de gestión de activos fijos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Departamentos</CardTitle>
            <Building2 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.departamentos.total}</div>
            <p className="text-xs text-gray-400 mt-1">
              {stats.departamentos.activos} activos de {stats.departamentos.total} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Empleados</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.empleados.total}</div>
            <p className="text-xs text-gray-400 mt-1">Empleados registrados</p>
          </CardContent>
        </Card>

        {/* <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Tipos de Activos</CardTitle>
            <Package className="h-4 w-4 text-yellow-400" />
          </CardHeader>
        
        </Card> */}

        {/* <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Activos Fijos</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
         
        </Card> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Empleados por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.empleados.porDepartamento.length > 0 ? (
                stats.empleados.porDepartamento.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-white">{dept.descripcion}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{dept.cantidad}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">No hay datos disponibles</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Valor total de activos</span>
                <span className="text-sm font-medium text-white">
                  {/* ${stats.activosFijos.valorTotal.toLocaleString()} */}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Activos en uso</span>
                {/* <span className="text-sm font-medium text-white">{stats.activosFijos.enUso}</span> */}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Activos disponibles</span>
                {/* <span className="text-sm font-medium text-white">{stats.activosFijos.disponibles}</span> */}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Departamentos activos</span>
                <span className="text-sm font-medium text-white">{stats.departamentos.activos}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Sistema iniciado correctamente</p>
                <p className="text-xs text-gray-400">Dashboard cargado con datos actuales</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Datos sincronizados</p>
                <p className="text-xs text-gray-400">
                  {stats.departamentos.total} departamentos, {stats.empleados.total} empleados
                </p>
              </div>
            </div>
            {/* <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Inventario actualizado</p>
                {/* <p className="text-xs text-gray-400">{stats.activosFijos.total} activos fijos registrados</p> 
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
