import { EditarAsientoContableForm } from "@/components/forms/editar-asiento-contable-form"

interface Props {
  params: { id: string }
}

export default function EditarAsientoContable({ params }: Props) {
  return <EditarAsientoContableForm empleadoId={Number.parseInt(params.id)} />
}
