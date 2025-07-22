import { NuevoDepartamentoForm } from "@/components/forms/nuevo-departamento-form"

export default function NuevoDepartamento() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Nuevo Departamento</h1>
        <NuevoDepartamentoForm />
      </div>
    </div>
  )
}
