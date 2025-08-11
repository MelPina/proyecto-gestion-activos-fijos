import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditarAsientoContableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  asiento: {
    id: number;
    descripcion: string;
    cuentaContable: string;
    montoAsiento: number;
    fechaAsiento: string;
  };
}

export default function EditarAsientoContableModal({
  isOpen,
  onClose,
  onSave,
  asiento
}: EditarAsientoContableModalProps) {
  const [form, setForm] = useState(asiento);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onSave(form);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Asiento Contable</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Descripción</Label>
            <Input name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>
          <div>
            <Label>Cuenta Contable</Label>
            <Input name="cuentaContable" value={form.cuentaContable} onChange={handleChange} />
          </div>
          <div>
            <Label>Monto</Label>
            <Input type="number" name="montoAsiento" value={form.montoAsiento} onChange={handleChange} />
          </div>
          <div>
            <Label>Fecha</Label>
            <Input type="date" name="fechaAsiento" value={form.fechaAsiento} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
