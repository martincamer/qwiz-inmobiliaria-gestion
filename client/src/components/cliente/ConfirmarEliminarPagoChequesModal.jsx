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
import {
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
} from "lucide-react";

const ConfirmarEliminarPagoChequesModal = ({
  isOpen,
  onClose,
  onConfirm,
  pago,
  isLoading = false,
}) => {
  if (!pago) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleDateString("es-AR");
  };

  const getTipoBadge = (tipo) => {
    const tipoConfig = {
      ingreso: {
        variant: "default",
        icon: TrendingUp,
        label: "Cobro",
        color: "text-green-600",
      },
      egreso: {
        variant: "destructive",
        icon: TrendingDown,
        label: "Pago",
        color: "text-red-600",
      },
    };

    const config = tipoConfig[tipo] || tipoConfig.ingreso;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleConfirm = () => {
    onConfirm(pago._id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El cheque será eliminado permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">
                  Cheque #{pago.numeroCheque}
                </span>
              </div>
              {getTipoBadge(pago.tipoTransaccion)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600 block">Fecha:</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(pago.fecha)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">Monto:</span>
                <span
                  className={`font-medium flex items-center gap-1 ${
                    pago.tipoTransaccion === "ingreso"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <DollarSign className="h-3 w-3" />
                  {pago.tipoTransaccion === "egreso" ? "-" : ""}
                  {formatCurrency(pago.monto)}
                </span>
              </div>
            </div>

            {pago.concepto && (
              <div>
                <span className="text-gray-600 text-sm block">Concepto:</span>
                <span className="text-sm font-medium">{pago.concepto}</span>
              </div>
            )}

            {pago.banco && (
              <div>
                <span className="text-gray-600 text-sm block">Banco:</span>
                <span className="text-sm font-medium">{pago.banco}</span>
              </div>
            )}

            {pago.librador && (
              <div>
                <span className="text-gray-600 text-sm block">Librador:</span>
                <span className="text-sm font-medium">{pago.librador}</span>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">¿Estás seguro?</p>
                <p>
                  Esta acción eliminará permanentemente el cheque y toda su información
                  asociada. No podrás recuperar estos datos después de confirmar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar Cheque"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmarEliminarPagoChequesModal;