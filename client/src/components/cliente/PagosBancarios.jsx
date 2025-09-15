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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  CreditCard,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  X,
  Download,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";
import NuevoPagoBancarioSheet from "./NuevoPagoBancarioSheet";
import EditarPagoBancarioSheet from "./EditarPagoBancarioSheet";
import ConfirmarEliminarPagoBancarioModal from "./ConfirmarEliminarPagoBancarioModal";
import DetallesPagoBancarioModal from "./DetallesPagoBancarioModal";

const PagosBancarios = ({ clienteId }) => {
  const {
    pagos,
    getPagos,
    registrarPagoBancario,
    updatePago,
    deletePago,
    isLoading,
    error,
  } = useCliente();

  // Filtrar pagos bancarios
  const pagosBancarios =
    pagos?.filter((pago) => 
      pago.tipo === "transferencia" || 
      pago.tipo === "deposito" || 
      pago.tipo === "debito" || 
      pago.tipo === "credito" ||
      pago.tipo === "debito_tarjeta"
    ) || [];

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");

  useEffect(() => {
    if (clienteId) {
      getPagos(clienteId);
    }
  }, [clienteId]);

  const handlePagoSuccess = () => {
    getPagos(clienteId);
  };

  const handleDeletePago = () => {
    setIsDeleteModalOpen(false);
    setSelectedPago(null);
    getPagos(clienteId);
  };

  const openEditSheet = (pago) => {
    setSelectedPago(pago);
    setIsEditSheetOpen(true);
  };

  const openDeleteModal = (pago) => {
    setSelectedPago(pago);
    setIsDeleteModalOpen(true);
  };

  const openDetailsModal = (pago) => {
    setSelectedPago(pago);
    setIsDetailsModalOpen(true);
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
      debito: { variant: "secondary", label: "Débito" },
      credito: { variant: "default", label: "Crédito" },
      deposito: { variant: "outline", label: "Depósito" },
      debito_tarjeta: { variant: "secondary", label: "Tarjeta de Débito" },
    };

    const config = metodoConfig[metodo] || metodoConfig.transferencia;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredPagos = pagosBancarios.filter((pago) => {
    const matchesSearch =
      pago.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.numeroOperacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.banco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "all" || pago.tipo === tipoFilter;
    const matchesEstado =
      estadoFilter === "all" || pago.estado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const totalIngresos = filteredPagos
    .filter((p) => p.tipo === "ingreso")
    .reduce((sum, pago) => sum + (pago.monto || 0), 0);

  const totalEgresos = filteredPagos
    .filter((p) => p.tipo === "egreso")
    .reduce((sum, pago) => sum + (pago.monto || 0), 0);

  const saldoNeto = totalIngresos - totalEgresos;
  const pendientes = filteredPagos.filter(
    (p) => p.estado === "pendiente"
  ).length;
  const acreditados = filteredPagos.filter(
    (p) => p.estado === "acreditado"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Pagos Bancarios
          </h2>
          <p className="text-muted-foreground">
            Gestiona transferencias, débitos y créditos bancarios
          </p>
        </div>
        <Button onClick={() => setIsCreateSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pago Bancario
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendientes}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Acreditados
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {acreditados}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                  placeholder="Buscar por concepto, operación, banco..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ingreso">Ingresos</SelectItem>
                  <SelectItem value="egreso">Egresos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="acreditado">Acreditados</SelectItem>
                  <SelectItem value="rechazado">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos Bancarios</CardTitle>
          <CardDescription>
            {filteredPagos.length} movimiento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">
                Cargando pagos bancarios...
              </p>
            </div>
          ) : filteredPagos.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No se encontraron movimientos bancarios
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPagos.map((pago) => (
                  <TableRow key={pago._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatDate(pago.fecha)}
                        </div>
                        {pago.fechaAcreditacion && (
                          <div className="text-sm text-muted-foreground">
                            Acred: {formatDate(pago.fechaAcreditacion)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getTipoBadge(pago.tipoTransaccion)}</TableCell>
                    <TableCell>{getMetodoBadge(pago.tipo)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pago.concepto}</div>
                        {pago.numeroOperacion && (
                          <div className="text-sm text-muted-foreground">
                            Op: {pago.numeroOperacion}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {pago.banco || "No especificado"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          pago.tipo === "ingreso"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {pago.tipo === "ingreso" ? "+" : "-"}
                        {formatCurrency(pago.monto)}
                      </span>
                    </TableCell>
                    <TableCell>{getEstadoBadge(pago.estado)}</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => openDetailsModal(pago)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar
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

      {/* Componentes */}
      <NuevoPagoBancarioSheet
        isOpen={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        clienteId={clienteId}
        onSuccess={handlePagoSuccess}
      />

      <EditarPagoBancarioSheet
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        pago={selectedPago}
        onSuccess={handlePagoSuccess}
      />

      <ConfirmarEliminarPagoBancarioModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        pago={selectedPago}
        onSuccess={handleDeletePago}
      />

      <DetallesPagoBancarioModal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        pago={selectedPago}
      />
    </div>
  );
};

export default PagosBancarios;
