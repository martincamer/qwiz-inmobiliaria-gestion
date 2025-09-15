import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Receipt,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Hash,
} from "lucide-react";

const DetallesFacturaModal = ({ isOpen, onOpenChange, factura }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      pendiente: { variant: "outline", icon: Clock, label: "Pendiente" },
      pagada: { variant: "default", icon: CheckCircle, label: "Pagada" },
      vencida: { variant: "destructive", icon: AlertCircle, label: "Vencida" },
      anulada: { variant: "secondary", icon: X, label: "Anulada" },
    };

    const config = statusConfig[estado] || statusConfig.pendiente;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTipoFactura = (tipo) => {
    const tipos = {
      A: "Factura A",
      B: "Factura B",
      C: "Factura C",
      E: "Factura E",
    };
    return tipos[tipo] || `Factura ${tipo}`;
  };

  if (!factura) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Detalles de Factura #{factura.numero}
          </DialogTitle>
          <DialogDescription>
            Información completa de la factura
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información Principal
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">{getTipoFactura(factura.tipo)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Número:</span>
                  <span className="font-medium">#{factura.numero}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estado:</span>
                  {getStatusBadge(factura.estado)}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">{formatDate(factura.fecha)}</span>
                </div>
                
                {factura.fechaVencimiento && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Vencimiento:</span>
                    <span className="font-medium">{formatDate(factura.fechaVencimiento)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumen Financiero
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(factura.subtotal)}</span>
                </div>
                
                {factura.descuentoGeneral > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Descuento General:</span>
                    <span className="font-medium text-green-600">-{formatCurrency(factura.descuentoGeneral)}</span>
                  </div>
                )}
                
                {factura.impuestos?.iva21 > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">IVA 21%:</span>
                    <span className="font-medium">{formatCurrency(factura.impuestos.iva21)}</span>
                  </div>
                )}
                
                {factura.impuestos?.iva105 > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">IVA 10.5%:</span>
                    <span className="font-medium">{formatCurrency(factura.impuestos.iva105)}</span>
                  </div>
                )}
                
                {factura.impuestos?.otros > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Otros Impuestos:</span>
                    <span className="font-medium">{formatCurrency(factura.impuestos.otros)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(factura.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items de la Factura */}
          {factura.items && factura.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Items de la Factura
              </h3>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 grid grid-cols-12 gap-2 text-sm font-medium">
                  <div className="col-span-5">Descripción</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Precio Unit.</div>
                  <div className="col-span-2 text-right">Descuento</div>
                  <div className="col-span-1 text-right">Subtotal</div>
                </div>
                
                {factura.items.map((item, index) => (
                  <div key={index} className="px-4 py-3 grid grid-cols-12 gap-2 text-sm border-t">
                    <div className="col-span-5">
                      <p className="font-medium">{item.descripcion}</p>
                    </div>
                    <div className="col-span-2 text-center">
                      {item.cantidad}
                    </div>
                    <div className="col-span-2 text-right">
                      {formatCurrency(item.precioUnitario)}
                    </div>
                    <div className="col-span-2 text-right">
                      {item.descuento > 0 ? formatCurrency(item.descuento) : "-"}
                    </div>
                    <div className="col-span-1 text-right font-medium">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observaciones */}
          {factura.observaciones && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Observaciones
              </h3>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{factura.observaciones}</p>
              </div>
            </div>
          )}

          {/* Información del Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Sistema
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creada:</span>
                <span>{formatDateTime(factura.createdAt)}</span>
              </div>
              
              {factura.updatedAt && factura.updatedAt !== factura.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última modificación:</span>
                  <span>{formatDateTime(factura.updatedAt)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{factura._id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetallesFacturaModal;