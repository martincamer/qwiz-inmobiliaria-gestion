import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Plus, Banknote } from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";
import { useCashBox } from "../../contexts/CashBoxContext";

const NuevoPagoEfectivoSheet = ({ clienteId, onSuccess }) => {
  const { registrarPagoEfectivo, getPagos, isLoading } = useCliente();

  const { cashBoxes, getCashBoxes, isLoading: cashBoxLoading } = useCashBox();

  const [isOpen, setIsOpen] = useState(false);
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

  const handleCreatePago = async () => {
    try {
      const pagoData = {
        ...formData,
        monto: parseFloat(formData.monto) || 0,
        caja: formData.caja,
      };

      const result = await registrarPagoEfectivo(clienteId, pagoData);
      if (result.success) {
        setIsOpen(false);
        resetForm();
        if (onSuccess) {
          onSuccess();
        } else {
          getPagos(clienteId);
        }
      }
    } catch (error) {
      console.error("Error creating pago:", error);
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
    setIsOpen(open);
    if (open) {
      resetForm();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pago
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-xl p-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Nuevo Pago en Efectivo
          </SheetTitle>
          <SheetDescription>
            Registra un nuevo pago en efectivo
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-4">
          {/* Datos del Pago */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos del Pago</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="monto" className="text-sm font-medium">
                  Monto *
                </Label>
                <Input
                  id="monto"
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
                <Label htmlFor="fecha" className="text-sm font-medium">
                  Fecha *
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="caja" className="text-sm font-medium">
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
                <Label htmlFor="numeroRecibo" className="text-sm font-medium">
                  Número de Recibo
                </Label>
                <Input
                  id="numeroRecibo"
                  value={formData.numeroRecibo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numeroRecibo: e.target.value,
                    })
                  }
                  placeholder="Se generará automáticamente"
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="concepto" className="text-sm font-medium">
                  Concepto *
                </Label>
                <Input
                  id="concepto"
                  value={formData.concepto}
                  onChange={(e) =>
                    setFormData({ ...formData, concepto: e.target.value })
                  }
                  placeholder="Descripción del pago o cobro"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="facturaRelacionada"
                  className="text-sm font-medium"
                >
                  Factura Relacionada
                </Label>
                <Input
                  id="facturaRelacionada"
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
                <Label htmlFor="observaciones" className="text-sm font-medium">
                  Observaciones
                </Label>
                <Textarea
                  id="observaciones"
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreatePago}
            disabled={
              isLoading ||
              !formData.concepto ||
              !formData.monto ||
              !formData.fecha ||
              !formData.caja.id
            }
          >
            {isLoading ? "Registrando..." : "Registrar Pago"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NuevoPagoEfectivoSheet;
