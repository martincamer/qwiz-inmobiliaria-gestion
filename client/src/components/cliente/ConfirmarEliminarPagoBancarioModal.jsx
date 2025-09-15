import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  AlertTriangle,
  Loader2,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";

const ConfirmarEliminarPagoBancarioModal = ({ isOpen, onOpenChange, pago, onSuccess }) => {
  const { deletePago, isLoading } = useCliente();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!pago?._id) return;
    
    setError("");
    try {
      const result = await deletePago(pago._id);
      if (result.success) {
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || "Error al eliminar el pago");
      }
    } catch (error) {
      console.error("Error deleting pago:", error);
      setError("Error al eliminar el pago bancario");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-AR');
  };

  const getTipoBadge = (tipo) => {
    const tipoConfig = {
      ingreso: { variant: "default", icon: TrendingUp, label: "Ingreso", color: "text-green-600" },
      egreso: { variant: "destructive", icon: TrendingDown, label: "Egreso", color: "text-red-600" }
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
      acreditado: { variant: "default", icon: CheckCircle, label: "Acreditado" },
      rechazado: { variant: "destructive", icon: X, label: "Rechazado" },
      cancelado: { variant: "secondary", icon: X, label: "Cancelado" }
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
      debito: { variant: "secondary", label: "Débito" },
      credito: { variant: "default", label: "Crédito" },
      deposito: { variant: "outline", label: "Depósito" }
    };
    
    const config = metodoConfig[metodo] || metodoConfig.transferencia;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setError("");
    }
    onOpenChange(open);
  };

  if (!pago) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este pago bancario? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Información del Pago */}
        <div className="space-y-4 py-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{pago.concepto || 'Sin concepto'}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo:</span>
                <div className="mt-1">
                  {getTipoBadge(pago.tipoTransaccion)}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <div className="mt-1">
                  {getEstadoBadge(pago.estado)}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Método:</span>
                <div className="mt-1">
                  {getMetodoBadge(pago.tipo)}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Monto:</span>
                <div className="mt-1 font-semibold">
                  {formatCurrency(pago.monto)}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Fecha:</span>
                <div className="mt-1">
                  {formatDate(pago.fecha)}
                </div>
              </div>
              
              {pago.banco && (
                <div>
                  <span className="text-muted-foreground">Banco:</span>
                  <div className="mt-1">
                    {pago.banco}
                  </div>
                </div>
              )}
              
              {pago.numeroOperacion && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Nº Operación:</span>
                  <div className="mt-1 font-mono text-xs">
                    {pago.numeroOperacion}
                  </div>
                </div>
              )}
              
              {pago.observaciones && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Observaciones:</span>
                  <div className="mt-1 text-xs">
                    {pago.observaciones}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Eliminando..." : "Eliminar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmarEliminarPagoBancarioModal;