import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Banknote } from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";
import { useCashBox } from "../../contexts/CashBoxContext";

const EditarPagoEfectivoSheet = ({ isOpen, onOpenChange, pago, clienteId, onSuccess }) => {
  const { updatePago, isLoading } = useCliente();
  const { cashBoxes, getCashBoxes, isLoading: cashBoxLoading } = useCashBox();

  const [formData, setFormData] = useState({
    monto: 0,
    fecha: new Date().toISOString().split("T")[0],
    concepto: "",
    numeroRecibo: "",
    facturaRelacionada: "",
    observaciones: "",
    metodoPago: "efectivo",
    caja: {
      id: "",
      nombre: "",
    },
  });

  useEffect(() => {
    // Cargar cajas disponibles cuando se abre el sheet
    if (isOpen) {
      getCashBoxes({ isActive: true });
    }
  }, [isOpen]);

  useEffect(() => {
    // Llenar el formulario con los datos del pago cuando se abre
    if (isOpen && pago) {
      setFormData({
        monto: pago.monto || 0,
        fecha: pago.fecha ? pago.fecha.split("T")[0] : "",
        concepto: pago.concepto || "",
        numeroRecibo: pago.recibo?.numero || "",
        facturaRelacionada: pago.facturaRelacionada || "",
        observaciones: pago.observaciones || "",
        metodoPago: "efectivo",
        caja: {
          id: pago.caja?.id || "",
          nombre: pago.caja?.nombre || "",
        },
      });
    }
  }, [isOpen, pago]);

  const handleUpdatePago = async () => {
    try {
      const pagoData = {
        ...formData,
        monto: parseFloat(formData.monto) || 0,
        caja: formData.caja,
      };

      const result = await updatePago(pago._id, pagoData);
      if (result.success) {
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error updating pago:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      monto: 0,
      fecha: new Date().toISOString().split("T")[0],
      concepto: "",
      numeroRecibo: "",
      facturaRelacionada: "",
      observaciones: "",
      metodoPago: "efectivo",
      caja: {
        id: "",
        nombre: "",
      },
    });
  };

  const handleOpenChange = (open) => {
    onOpenChange(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="min-w-xl p-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Pago en Efectivo
          </SheetTitle>
          <SheetDescription>
            Modifica los datos del pago seleccionado
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-4">
          {/* Datos del Pago */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos del Pago</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-monto" className="text-sm font-medium">
                  Monto *
                </Label>
                <Input
                  id="edit-monto"
                  type="number"
                  step="0.01"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-fecha" className="text-sm font-medium">
                  Fecha *
                </Label>
                <Input
                  id="edit-fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-caja" className="text-sm font-medium">
                  Caja *
                </Label>
                <Select
                  value={formData.caja.id}
                  onValueChange={(value) => {
                    const selectedCaja = cashBoxes?.find(
                      (c) => c._id === value
                    );
                    setFormData({
                      ...formData,
                      caja: {
                        id: value,
                        nombre: selectedCaja?.name || "",
                      },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar caja" />
                  </SelectTrigger>
                  <SelectContent>
                    {cashBoxLoading ? (
                      <SelectItem value="loading" disabled>
                        Cargando cajas...
                      </SelectItem>
                    ) : cashBoxes?.length > 0 ? (
                      cashBoxes.map((caja) => (
                        <SelectItem key={caja._id} value={caja._id}>
                          {caja.name} ({caja.currency})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-cajas" disabled>
                        No hay cajas disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-numeroRecibo" className="text-sm font-medium">
                  Número de Recibo
                </Label>
                <Input
                  id="edit-numeroRecibo"
                  value={formData.numeroRecibo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numeroRecibo: e.target.value,
                    })
                  }
                  placeholder="REC-001"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-concepto" className="text-sm font-medium">
                  Concepto *
                </Label>
                <Input
                  id="edit-concepto"
                  value={formData.concepto}
                  onChange={(e) =>
                    setFormData({ ...formData, concepto: e.target.value })
                  }
                  placeholder="Descripción del pago o cobro"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="edit-facturaRelacionada"
                  className="text-sm font-medium"
                >
                  Factura Relacionada
                </Label>
                <Input
                  id="edit-facturaRelacionada"
                  value={formData.facturaRelacionada}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facturaRelacionada: e.target.value,
                    })
                  }
                  placeholder="Número de factura (opcional)"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-observaciones" className="text-sm font-medium">
                  Observaciones
                </Label>
                <Textarea
                  id="edit-observaciones"
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observaciones: e.target.value,
                    })
                  }
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleUpdatePago}
            disabled={
              isLoading ||
              !formData.concepto ||
              !formData.monto ||
              !formData.fecha ||
              !formData.caja.id
            }
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditarPagoEfectivoSheet;