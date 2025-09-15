import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Calendar,
  DollarSign,
  Receipt,
  FileText,
  Building,
  MessageSquare,
  CreditCard,
} from "lucide-react";

const DetallesPagoModal = ({ isOpen, onOpenChange, pago }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!pago) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Detalles del Pago en Efectivo
          </DialogTitle>
          <DialogDescription>
            Información completa del pago seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información Principal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Monto
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(pago.monto)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Método de Pago
                </label>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <Badge variant="secondary" className="capitalize">
                    {pago.metodoPago || "Efectivo"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Fecha del Pago
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formatDate(pago.fecha)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Concepto
                </label>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{pago.concepto}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de Recibo y Caja */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Recibo y Caja
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Número de Recibo
                </label>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  {pago.recibo?.numero ? (
                    <Badge variant="outline">{pago.recibo.numero}</Badge>
                  ) : (
                    <span className="text-gray-500 italic">
                      No especificado
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Caja
                </label>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {pago.caja?.nombre ? (
                    <Badge variant="secondary">{pago.caja.nombre}</Badge>
                  ) : (
                    <span className="text-gray-500 italic">
                      Sin caja asignada
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información Adicional
            </h3>

            <div className="space-y-4">
              {pago.facturaRelacionada && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Factura Relacionada
                  </label>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <Badge variant="outline">{pago.facturaRelacionada}</Badge>
                  </div>
                </div>
              )}

              {pago.observaciones && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Observaciones
                  </label>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1" />
                    <div className="bg-gray-50 p-3 rounded-lg flex-1">
                      <p className="text-sm">{pago.observaciones}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Información del Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-600">
              Información del Sistema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="space-y-1">
                <label className="font-medium">ID del Pago:</label>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {pago._id}
                </code>
              </div>

              {pago.createdAt && (
                <div className="space-y-1">
                  <label className="font-medium">Fecha de Creación:</label>
                  <span>{formatDateTime(pago.createdAt)}</span>
                </div>
              )}

              {pago.updatedAt && pago.updatedAt !== pago.createdAt && (
                <div className="space-y-1">
                  <label className="font-medium">Última Modificación:</label>
                  <span>{formatDateTime(pago.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetallesPagoModal;
