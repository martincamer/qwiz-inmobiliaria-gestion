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
import { AlertTriangle, Receipt, Calendar, DollarSign } from "lucide-react";

const ConfirmarEliminarFacturaModal = ({
  isOpen,
  onOpenChange,
  factura,
  onConfirm,
  isLoading,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleDateString("es-AR");
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      pendiente: { variant: "outline", label: "Pendiente" },
      pagada: { variant: "default", label: "Pagada" },
      vencida: { variant: "destructive", label: "Vencida" },
      anulada: { variant: "secondary", label: "Anulada" },
    };

    const config = statusConfig[estado] || statusConfig.pendiente;

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  if (!factura) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Factura #{factura.numero}</span>
              </div>
              {getStatusBadge(factura.estado)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Fecha</p>
                  <p className="font-medium">{formatDate(factura.fecha)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">{formatCurrency(factura.total)}</p>
                </div>
              </div>
            </div>

            {factura.observaciones && (
              <div>
                <p className="text-sm text-muted-foreground">Observaciones</p>
                <p className="text-sm">{factura.observaciones}</p>
              </div>
            )}
          </div>

          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Advertencia: Esta acción eliminará permanentemente la factura y todos sus datos asociados.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(factura._id)}
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar Factura"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmarEliminarFacturaModal;