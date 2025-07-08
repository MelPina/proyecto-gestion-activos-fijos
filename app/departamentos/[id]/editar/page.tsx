import { EditarDepartamentoForm } from "@/components/forms/editar-departamento-form"

interface Props {
  params: { id: string }
}

export default function EditarDepartamento({ params }: Props) {
  return <EditarDepartamentoForm departamentoId={Number.parseInt(params.id)} />
}
