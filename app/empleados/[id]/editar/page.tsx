import { EditarEmpleadoForm } from "@/components/forms/editar-empleado-form"

interface Props {
  params: { id: string }
}

export default function EditarEmpleado({ params }: Props) {
  return <EditarEmpleadoForm empleadoId={Number.parseInt(params.id)} />
}
