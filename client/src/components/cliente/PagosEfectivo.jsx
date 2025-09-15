import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Banknote,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";
import { useCashBox } from "../../contexts/CashBoxContext";
import NuevoPagoEfectivoSheet from "./NuevoPagoEfectivoSheet";
import EditarPagoEfectivoSheet from "./EditarPagoEfectivoSheet";
import ConfirmarEliminarPagoModal from "./ConfirmarEliminarPagoModal";
import DetallesPagoModal from "./DetallesPagoModal";

const PagosEfectivo = ({ clienteId }) => {
  const {
    pagos,
    getPagos,
    registrarPagoEfectivo,
    updatePago,
    deletePago,
    isLoading,
    error,
  } = useCliente();

  const { cashBoxes, getCashBoxes, isLoading: cashBoxLoading } = useCashBox();

  // Los pagos ya vienen filtrados como pagos en efectivo
  const pagosEfectivo = pagos || [];

  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (clienteId) {
      getPagos(clienteId);
    }
    // Cargar cajas disponibles
    getCashBoxes({ isActive: true });
  }, [clienteId]);

  const handleDeletePago = async (pagoId) => {
    try {
      const result = await deletePago(pagoId);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setSelectedPago(null);
        getPagos(clienteId);
      }
    } catch (error) {
      console.error("Error deleting pago:", error);
    }
  };

  const openDeleteModal = (pago) => {
    setSelectedPago(pago);
    setIsDeleteModalOpen(true);
  };

  const openDetailsModal = (pago) => {
    setSelectedPago(pago);
    setIsDetailsModalOpen(true);
  };

  const openEditSheet = (pago) => {
    setSelectedPago(pago);
    setIsEditSheetOpen(true);
  };

  const handleEditSuccess = () => {
    getPagos(clienteId);
  };

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

  const filteredPagos = pagosEfectivo.filter((pago) => {
    const matchesSearch =
      pago.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.recibo?.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Todos los pagos en efectivo se consideran ingresos
  const totalIngresos = filteredPagos.reduce(
    (sum, pago) => sum + (pago.monto || 0),
    0
  );

  const totalEgresos = 0;

  const saldoNeto = totalIngresos - totalEgresos;
  const cantidadIngresos = filteredPagos.length;
  const cantidadEgresos = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Banknote className="h-6 w-6" />
            Pagos en Efectivo
          </h2>
          <p className="text-muted-foreground">
            Gestiona los pagos en efectivo del cliente
          </p>
        </div>
        <NuevoPagoEfectivoSheet
          clienteId={clienteId}
          onSuccess={() => getPagos(clienteId)}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Ingresos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIngresos)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cantidadIngresos} movimiento(s)
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Egresos
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalEgresos)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cantidadEgresos} movimiento(s)
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Saldo Neto
                </p>
                <p
                  className={`text-2xl font-bold ${
                    saldoNeto >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(saldoNeto)}
                </p>
              </div>
              <DollarSign
                className={`h-8 w-8 ${
                  saldoNeto >= 0 ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Movimientos
                </p>
                <p className="text-2xl font-bold">{filteredPagos.length}</p>
              </div>
              <Banknote className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por concepto, recibo u observaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos en Efectivo</CardTitle>
          <CardDescription>
            {filteredPagos.length} movimiento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando pagos...</p>
            </div>
          ) : filteredPagos.length === 0 ? (
            <div className="text-center py-8">
              <Banknote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No se encontraron movimientos en efectivo
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Caja</TableHead>
                  <TableHead>Recibo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPagos.map((pago) => (
                  <TableRow key={pago._id}>
                    <TableCell>{formatDate(pago.fecha)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pago.concepto}</div>
                        {pago.facturaRelacionada && (
                          <div className="text-sm text-muted-foreground">
                            Factura: {pago.facturaRelacionada}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pago.caja?.nombre ? (
                        <Badge variant="secondary">{pago.caja.nombre}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Sin caja
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {pago.recibo?.numero && (
                        <Badge variant="outline">{pago.recibo.numero}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-black">
                        +{formatCurrency(pago.monto)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditSheet(pago)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDetailsModal(pago)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Receipt className="mr-2 h-4 w-4" />
                            Imprimir Recibo
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(pago)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Sheet de Edición */}
      <EditarPagoEfectivoSheet
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        pago={selectedPago}
        clienteId={clienteId}
        onSuccess={handleEditSuccess}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmarEliminarPagoModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        pago={selectedPago}
        onConfirm={handleDeletePago}
        isLoading={isLoading}
      />

      {/* Modal de Detalles */}
      <DetallesPagoModal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        pago={selectedPago}
      />
    </div>
  );
};

export default PagosEfectivo;
