import { EditarEmpleadoForm } from "@/components/forms/editar-empleado-form"

interface Props {
  params: { id: string }
}

export default function EditarEmpleado({ params }: Props) {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Editar Empleado</h1>
        <EditarEmpleadoForm empleadoId={Number.parseInt(params.id)} />
      </div>
    </div>
  )
}
