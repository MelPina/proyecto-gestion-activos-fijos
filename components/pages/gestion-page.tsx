"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Database, FileText, Users, Bell } from "lucide-react"

const configSections = [
  {
    title: "Configuración General",
    description: "Configuraciones básicas del sistema",
    icon: Settings,
    items: ["Información de la empresa", "Configuración de moneda", "Zona horaria", "Idioma del sistema"],
  },
  {
    title: "Base de Datos",
    description: "Gestión y mantenimiento de datos",
    icon: Database,
    items: ["Respaldo de base de datos", "Restaurar datos", "Limpieza de registros", "Optimización"],
  },
  {
    title: "Reportes",
    description: "Configuración de reportes automáticos",
    icon: FileText,
    items: ["Reportes mensuales", "Alertas de vencimiento", "Exportación de datos", "Plantillas personalizadas"],
  },
  {
    title: "Usuarios y Permisos",
    description: "Gestión de accesos y roles",
    icon: Users,
    items: ["Roles de usuario", "Permisos por módulo", "Auditoría de accesos", "Políticas de seguridad"],
  },
]

export function GestionPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Gestión del Sistema</h1>
        <p className="text-gray-400 mt-1">Configuración y administración general</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configSections.map((section) => (
          <Card key={section.title} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <section.icon className="h-5 w-5 text-blue-400" />
                <span>{section.title}</span>
              </CardTitle>
              <p className="text-sm text-gray-400">{section.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700">
                    <span className="text-sm text-gray-300">{item}</span>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Configurar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Bell className="h-5 w-5 text-yellow-400" />
            <span>Estado del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-md bg-green-900/20 border border-green-700">
              <div className="text-2xl font-bold text-green-400">99.9%</div>
              <div className="text-sm text-gray-300">Tiempo de actividad</div>
            </div>
            <div className="text-center p-4 rounded-md bg-blue-900/20 border border-blue-700">
              <div className="text-2xl font-bold text-blue-400">2.1GB</div>
              <div className="text-sm text-gray-300">Uso de almacenamiento</div>
            </div>
            <div className="text-center p-4 rounded-md bg-purple-900/20 border border-purple-700">
              <div className="text-2xl font-bold text-purple-400">15</div>
              <div className="text-sm text-gray-300">Usuarios activos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
