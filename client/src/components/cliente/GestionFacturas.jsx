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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Receipt,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";
import NuevaFacturaSheet from "./NuevaFacturaSheet";
import EditarFacturaSheet from "./EditarFacturaSheet";
import ConfirmarEliminarFacturaModal from "./ConfirmarEliminarFacturaModal";
import DetallesFacturaModal from "./DetallesFacturaModal";

const GestionFacturas = ({ clienteId, facturas, onUpdate }) => {
  const { agregarFactura, updateFactura, deleteFactura, isLoading, error } =
    useCliente();

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  console.log(facturas);

  const handleFacturaSuccess = () => {
    // Llamar a onUpdate para actualizar los datos del cliente
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDeleteFactura = async (facturaId) => {
    try {
      const result = await deleteFactura(facturaId);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setSelectedFactura(null);
        // Llamar a onUpdate para actualizar los datos del cliente
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error("Error deleting factura:", error);
    }
  };

  const openEditSheet = (factura) => {
    setSelectedFactura(factura);
    setIsEditSheetOpen(true);
  };

  const openDeleteModal = (factura) => {
    setSelectedFactura(factura);
    setIsDeleteModalOpen(true);
  };

  const openDetailsModal = (factura) => {
    setSelectedFactura(factura);
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

  const filteredFacturas = facturas.filter((factura) => {
    const matchesSearch =
      factura.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || factura.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalFacturado = filteredFacturas.reduce(
    (sum, factura) => sum + (factura.total || 0),
    0
  );
  const facturasPendientes = filteredFacturas.filter(
    (f) => f.estado === "pendiente"
  ).length;
  const facturasPagadas = filteredFacturas.filter(
    (f) => f.estado === "pagada"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Gestión de Facturas
          </h2>
          <p className="text-muted-foreground">
            Administra las facturas del cliente
          </p>
        </div>
        <Button onClick={() => setIsCreateSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Factura
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Facturado
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalFacturado)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Facturas
                </p>
                <p className="text-2xl font-bold">{filteredFacturas.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
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
                  {facturasPendientes}
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
                  Pagadas
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {facturasPagadas}
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
                  placeholder="Buscar por número o observaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="pagada">Pagadas</SelectItem>
                  <SelectItem value="vencida">Vencidas</SelectItem>
                  <SelectItem value="anulada">Anuladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Facturas */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas del Cliente</CardTitle>
          <CardDescription>
            {filteredFacturas.length} factura(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando facturas...</p>
            </div>
          ) : filteredFacturas.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No se encontraron facturas
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacturas.map((factura) => (
                  <TableRow key={factura._id}>
                    <TableCell className="font-medium">
                      {factura.numero}
                    </TableCell>
                    <TableCell>{formatDate(factura.fecha)}</TableCell>
                    <TableCell>
                      {formatDate(factura.fechaVencimiento)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(factura.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(factura.estado)}</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => openEditSheet(factura)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDetailsModal(factura)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(factura)}
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

      {/* Componentes de Sheets y Modales */}
      <NuevaFacturaSheet
        isOpen={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        clienteId={clienteId}
        onSuccess={handleFacturaSuccess}
        isLoading={isLoading}
      />

      <EditarFacturaSheet
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        factura={selectedFactura}
        onSuccess={handleFacturaSuccess}
        isLoading={isLoading}
      />

      <ConfirmarEliminarFacturaModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        factura={selectedFactura}
        onConfirm={handleDeleteFactura}
        isLoading={isLoading}
      />

      <DetallesFacturaModal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        factura={selectedFactura}
      />
    </div>
  );
};

export default GestionFacturas;
