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
  FileText,
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
  CreditCard,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";
import NuevoPagoChequesSheet from "./NuevoPagoChequesSheet";
import EditarPagoChequesSheet from "./EditarPagoChequesSheet";
import DetallesPagoChequesModal from "./DetallesPagoChequesModal";
import ConfirmarEliminarPagoChequesModal from "./ConfirmarEliminarPagoChequesModal";

const PagosCheques = ({ clienteId }) => {
  const {
    pagos,
    getPagos,
    registrarPagoCheque,
    updatePago,
    deletePago,
    isLoading,
    error,
  } = useCliente();

  // Filtrar pagos con cheques
  const pagosCheques = pagos?.filter((pago) => pago.tipo === "cheque") || [];

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [formData, setFormData] = useState({
    tipoTransaccion: "ingreso",
    monto: 0,
    fecha: new Date().toISOString().split("T")[0],
    fechaVencimiento: "",
    fechaCobro: "",
    concepto: "",
    numeroCheque: "",
    banco: "",
    sucursal: "",
    cuentaCorriente: "",
    cuit: "",
    librador: "",
    endosado: false,
    endosatario: "",
    estado: "emitido",
    facturaRelacionada: "",
    observaciones: "",
    tipoCheque: "comun",
  });

  useEffect(() => {
    if (clienteId) {
      getPagos(clienteId);
    }
  }, [clienteId]);

  const handleCreatePago = async () => {
    try {
      const pagoData = {
        ...formData,
        monto: parseFloat(formData.monto) || 0,
      };

      const result = await registrarPagoCheque(clienteId, pagoData);
      if (result.success) {
        setIsCreateSheetOpen(false);
        resetForm();
        getPagos(clienteId);
      }
    } catch (error) {
      console.error("Error creating pago:", error);
    }
  };

  const handleEditPago = async () => {
    try {
      const result = await updatePago(selectedPago._id, formData);
      if (result.success) {
        setIsEditSheetOpen(false);
        setSelectedPago(null);
        resetForm();
        getPagos(clienteId);
      }
    } catch (error) {
      console.error("Error updating pago:", error);
    }
  };

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

  const openDetailsModal = (pago) => {
    setSelectedPago(pago);
    setIsDetailsModalOpen(true);
  };

  const openEditSheet = (pago) => {
    setSelectedPago(pago);
    setIsEditSheetOpen(true);
  };

  const openDeleteModal = (pago) => {
    setSelectedPago(pago);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      tipoTransaccion: "ingreso",
      monto: 0,
      fecha: new Date().toISOString().split("T")[0],
      fechaVencimiento: "",
      fechaCobro: "",
      concepto: "",
      numeroCheque: "",
      banco: "",
      sucursal: "",
      cuentaCorriente: "",
      cuit: "",
      librador: "",
      endosado: false,
      endosatario: "",
      estado: "emitido",
      facturaRelacionada: "",
      observaciones: "",
      tipoCheque: "comun",
    });
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

  const filteredPagos = pagosCheques.filter((pago) => {
    const matchesSearch =
      pago.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.numeroCheque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.banco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.librador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo =
      tipoFilter === "all" || pago.tipoTransaccion === tipoFilter;
    const matchesEstado =
      estadoFilter === "all" || pago.estado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const totalIngresos = filteredPagos
    .filter((p) => p.tipoTransaccion === "ingreso")
    .reduce((sum, pago) => sum + (pago.monto || 0), 0);

  const totalEgresos = filteredPagos
    .filter((p) => p.tipoTransaccion === "egreso")
    .reduce((sum, pago) => sum + (pago.monto || 0), 0);

  const saldoNeto = totalIngresos - totalEgresos;
  const pendientes = filteredPagos.filter((p) =>
    ["emitido", "entregado", "depositado"].includes(p.estado)
  ).length;
  const vencidos = filteredPagos.filter(
    (p) => isVencido(p.fechaVencimiento) && p.estado !== "cobrado"
  ).length;
  const cobrados = filteredPagos.filter((p) => p.estado === "cobrado").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Pagos con Cheques
          </h2>
          <p className="text-muted-foreground">
            Gestiona cheques comunes, diferidos y cancelatorios
          </p>
        </div>
        <Button onClick={() => setIsCreateSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cheque
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
                  Vencidos
                </p>
                <p className="text-2xl font-bold text-red-600">{vencidos}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cobrados
                </p>
                <p className="text-2xl font-bold text-green-600">{cobrados}</p>
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
                  placeholder="Buscar por concepto, número, banco, librador..."
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
                  <SelectItem value="emitido">Emitidos</SelectItem>
                  <SelectItem value="cobrado">Cobrados</SelectItem>
                  <SelectItem value="vencido">Vencidos</SelectItem>
                  <SelectItem value="rechazado">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Cheques */}
      <Card>
        <CardHeader>
          <CardTitle>Cheques</CardTitle>
          <CardDescription>
            {filteredPagos.length} cheque(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando cheques...</p>
            </div>
          ) : filteredPagos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron cheques</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Librador</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPagos.map((pago) => (
                  <TableRow
                    key={pago._id}
                    className={
                      isVencido(pago.fechaVencimiento) &&
                      pago.estado !== "cobrado"
                        ? "bg-red-50"
                        : ""
                    }
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{pago.numeroCheque}</div>
                        <div className="flex gap-1 mt-1">
                          {getTipoChequeBadge(pago.tipoCheque)}
                          {pago.endosado && (
                            <Badge variant="outline" className="text-xs">
                              Endosado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTipoBadge(pago.tipoTransaccion)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pago.concepto}</div>
                        {pago.facturaRelacionada && (
                          <div className="text-sm text-muted-foreground">
                            Fact: {pago.facturaRelacionada}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pago.librador}</div>
                        {pago.cuit && (
                          <div className="text-sm text-muted-foreground">
                            {pago.cuit}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">
                            {pago.banco}
                          </div>
                          {pago.sucursal && (
                            <div className="text-xs text-muted-foreground">
                              Suc: {pago.sucursal}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={
                          isVencido(pago.fechaVencimiento) &&
                          pago.estado !== "cobrado"
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {formatDate(pago.fechaVencimiento)}
                        {isVencido(pago.fechaVencimiento) &&
                          pago.estado !== "cobrado" && (
                            <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                              <AlertTriangle className="h-3 w-3" />
                              Vencido
                            </div>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          pago.tipoTransaccion === "ingreso"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {pago.tipoTransaccion === "ingreso" ? "+" : "-"}
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

      {/* Componentes Modales */}
      <NuevoPagoChequesSheet
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        clienteId={clienteId}
        onSuccess={() => {
          setIsCreateSheetOpen(false);
          // Aquí se podría agregar lógica para refrescar la lista
        }}
      />

      <EditarPagoChequesSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        pago={selectedPago}
        onSuccess={() => {
          setIsEditSheetOpen(false);
          setSelectedPago(null);
          // Aquí se podría agregar lógica para refrescar la lista
        }}
      />

      <DetallesPagoChequesModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPago(null);
        }}
        pago={selectedPago}
      />

      <ConfirmarEliminarPagoChequesModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPago(null);
        }}
        pago={selectedPago}
        onConfirm={handleDeletePago}
      />
    </div>
  );
};

export default PagosCheques;
