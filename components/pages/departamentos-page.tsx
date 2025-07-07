"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react"

const departamentos = [
  { id: 1, nombre: "Recursos Humanos", codigo: "RH001", responsable: "María García", empleados: 8, activos: 15 },
  { id: 2, nombre: "Tecnología", codigo: "TI001", responsable: "Carlos López", empleados: 12, activos: 45 },
  { id: 3, nombre: "Contabilidad", codigo: "CT001", responsable: "Ana Martínez", empleados: 6, activos: 12 },
  { id: 4, nombre: "Ventas", codigo: "VT001", responsable: "Pedro Rodríguez", empleados: 15, activos: 28 },
  { id: 5, nombre: "Marketing", codigo: "MK001", responsable: "Laura Sánchez", empleados: 9, activos: 22 },
  { id: 6, nombre: "Operaciones", codigo: "OP001", responsable: "Miguel Torres", empleados: 20, activos: 65 },
]

export function DepartamentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)

  const filteredDepartamentos = departamentos.filter(
    (dept) =>
      dept.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Departamentos</h1>
          <p className="text-gray-400 mt-1">Gestión de departamentos organizacionales</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Departamento
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar departamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Código</th>
                  <th className="text-left py-3 px-4 text-gray-300">Nombre</th>
                  <th className="text-left py-3 px-4 text-gray-300">Responsable</th>
                  <th className="text-left py-3 px-4 text-gray-300">Empleados</th>
                  <th className="text-left py-3 px-4 text-gray-300">Activos</th>
                  <th className="text-left py-3 px-4 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartamentos.map((dept) => (
                  <tr key={dept.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-white font-mono">{dept.codigo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{dept.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{dept.responsable}</td>
                    <td className="py-3 px-4 text-gray-300">{dept.empleados}</td>
                    <td className="py-3 px-4 text-gray-300">{dept.activos}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
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
