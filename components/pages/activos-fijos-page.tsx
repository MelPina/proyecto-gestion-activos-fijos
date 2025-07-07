"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react"

const activosFijos = [
  {
    id: 1,
    codigo: "AF-001",
    nombre: "Laptop Dell Inspiron 15",
    tipo: "Equipos de Cómputo",
    departamento: "Tecnología",
    responsable: "Carlos López",
    fechaAdquisicion: "2023-01-15",
    valor: 1200,
    estado: "En Uso",
    ubicacion: "Oficina 201",
  },
  {
    id: 2,
    codigo: "AF-002",
    nombre: "Vehículo Toyota Corolla",
    tipo: "Vehículos",
    departamento: "Ventas",
    responsable: "Pedro Rodríguez",
    fechaAdquisicion: "2022-06-10",
    valor: 25000,
    estado: "En Uso",
    ubicacion: "Estacionamiento A",
  },
  {
    id: 3,
    codigo: "AF-003",
    nombre: "Escritorio Ejecutivo",
    tipo: "Mobiliario de Oficina",
    departamento: "Recursos Humanos",
    responsable: "María García",
    fechaAdquisicion: "2023-03-20",
    valor: 450,
    estado: "Disponible",
    ubicacion: "Almacén B",
  },
  {
    id: 4,
    codigo: "AF-004",
    nombre: "Servidor HP ProLiant",
    tipo: "Equipos de Cómputo",
    departamento: "Tecnología",
    responsable: "Carlos López",
    fechaAdquisicion: "2022-11-05",
    valor: 3500,
    estado: "En Mantenimiento",
    ubicacion: "Sala de Servidores",
  },
  {
    id: 5,
    codigo: "AF-005",
    nombre: "Impresora Multifuncional",
    tipo: "Equipos de Oficina",
    departamento: "Contabilidad",
    responsable: "Ana Martínez",
    fechaAdquisicion: "2023-02-14",
    valor: 800,
    estado: "En Uso",
    ubicacion: "Oficina 105",
  },
]

const estadoColors = {
  "En Uso": "bg-green-600",
  Disponible: "bg-blue-600",
  "En Mantenimiento": "bg-yellow-600",
  "Fuera de Servicio": "bg-red-600",
}

export function ActivosFijosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterTipo, setFilterTipo] = useState("todos")

  const filteredActivos = activosFijos.filter((activo) => {
    const matchesSearch =
      activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activo.responsable.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = filterEstado === "todos" || activo.estado === filterEstado
    const matchesTipo = filterTipo === "todos" || activo.tipo === filterTipo

    return matchesSearch && matchesEstado && matchesTipo
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Activos Fijos</h1>
          <p className="text-gray-400 mt-1">Inventario completo de activos de la empresa</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Activo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">324</div>
            <div className="text-sm text-gray-400">Total Activos</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">298</div>
            <div className="text-sm text-gray-400">En Uso</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">14</div>
            <div className="text-sm text-gray-400">Disponibles</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">12</div>
            <div className="text-sm text-gray-400">En Mantenimiento</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar activos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="En Uso">En Uso</SelectItem>
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                <SelectItem value="Fuera de Servicio">Fuera de Servicio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="Equipos de Cómputo">Equipos de Cómputo</SelectItem>
                <SelectItem value="Vehículos">Vehículos</SelectItem>
                <SelectItem value="Mobiliario de Oficina">Mobiliario de Oficina</SelectItem>
                <SelectItem value="Equipos de Oficina">Equipos de Oficina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Código</th>
                  <th className="text-left py-3 px-4 text-gray-300">Activo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Responsable</th>
                  <th className="text-left py-3 px-4 text-gray-300">Valor</th>
                  <th className="text-left py-3 px-4 text-gray-300">Estado</th>
                  <th className="text-left py-3 px-4 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivos.map((activo) => (
                  <tr key={activo.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-white font-mono">{activo.codigo}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-white font-medium">{activo.nombre}</div>
                        <div className="text-sm text-gray-400">{activo.ubicacion}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{activo.tipo}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-white">{activo.responsable}</div>
                        <div className="text-sm text-gray-400">{activo.departamento}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">${activo.valor.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${estadoColors[activo.estado as keyof typeof estadoColors]} text-white`}>
                        {activo.estado}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
