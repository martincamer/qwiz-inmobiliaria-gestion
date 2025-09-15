import { useState, useEffect } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FileText, X } from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";

const EditarPagoChequesSheet = ({ isOpen, onClose, pago, onSuccess }) => {
  const { updatePago, isLoading } = useCliente();

  const [formData, setFormData] = useState({
    tipoTransaccion: "ingreso",
    monto: 0,
    fecha: new Date().toISOString().split("T")[0],
    fechaVencimiento: "",
    fechaCobro: "",
    concepto: "",
    numeroCheque: "",
    banco: "",
    sucursal: "",
    cuentaCorriente: "",
    cuit: "",
    librador: "",
    endosado: false,
    endosatario: "",
    estado: "emitido",
    facturaRelacionada: "",
    observaciones: "",
    tipoCheque: "comun",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pago && isOpen) {
      setFormData({
        tipoTransaccion: pago.tipoTransaccion || "ingreso",
        monto: pago.monto || 0,
        fecha: pago.fecha ? pago.fecha.split("T")[0] : "",
        fechaVencimiento: pago.fechaVencimiento
          ? pago.fechaVencimiento.split("T")[0]
          : "",
        fechaCobro: pago.fechaCobro ? pago.fechaCobro.split("T")[0] : "",
        concepto: pago.concepto || "",
        numeroCheque: pago.numeroCheque || "",
        banco: pago.banco || "",
        sucursal: pago.sucursal || "",
        cuentaCorriente: pago.cuentaCorriente || "",
        cuit: pago.cuit || "",
        librador: pago.librador || "",
        endosado: pago.endosado || false,
        endosatario: pago.endosatario || "",
        estado: pago.estado || "emitido",
        facturaRelacionada: pago.facturaRelacionada || "",
        observaciones: pago.observaciones || "",
        tipoCheque: pago.tipoCheque || "comun",
      });
    }
  }, [pago, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = "El monto debe ser mayor a 0";
    }
    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida";
    }
    if (!formData.concepto.trim()) {
      newErrors.concepto = "El concepto es requerido";
    }
    if (!formData.numeroCheque.trim()) {
      newErrors.numeroCheque = "El número de cheque es requerido";
    }
    if (!formData.banco.trim()) {
      newErrors.banco = "El banco es requerido";
    }
    if (!formData.librador.trim()) {
      newErrors.librador = "El librador es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const pagoData = {
        ...formData,
        monto: parseFloat(formData.monto) || 0,
        tipo: "cheque", // Método de pago
      };

      const result = await updatePago(pago._id, pagoData);
      if (result.success) {
        resetForm();
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error updating pago:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      tipoTransaccion: "ingreso",
      monto: 0,
      fecha: new Date().toISOString().split("T")[0],
      fechaVencimiento: "",
      fechaCobro: "",
      concepto: "",
      numeroCheque: "",
      banco: "",
      sucursal: "",
      cuentaCorriente: "",
      cuit: "",
      librador: "",
      endosado: false,
      endosatario: "",
      estado: "emitido",
      facturaRelacionada: "",
      observaciones: "",
      tipoCheque: "comun",
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Editar Cheque
          </SheetTitle>
          <SheetDescription>
            Modifica los datos del cheque seleccionado
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-4">
          {/* Datos Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos Básicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="ingreso">
                      Ingreso (Cheque Recibido)
                    </SelectItem>
                    <SelectItem value="egreso">
                      Egreso (Cheque Emitido)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoTransaccion && (
                  <span className="text-sm text-red-500">{errors.tipoTransaccion}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipoCheque" className="text-sm font-medium">
                  Tipo de Cheque *
                </Label>
                <Select
                  value={formData.tipoCheque}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipoCheque: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comun">Común</SelectItem>
                    <SelectItem value="diferido">Diferido</SelectItem>
                    <SelectItem value="cancelatorio">Cancelatorio</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoCheque && (
                  <span className="text-sm text-red-500">{errors.tipoCheque}</span>
                )}
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
                    <SelectItem value="emitido">Emitido</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                    <SelectItem value="depositado">Depositado</SelectItem>
                    <SelectItem value="cobrado">Cobrado</SelectItem>
                    <SelectItem value="rechazado">Rechazado</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="anulado">Anulado</SelectItem>
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
                />
                {errors.monto && (
                  <span className="text-sm text-red-500">{errors.monto}</span>
                )}
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fechas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha" className="text-sm font-medium">
                  Fecha de Emisión *
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                />
                {errors.fecha && (
                  <span className="text-sm text-red-500">{errors.fecha}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fechaVencimiento" className="text-sm font-medium">
                  Fecha de Vencimiento
                </Label>
                <Input
                  id="fechaVencimiento"
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaVencimiento: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fechaCobro" className="text-sm font-medium">
                  Fecha de Cobro
                </Label>
                <Input
                  id="fechaCobro"
                  type="date"
                  value={formData.fechaCobro}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaCobro: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Datos del Cheque */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos del Cheque</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numeroCheque" className="text-sm font-medium">
                  Número de Cheque *
                </Label>
                <Input
                  id="numeroCheque"
                  value={formData.numeroCheque}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numeroCheque: e.target.value,
                    })
                  }
                  placeholder="12345678"
                />
                {errors.numeroCheque && (
                  <span className="text-sm text-red-500">{errors.numeroCheque}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="banco" className="text-sm font-medium">
                  Banco *
                </Label>
                <Input
                  id="banco"
                  value={formData.banco}
                  onChange={(e) =>
                    setFormData({ ...formData, banco: e.target.value })
                  }
                  placeholder="Banco Nación, Santander, etc."
                />
                {errors.banco && (
                  <span className="text-sm text-red-500">{errors.banco}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sucursal" className="text-sm font-medium">
                  Sucursal
                </Label>
                <Input
                  id="sucursal"
                  value={formData.sucursal}
                  onChange={(e) =>
                    setFormData({ ...formData, sucursal: e.target.value })
                  }
                  placeholder="Número o nombre de sucursal"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cuentaCorriente" className="text-sm font-medium">
                  Cuenta Corriente
                </Label>
                <Input
                  id="cuentaCorriente"
                  value={formData.cuentaCorriente}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cuentaCorriente: e.target.value,
                    })
                  }
                  placeholder="Número de cuenta corriente"
                />
              </div>
            </div>
          </div>

          {/* Datos del Librador */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos del Librador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="librador" className="text-sm font-medium">
                  Librador *
                </Label>
                <Input
                  id="librador"
                  value={formData.librador}
                  onChange={(e) =>
                    setFormData({ ...formData, librador: e.target.value })
                  }
                  placeholder="Nombre del librador"
                />
                {errors.librador && (
                  <span className="text-sm text-red-500">{errors.librador}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cuit" className="text-sm font-medium">
                  CUIT/CUIL
                </Label>
                <Input
                  id="cuit"
                  value={formData.cuit}
                  onChange={(e) =>
                    setFormData({ ...formData, cuit: e.target.value })
                  }
                  placeholder="20-12345678-9"
                />
              </div>
            </div>
          </div>

          {/* Endoso */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endoso</h3>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="endosado"
                  checked={formData.endosado}
                  onChange={(e) =>
                    setFormData({ ...formData, endosado: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="endosado" className="text-sm font-medium">
                  Cheque Endosado
                </Label>
              </div>

              {formData.endosado && (
                <div className="grid gap-2">
                  <Label htmlFor="endosatario" className="text-sm font-medium">
                    Endosatario
                  </Label>
                  <Input
                    id="endosatario"
                    value={formData.endosatario}
                    onChange={(e) =>
                      setFormData({ ...formData, endosatario: e.target.value })
                    }
                    placeholder="Nombre del endosatario"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Adicional</h3>
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
                  placeholder="Descripción del concepto"
                />
                {errors.concepto && (
                  <span className="text-sm text-red-500">{errors.concepto}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="facturaRelacionada" className="text-sm font-medium">
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
                  placeholder="Número de factura"
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
                  placeholder="Observaciones adicionales"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Actualizar Cheque"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditarPagoChequesSheet;