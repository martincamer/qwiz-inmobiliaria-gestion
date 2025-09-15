import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  DollarSign,
  Building2,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  X,
  AlertTriangle,
  Ban,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const DetallesPagoChequesModal = ({
  isOpen,
  onClose,
  pago,
  onEdit,
  onDelete,
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

  const getEstadoBadge = (estado) => {
    const estadoConfig = {
      emitido: { variant: "outline", icon: FileText, label: "Emitido" },
      entregado: { variant: "secondary", icon: Clock, label: "Entregado" },
      depositado: { variant: "default", icon: Building2, label: "Depositado" },
      cobrado: { variant: "default", icon: CheckCircle, label: "Cobrado" },
      rechazado: { variant: "destructive", icon: X, label: "Rechazado" },
      vencido: {
        variant: "destructive",
        icon: AlertTriangle,
        label: "Vencido",
      },
      anulado: { variant: "secondary", icon: Ban, label: "Anulado" },
    };

    const config = estadoConfig[estado] || estadoConfig.emitido;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTipoChequeBadge = (tipo) => {
    const tipoConfig = {
      comun: { variant: "outline", label: "Común" },
      diferido: { variant: "secondary", label: "Diferido" },
      cancelatorio: { variant: "default", label: "Cancelatorio" },
    };

    const config = tipoConfig[tipo] || tipoConfig.comun;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isVencido = (fechaVencimiento) => {
    if (!fechaVencimiento) return false;
    return new Date(fechaVencimiento) < new Date();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles del Cheque
          </DialogTitle>
          <DialogDescription>
            Información completa del cheque seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Header con información principal */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Cheque #{pago.numeroCheque}</h3>
                {getTipoChequeBadge(pago.tipoCheque)}
              </div>
              <div className="flex items-center gap-2">
                {getTipoBadge(pago.tipoTransaccion)}
                <div className="mt-1">{getEstadoBadge(pago.estado)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Monto</div>
              <div
                className={`text-2xl font-bold ${
                  pago.tipoTransaccion === "ingreso"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {pago.tipoTransaccion === "egreso" ? "-" : ""}
                {formatCurrency(pago.monto)}
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fechas
              </h4>
              <div className="space-y-3 pl-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Emisión:</span>
                  <span className="text-sm font-medium">{formatDate(pago.fecha)}</span>
                </div>
                {pago.fechaVencimiento && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vencimiento:</span>
                    <span
                      className={`text-sm font-medium ${
                        isVencido(pago.fechaVencimiento) && pago.estado !== "cobrado"
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {formatDate(pago.fechaVencimiento)}
                      {isVencido(pago.fechaVencimiento) && pago.estado !== "cobrado" && (
                        <span className="ml-1 text-red-600">(Vencido)</span>
                      )}
                    </span>
                  </div>
                )}
                {pago.fechaCobro && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cobro:</span>
                    <span className="text-sm font-medium">{formatDate(pago.fechaCobro)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Datos Bancarios
              </h4>
              <div className="space-y-3 pl-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Banco:</span>
                  <span className="text-sm font-medium">{pago.banco || "No especificado"}</span>
                </div>
                {pago.sucursal && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sucursal:</span>
                    <span className="text-sm font-medium">{pago.sucursal}</span>
                  </div>
                )}
                {pago.cuentaCorriente && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cuenta Corriente:</span>
                    <span className="text-sm font-medium">{pago.cuentaCorriente}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Datos del librador */}
          <div className="space-y-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Datos del Librador
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Librador:</span>
                <span className="text-sm font-medium">{pago.librador || "No especificado"}</span>
              </div>
              {pago.cuit && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CUIT/CUIL:</span>
                  <span className="text-sm font-medium">{pago.cuit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Endoso */}
          {pago.endosado && (
            <div className="space-y-4">
              <h4 className="text-md font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Información de Endoso
              </h4>
              <div className="pl-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Cheque Endosado</Badge>
                </div>
                {pago.endosatario && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Endosatario:</span>
                    <span className="text-sm font-medium">{pago.endosatario}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="space-y-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Información Adicional
            </h4>
            <div className="space-y-3 pl-6">
              <div>
                <span className="text-sm text-gray-600 block mb-1">Concepto:</span>
                <span className="text-sm font-medium">{pago.concepto || "No especificado"}</span>
              </div>
              {pago.facturaRelacionada && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Factura Relacionada:</span>
                  <span className="text-sm font-medium">{pago.facturaRelacionada}</span>
                </div>
              )}
              {pago.observaciones && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Observaciones:</span>
                  <span className="text-sm">{pago.observaciones}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <Eye className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(pago)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={() => onDelete(pago._id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetallesPagoChequesModal;