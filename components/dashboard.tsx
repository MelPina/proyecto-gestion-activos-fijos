import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Package, FileText } from "lucide-react"

const stats = [
  {
    title: "Departamentos",
    value: "12",
    description: "Departamentos registrados",
    icon: Building2,
    color: "text-blue-400",
  },
  {
    title: "Empleados",
    value: "145",
    description: "Empleados registrados",
    icon: Users,
    color: "text-green-400",
  },
  {
    title: "Tipos de Activos",
    value: "8",
    description: "Categorías de activos",
    icon: Package,
    color: "text-yellow-400",
  },
  {
    title: "Activos Fijos",
    value: "324",
    description: "Activos registrados",
    icon: FileText,
    color: "text-purple-400",
  },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Bienvenido al sistema de gestión de activos fijos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Nuevo activo registrado</p>
                  <p className="text-xs text-gray-400">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Empleado asignado a departamento</p>
                  <p className="text-xs text-gray-400">Hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Actualización de inventario</p>
                  <p className="text-xs text-gray-400">Hace 1 día</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Resumen del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Activos en uso</span>
                <span className="text-sm font-medium text-white">298</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Activos disponibles</span>
                <span className="text-sm font-medium text-white">26</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">En mantenimiento</span>
                <span className="text-sm font-medium text-white">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Valor total</span>
                <span className="text-sm font-medium text-white">$2,450,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
