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
  CreditCard,
  Calendar,
  Building2,
  Hash,
  User,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  X,
  Copy,
  Eye,
} from "lucide-react";

const DetallesPagoBancarioModal = ({ isOpen, onOpenChange, pago }) => {
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTipoBadge = (tipo) => {
    const tipoConfig = {
      ingreso: {
        variant: "default",
        icon: TrendingUp,
        label: "Ingreso",
        color: "text-green-600",
      },
      egreso: {
        variant: "destructive",
        icon: TrendingDown,
        label: "Egreso",
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
      pendiente: { variant: "outline", icon: Clock, label: "Pendiente" },
      procesando: { variant: "secondary", icon: Clock, label: "Procesando" },
      acreditado: {
        variant: "default",
        icon: CheckCircle,
        label: "Acreditado",
      },
      rechazado: { variant: "destructive", icon: X, label: "Rechazado" },
      cancelado: { variant: "secondary", icon: X, label: "Cancelado" },
    };

    const config = estadoConfig[estado] || estadoConfig.pendiente;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getMetodoBadge = (metodo) => {
    const metodoConfig = {
      transferencia: { variant: "outline", label: "Transferencia" },
      debito: { variant: "secondary", label: "Débito Automático" },
      credito: { variant: "default", label: "Tarjeta de Crédito" },
      deposito: { variant: "outline", label: "Depósito Bancario" },
    };

    const config = metodoConfig[metodo] || metodoConfig.transferencia;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
  };

  if (!pago) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Detalles del Pago Bancario
          </DialogTitle>
          <DialogDescription>
            Información completa del pago bancario
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información Principal
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Concepto
                  </label>
                  <p className="text-sm mt-1">
                    {pago.concepto || "No especificado"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tipo
                    </label>
                    <div className="mt-1">
                      {getTipoBadge(pago.tipoTransaccion)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Estado
                    </label>
                    <div className="mt-1">{getEstadoBadge(pago.estado)}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Método de Pago
                  </label>
                  <div className="mt-1">{getMetodoBadge(pago.tipo)}</div>
                </div>
              </div>
            </div>

            {/* Resumen Financiero */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumen Financiero
              </h3>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Monto</p>
                  <p
                    className={`text-2xl font-bold ${
                      pago.tipoTransaccion === "ingreso"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {pago.tipoTransaccion === "egreso" ? "-" : ""}
                    {formatCurrency(pago.monto)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Operación
                </label>
                <p className="text-sm mt-1">{formatDate(pago.fecha)}</p>
              </div>

              {pago.fechaAcreditacion && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Acreditación
                  </label>
                  <p className="text-sm mt-1">
                    {formatDate(pago.fechaAcreditacion)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Datos Bancarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Datos Bancarios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pago.banco && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Banco
                  </label>
                  <p className="text-sm mt-1">{pago.banco}</p>
                </div>
              )}

              {pago.numeroOperacion && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Número de Operación
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono">{pago.numeroOperacion}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          pago.numeroOperacion,
                          "Número de operación"
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {pago.cuentaOrigen && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cuenta Origen
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono">{pago.cuentaOrigen}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(pago.cuentaOrigen, "Cuenta origen")
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {pago.cuentaDestino && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cuenta Destino
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono">{pago.cuentaDestino}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(pago.cuentaDestino, "Cuenta destino")
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {pago.cbu && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    CBU
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono">{pago.cbu}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(pago.cbu, "CBU")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {pago.alias && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Alias
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono">{pago.alias}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(pago.alias, "Alias")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información Adicional */}
          {(pago.facturaRelacionada || pago.observaciones) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información Adicional
                </h3>

                <div className="space-y-3">
                  {pago.facturaRelacionada && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Factura Relacionada
                      </label>
                      <p className="text-sm mt-1">{pago.facturaRelacionada}</p>
                    </div>
                  )}

                  {pago.observaciones && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Observaciones
                      </label>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {pago.observaciones}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Información del Sistema */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Información del Sistema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <label className="font-medium">ID del Pago</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-xs">{pago._id}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(pago._id, "ID del pago")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="font-medium">Fecha de Creación</label>
                <p className="text-xs mt-1">{formatDateTime(pago.createdAt)}</p>
              </div>

              {pago.updatedAt && pago.updatedAt !== pago.createdAt && (
                <div>
                  <label className="font-medium">Última Modificación</label>
                  <p className="text-xs mt-1">
                    {formatDateTime(pago.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetallesPagoBancarioModal;
