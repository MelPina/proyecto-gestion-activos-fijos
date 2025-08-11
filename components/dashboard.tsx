import { Users, Building2, Package, DollarSign, UserPlus, FileEdit, Calculator, Clock } from "lucide-react"
import { getEmpleadosStats } from "@/lib/actions/empleados"
import { getDepartamentos } from "@/lib/actions/departamentos"
import { getActivosFijosStats } from "@/lib/actions/activos-fijos"
import { getTiposActivos } from "@/lib/actions/tipos-activos"

export async function Dashboard() {
  const [empleadosStatsResult, departamentosResult, activosStatsResult, tiposActivosResult] = await Promise.all([
    getEmpleadosStats(),
    getDepartamentos(),
    getActivosFijosStats(),
    getTiposActivos(),
  ])

  const empleadosStats = empleadosStatsResult.success ? empleadosStatsResult.data : null
  const departamentos = departamentosResult.success ? departamentosResult.data : []
  const activosStats = activosStatsResult.success ? activosStatsResult.data : null
  const tiposActivos = tiposActivosResult.success ? tiposActivosResult.data : []

  // const stats = [
   
  //   {
  //     title: "Departamentos",
  //     value: (departamentos ?? []).filter((d) => d.activo).length.toString(),
  //     description: "Departamentos activos",
  //     icon: <Building2 className="h-6 w-6 text-green-500" />,
  //   },
    
  // ]

  const recentActivity = [
    
    {
      title: "Departamentos activos",
      user: `${(departamentos ?? []).filter((d) => d.activo).length} departamentos`,
      time: "Estado actual",
      icon: <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>,
    },
    {
      title: "Tipos de activos",
      user: `${(tiposActivos ?? []).filter((t) => t.activo).length} tipos configurados`,
      time: "Configuración actual",
      icon: <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>,
    },
    {
      title: "Valor de inventario",
      user: activosStats?.valorTotal ? `$${activosStats.valorTotal.toLocaleString()}` : "$0",
      time: "Valoración actual",
      icon: <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>,
    },
  ]

  const quickAccess = [
    {
      title: "Registrar Nuevo Empleado",
      description: "Agregar empleado al sistema",
      icon: <UserPlus className="h-5 w-5" />,
      path: "/empleados/nuevo",
    },
    {
      title: "Asignar Activo",
      description: "Asignar activo a empleado",
      icon: <FileEdit className="h-5 w-5" />,
      path: "/activos-fijos",
    },
    {
      title: "Calcular Depreciación",
      description: "Ejecutar cálculo de depreciación",
      icon: <Calculator className="h-5 w-5" />,
      path: "/depreciacion",
    },
  ]

  return (
    <div className="space-y-6">
      <br />
      <br />
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* <p className="text-gray-400">Resumen del sistema de activos fijos</p> */}
      </div>

      {/* Stats Grid
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#2a2d3a] rounded-lg p-6 shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </div>
              <div className="bg-[#1e2028] p-2 rounded-lg">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div> */}

      {/* Activity and Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[#2a2d3a] rounded-lg p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Estado del Sistema</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                {activity.icon}
                <div className="ml-2">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <span>{activity.user}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-[#2a2d3a] rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Accesos Rápidos</h2>
          <div className="space-y-3">
            {quickAccess.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center p-3 rounded-lg bg-[#1e2028] hover:bg-[#3a3d4a] transition-colors"
              >
                <div className="bg-blue-600 p-2 rounded-lg mr-3">{item.icon}</div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
