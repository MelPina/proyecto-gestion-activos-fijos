// app/activos-fijos/[id]/editar/page.tsx
import { EditarActivoFijoForm } from "@/components/forms/editar-activosfijos-form"

export default function EditarActivoFijoPage({ params }: { params: { id: string } }) {
  const activoFijoId = parseInt(params.id)

  return (
    <EditarActivoFijoForm activoFijoId={activoFijoId} />
  )
}