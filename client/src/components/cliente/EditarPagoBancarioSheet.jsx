import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";

const EditarPagoBancarioSheet = ({ isOpen, onOpenChange, pago, onSuccess }) => {
  const { updatePago, isLoading } = useCliente();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    tipoTransaccion: "ingreso",
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    fechaAcreditacion: "",
    concepto: "",
    numeroOperacion: "",
    banco: "",
    cuentaOrigen: "",
    cuentaDestino: "",
    cbu: "",
    alias: "",
    estado: "pendiente",
    facturaRelacionada: "",
    observaciones: "",
    tipo: "transferencia",
  });

  // Cargar datos del pago cuando se abre el sheet
  useEffect(() => {
    if (pago && isOpen) {
      setFormData({
        tipoTransaccion: pago.tipoTransaccion || "ingreso",
        monto: pago.monto?.toString() || "",
        fecha: pago.fecha ? pago.fecha.split("T")[0] : "",
        fechaAcreditacion: pago.fechaAcreditacion
          ? pago.fechaAcreditacion.split("T")[0]
          : "",
        concepto: pago.concepto || "",
        numeroOperacion: pago.numeroOperacion || "",
        banco: pago.banco || "",
        cuentaOrigen: pago.cuentaOrigen || "",
        cuentaDestino: pago.cuentaDestino || "",
        cbu: pago.cbu || "",
        alias: pago.alias || "",
        estado: pago.estado || "pendiente",
        facturaRelacionada: pago.facturaRelacionada || "",
        observaciones: pago.observaciones || "",
        tipo: pago.tipo || "transferencia",
      });
      setError("");
    }
  }, [pago, isOpen]);

  const resetForm = () => {
    setFormData({
      tipoTransaccion: "ingreso",
      monto: "",
      fecha: new Date().toISOString().split("T")[0],
      fechaAcreditacion: "",
      concepto: "",
      numeroOperacion: "",
      banco: "",
      cuentaOrigen: "",
      cuentaDestino: "",
      cbu: "",
      alias: "",
      estado: "pendiente",
      facturaRelacionada: "",
      observaciones: "",
      tipo: "transferencia",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!formData.concepto.trim()) {
      setError("El concepto es obligatorio");
      return;
    }
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }
    if (!formData.fecha) {
      setError("La fecha es obligatoria");
      return;
    }

    try {
      const pagoData = {
        ...formData,
        monto: parseFloat(formData.monto),
      };

      const result = await updatePago(pago._id, pagoData);
      if (result.success) {
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || "Error al actualizar el pago");
      }
    } catch (error) {
      console.error("Error updating pago:", error);
      setError("Error al actualizar el pago bancario");
    }
  };

  const handleOpenChange = (open) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="min-w-6xl overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Editar Pago Bancario
          </SheetTitle>
          <SheetDescription>
            Modifica los datos del pago bancario
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Datos Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos Básicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipoTransaccion" className="text-sm font-medium">
                  Tipo de Movimiento *
                </Label>
                <Select
                  value={formData.tipoTransaccion}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipoTransaccion: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingreso (Cobro)</SelectItem>
                    <SelectItem value="egreso">Egreso (Pago)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipo" className="text-sm font-medium">
                  Método de Pago *
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="debito">Débito Automático</SelectItem>
                    <SelectItem value="credito">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="deposito">Depósito Bancario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="estado" className="text-sm font-medium">
                  Estado
                </Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) =>
                    setFormData({ ...formData, estado: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="procesando">Procesando</SelectItem>
                    <SelectItem value="acreditado">Acreditado</SelectItem>
                    <SelectItem value="rechazado">Rechazado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fecha" className="text-sm font-medium">
                  Fecha de Operación *
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="fechaAcreditacion"
                  className="text-sm font-medium"
                >
                  Fecha de Acreditación
                </Label>
                <Input
                  id="fechaAcreditacion"
                  type="date"
                  value={formData.fechaAcreditacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaAcreditacion: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Datos Bancarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos Bancarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="banco" className="text-sm font-medium">
                  Banco
                </Label>
                <Input
                  id="banco"
                  value={formData.banco}
                  onChange={(e) =>
                    setFormData({ ...formData, banco: e.target.value })
                  }
                  placeholder="Banco Nación, Santander, etc."
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="numeroOperacion"
                  className="text-sm font-medium"
                >
                  Número de Operación
                </Label>
                <Input
                  id="numeroOperacion"
                  value={formData.numeroOperacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numeroOperacion: e.target.value,
                    })
                  }
                  placeholder="123456789"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cuentaOrigen" className="text-sm font-medium">
                  Cuenta Origen
                </Label>
                <Input
                  id="cuentaOrigen"
                  value={formData.cuentaOrigen}
                  onChange={(e) =>
                    setFormData({ ...formData, cuentaOrigen: e.target.value })
                  }
                  placeholder="Número de cuenta origen"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cuentaDestino" className="text-sm font-medium">
                  Cuenta Destino
                </Label>
                <Input
                  id="cuentaDestino"
                  value={formData.cuentaDestino}
                  onChange={(e) =>
                    setFormData({ ...formData, cuentaDestino: e.target.value })
                  }
                  placeholder="Número de cuenta destino"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cbu" className="text-sm font-medium">
                  CBU
                </Label>
                <Input
                  id="cbu"
                  value={formData.cbu}
                  onChange={(e) =>
                    setFormData({ ...formData, cbu: e.target.value })
                  }
                  placeholder="0000000000000000000000"
                  maxLength={22}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="alias" className="text-sm font-medium">
                  Alias
                </Label>
                <Input
                  id="alias"
                  value={formData.alias}
                  onChange={(e) =>
                    setFormData({ ...formData, alias: e.target.value })
                  }
                  placeholder="ALIAS.CUENTA.BANCO"
                />
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalles</h3>
            <div className="grid gap-4">
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
                  required
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
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.concepto ||
                !formData.monto ||
                !formData.fecha
              }
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Actualizando..." : "Actualizar Pago"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditarPagoBancarioSheet;
