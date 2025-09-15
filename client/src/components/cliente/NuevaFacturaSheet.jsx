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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Receipt, AlertCircle } from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";

const NuevaFacturaSheet = ({ isOpen, onOpenChange, clienteId, onSuccess }) => {
  const { agregarFactura, isLoading, error } = useCliente();

  const [formData, setFormData] = useState({
    numero: "",
    fecha: new Date().toISOString().split("T")[0],
    fechaVencimiento: "",
    tipo: "A",
    items: [
      {
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
        subtotal: 0,
      },
    ],
    subtotal: 0,
    descuentoGeneral: 0,
    impuestos: {
      iva21: 0,
      iva105: 0,
      otros: 0,
    },
    total: 0,
    estado: "pendiente",
    observaciones: "",
  });

  const [errors, setErrors] = useState({});

  // Función para generar número automático
  const generateAutoNumber = async () => {
    try {
      const token = localStorage.getItem("token");
      const tipoFactura = `factura_${formData.tipo || "A"}`;
      const response = await fetch(
        `/api/counters/generate-number/${tipoFactura}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFormData(prev => ({ ...prev, numero: data.data.numero }));
        }
      }
    } catch (error) {
      console.error("Error al generar número automático:", error);
    }
  };

  // Generar número automático al abrir el sheet o cambiar tipo
  useEffect(() => {
    if (isOpen) {
      generateAutoNumber();
    }
  }, [isOpen, formData.tipo]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es obligatoria";
    }

    if (!formData.items.some(item => item.descripcion.trim())) {
      newErrors.items = "Debe agregar al menos un item con descripción";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let facturaData = {
        ...formData,
        items: formData.items.filter((item) => item.descripcion.trim() !== ""),
      };

      // Si no hay número, generar automáticamente
      if (!facturaData.numero || facturaData.numero.trim() === "") {
        const token = localStorage.getItem("token");
        const tipoFactura = `factura_${facturaData.tipo || "A"}`;
        const response = await fetch(
          `/api/counters/generate-number/${tipoFactura}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            facturaData.numero = data.data.numero;
          }
        }
      }

      const result = await agregarFactura(clienteId, facturaData);
      if (result.success) {
        resetForm();
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error creating factura:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      numero: "",
      fecha: new Date().toISOString().split("T")[0],
      fechaVencimiento: "",
      tipo: "A",
      items: [
        {
          descripcion: "",
          cantidad: 1,
          precioUnitario: 0,
          descuento: 0,
          subtotal: 0,
        },
      ],
      subtotal: 0,
      descuentoGeneral: 0,
      impuestos: {
        iva21: 0,
        iva105: 0,
        otros: 0,
      },
      total: 0,
      estado: "pendiente",
      observaciones: "",
    });
    setErrors({});
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          descripcion: "",
          cantidad: 1,
          precioUnitario: 0,
          descuento: 0,
          subtotal: 0,
        },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
    calculateTotals(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calcular subtotal del item
    if (
      field === "cantidad" ||
      field === "precioUnitario" ||
      field === "descuento"
    ) {
      const cantidad =
        field === "cantidad"
          ? parseFloat(value) || 0
          : newItems[index].cantidad;
      const precio =
        field === "precioUnitario"
          ? parseFloat(value) || 0
          : newItems[index].precioUnitario;
      const descuento =
        field === "descuento"
          ? parseFloat(value) || 0
          : newItems[index].descuento;

      newItems[index].subtotal = cantidad * precio - descuento;
    }

    setFormData({ ...formData, items: newItems });
    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const descuentoGeneral = formData.descuentoGeneral || 0;
    const subtotalConDescuento = subtotal - descuentoGeneral;

    const iva21 = subtotalConDescuento * 0.21;
    const total = subtotalConDescuento + iva21;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      impuestos: {
        ...prev.impuestos,
        iva21,
      },
      total,
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-6xl overflow-y-auto p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Nueva Factura
          </SheetTitle>
          <SheetDescription>
            Crea una nueva factura para el cliente
          </SheetDescription>
        </SheetHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 py-4">
          {/* Datos de la Factura */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos de la Factura</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipo" className="text-sm font-medium">
                  Tipo *
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => {
                    setFormData({ ...formData, tipo: value, numero: "" });
                    // Generar nuevo número automáticamente al cambiar tipo
                    setTimeout(() => {
                      generateAutoNumber();
                    }, 100);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Factura A</SelectItem>
                    <SelectItem value="B">Factura B</SelectItem>
                    <SelectItem value="C">Factura C</SelectItem>
                    <SelectItem value="E">Factura E</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="numero" className="text-sm font-medium">
                  Número *
                </Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  readOnly
                  placeholder="Se generará automáticamente"
                  className="bg-gray-50"
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
                  className={errors.fecha ? "border-red-500" : ""}
                />
                {errors.fecha && (
                  <span className="text-sm text-red-500">{errors.fecha}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="fechaVencimiento"
                  className="text-sm font-medium"
                >
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
                    <SelectItem value="pagada">Pagada</SelectItem>
                    <SelectItem value="vencida">Vencida</SelectItem>
                    <SelectItem value="anulada">Anulada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Items de la Factura</h3>
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Item
              </Button>
            </div>

            {errors.items && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.items}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg"
                >
                  <div className="col-span-4">
                    <Label className="text-xs">Descripción</Label>
                    <Input
                      value={item.descripcion}
                      onChange={(e) =>
                        updateItem(index, "descripcion", e.target.value)
                      }
                      placeholder="Descripción del producto/servicio"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Cantidad</Label>
                    <Input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) =>
                        updateItem(index, "cantidad", e.target.value)
                      }
                      placeholder="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Precio Unit.</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.precioUnitario}
                      onChange={(e) =>
                        updateItem(index, "precioUnitario", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Descuento</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.descuento}
                      onChange={(e) =>
                        updateItem(index, "descuento", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label className="text-xs">Subtotal</Label>
                    <div className="text-sm font-medium p-2 bg-muted rounded">
                      {formatCurrency(item.subtotal || 0)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Totales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(formData.subtotal)}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="descuentoGeneral"
                    className="text-sm font-medium"
                  >
                    Descuento General
                  </Label>
                  <Input
                    id="descuentoGeneral"
                    type="number"
                    step="0.01"
                    value={formData.descuentoGeneral}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, descuentoGeneral: value });
                      calculateTotals(formData.items);
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex justify-between">
                  <span>IVA 21%:</span>
                  <span className="font-medium">
                    {formatCurrency(formData.impuestos.iva21)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(formData.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Observaciones</h3>
            <div className="grid gap-2">
              <Label htmlFor="observaciones" className="text-sm font-medium">
                Observaciones adicionales
              </Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
                placeholder="Observaciones adicionales sobre la factura..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Factura"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NuevaFacturaSheet;