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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useSales } from "@/contexts/SalesContext";
import { toast } from "sonner";
import CreateSaleModal from "@/components/modals/CreateSaleModal";
import EditSaleModal from "@/components/modals/EditSaleModal";
import ViewSaleModal from "@/components/modals/ViewSaleModal";

const Sales = () => {
  const {
    sales,
    isLoading,
    error,
    pagination,
    filters,
    getSales,
    deleteSale,
    updateFilters,
    updatePagination,
    clearError,
  } = useSales();

  const [selectedSale, setSelectedSale] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    status: "all",
    property: "",
    prospect: "",
    owner: "",
    startDate: "",
    endDate: "",
    minPrice: "",
    maxPrice: "",
  });

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
  }, []);

  // Manejar búsqueda
  const handleSearch = () => {
    const filtersToSend = {
      ...localFilters,
      status: localFilters.status === "all" ? "" : localFilters.status,
    };
    updateFilters(filtersToSend);
    updatePagination({ ...pagination, currentPage: 1 });
  };

  // Limpiar filtros
  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      status: "all",
      property: "",
      prospect: "",
      owner: "",
      startDate: "",
      endDate: "",
      minPrice: "",
      maxPrice: "",
    };
    const filtersToSend = {
      search: "",
      status: "",
      property: "",
      prospect: "",
      owner: "",
      startDate: "",
      endDate: "",
      minPrice: "",
      maxPrice: "",
    };
    setLocalFilters(emptyFilters);
    updateFilters(filtersToSend);
    updatePagination({ ...pagination, currentPage: 1 });
  };

  // Manejar paginación
  const handlePageChange = (newPage) => {
    updatePagination({ ...pagination, currentPage: newPage });
  };

  // Manejar eliminación
  const handleDelete = async () => {
    if (!saleToDelete) return;

    try {
      const result = await deleteSale(saleToDelete._id);
      if (result.success) {
        toast.success("Venta eliminada exitosamente");
        setShowDeleteDialog(false);
        setSaleToDelete(null);
        // Recargar la lista
        getSales();
      } else {
        toast.error(result.error || "Error al eliminar venta");
      }
    } catch (error) {
      toast.error("Error al eliminar venta");
    }
  };

  // Abrir modal de edición
  const openEditModal = (sale) => {
    setSelectedSale(sale);
    setShowEditModal(true);
  };

  // Abrir modal de vista
  const openViewModal = (sale) => {
    setSelectedSale(sale);
    setShowViewModal(true);
  };

  // Abrir diálogo de eliminación
  const openDeleteDialog = (sale) => {
    setSaleToDelete(sale);
    setShowDeleteDialog(true);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Formatear precio
  const formatPrice = (price, currency = "ARS") => {
    if (!price) return "No especificado";

    const formatter = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return formatter.format(price);
  };

  // Obtener badge de estado
  const getStatusBadge = (status) => {
    const statusConfig = {
      Pendiente: {
        variant: "default",
        className: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      "En Proceso": {
        variant: "default",
        className: "bg-blue-100 text-blue-800",
        icon: AlertCircle,
      },
      Completada: {
        variant: "default",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      Cancelada: {
        variant: "secondary",
        className: "bg-red-100 text-red-800",
        icon: XCircle,
      },
      Pausada: {
        variant: "secondary",
        className: "bg-gray-100 text-gray-800",
        icon: AlertTriangle,
      },
    };

    const config = statusConfig[status] || statusConfig.Pendiente;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  // Obtener badge de prioridad
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      Alta: { className: "bg-red-100 text-red-800" },
      Media: { className: "bg-yellow-100 text-yellow-800" },
      Baja: { className: "bg-green-100 text-green-800" },
    };

    const config = priorityConfig[priority] || priorityConfig.Media;

    return (
      <Badge variant="outline" className={config.className}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
          <p className="text-muted-foreground">
            Gestiona el proceso de ventas y transacciones
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Venta
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Propiedad, prospecto, propietario..."
                value={localFilters.search}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, search: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={localFilters.status}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="Pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha Desde</Label>
              <Input
                id="startDate"
                type="date"
                value={localFilters.startDate}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha Hasta</Label>
              <Input
                id="endDate"
                type="date"
                value={localFilters.endDate}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, endDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPrice">Precio Mínimo</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={localFilters.minPrice}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, minPrice: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Precio Máximo</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Sin límite"
                value={localFilters.maxPrice}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, maxPrice: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button
                variant="secondary"
                onClick={handleSearch}
                className="flex-1"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ventas</CardTitle>
          <CardDescription>
            {pagination.totalItems} ventas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                Error al cargar ventas
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => getSales()} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No hay ventas
              </h3>
              <p className="text-gray-600 mb-4">
                No se encontraron ventas con los filtros aplicados
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Venta
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propiedad</TableHead>
                      <TableHead>Prospecto</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {sale.property?.title ||
                                "Propiedad no especificada"}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Building className="h-3 w-3" />
                              {sale.property?.type || "Tipo no especificado"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {sale.prospect?.nombre} {sale.prospect?.apellido}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {sale.prospect?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {sale.owner?.nombre} {sale.owner?.apellido}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {sale.owner?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span className="font-medium">
                              {formatPrice(sale.price, sale.currency)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell>{getPriorityBadge(sale.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(sale.startDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(sale.expectedCloseDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openViewModal(sale)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditModal(sale)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(sale)}
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
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando{" "}
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                    a{" "}
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      pagination.totalItems
                    )}{" "}
                    de {pagination.totalItems} ventas
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Página</span>
                      <span className="text-sm font-medium">
                        {pagination.currentPage} de {pagination.totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <CreateSaleModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false);
          getSales();
        }}
      />

      {selectedSale && (
        <>
          <EditSaleModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            sale={selectedSale}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedSale(null);
              getSales();
            }}
          />

          <ViewSaleModal
            open={showViewModal}
            onOpenChange={setShowViewModal}
            sale={selectedSale}
            onClose={() => {
              setShowViewModal(false);
              setSelectedSale(null);
            }}
          />
        </>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta venta? Esta acción no se
              puede deshacer y se perderán todos los datos asociados.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
