import { NuevoEmpleadoForm } from "@/components/forms/nuevo-empleado-form"

export default function NuevoEmpleado() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Nuevo Empleado</h1>
        <NuevoEmpleadoForm />
      </div>
    </div>
  )
}
