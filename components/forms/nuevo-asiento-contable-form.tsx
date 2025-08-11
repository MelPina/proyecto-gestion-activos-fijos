import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NuevoAsientoContableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
}

export default function NuevoAsientoContableModal({
  isOpen,
  onClose,
  onCreate
}: NuevoAsientoContableModalProps) {
  const [form, setForm] = useState({
    descripcion: "",
    cuentaContable: "",
    montoAsiento: 0,
    fechaAsiento: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onCreate(form);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Asiento Contable</DialogTitle>
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
            {loading ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
