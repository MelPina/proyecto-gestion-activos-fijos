"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Package, Monitor, Car, Wrench, Briefcase, Home, Zap, Cpu } from "lucide-react"

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

const tiposActivos = [
  {
    id: 1,
    nombre: "Equipos de Cómputo",
    codigo: "EC",
    descripcion: "Computadoras, laptops, servidores",
    icono: "Monitor",
    cantidad: 85,
    valorPromedio: 1200,
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Vehículos",
    codigo: "VH",
    descripcion: "Automóviles, camiones, motocicletas",
    icono: "Car",
    cantidad: 12,
    valorPromedio: 25000,
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Herramientas",
    codigo: "HR",
    descripcion: "Herramientas de trabajo y mantenimiento",
    icono: "Wrench",
    cantidad: 156,
    valorPromedio: 150,
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Mobiliario de Oficina",
    codigo: "MO",
    descripcion: "Escritorios, sillas, archivadores",
    icono: "Briefcase",
    cantidad: 234,
    valorPromedio: 300,
    estado: "Activo",
  },
  {
    id: 5,
    nombre: "Inmuebles",
    codigo: "IN",
    descripcion: "Edificios, terrenos, locales",
    icono: "Home",
    cantidad: 8,
    valorPromedio: 150000,
    estado: "Activo",
  },
  {
    id: 6,
    nombre: "Equipos Eléctricos",
    codigo: "EE",
    descripcion: "Generadores, transformadores",
    icono: "Zap",
    cantidad: 23,
    valorPromedio: 5000,
    estado: "Activo",
  },
  {
    id: 7,
    nombre: "Equipos de Red",
    codigo: "ER",
    descripcion: "Routers, switches, access points",
    icono: "Cpu",
    cantidad: 45,
    valorPromedio: 800,
    estado: "Inactivo",
  },
]

export function TiposActivosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTipos = tiposActivos.filter(
    (tipo) =>
      tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipo.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Tipos de Activos</h1>
          <p className="text-gray-400 mt-1">Categorías y clasificación de activos fijos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tipo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-sm text-gray-400">Categorías Activas</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">563</div>
            <div className="text-sm text-gray-400">Total Activos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">$8.2M</div>
            <div className="text-sm text-gray-400">Valor Total</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">$14.5K</div>
            <div className="text-sm text-gray-400">Valor Promedio</div>
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
              const IconComponent = iconMap[tipo.icono as keyof typeof iconMap] || Package
              return (
                <Card key={tipo.id} className="bg-gray-700 border-gray-600 hover:bg-gray-600/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{tipo.nombre}</CardTitle>
                          <p className="text-sm text-gray-400">Código: {tipo.codigo}</p>
                        </div>
                      </div>
                      <Badge variant={tipo.estado === "Activo" ? "default" : "secondary"}>{tipo.estado}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-300 mb-4">{tipo.descripcion}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Cantidad</div>
                        <div className="text-white font-semibold">{tipo.cantidad}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Valor Promedio</div>
                        <div className="text-white font-semibold">${tipo.valorPromedio.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
