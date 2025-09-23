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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  AlertTriangle,
  Calendar,
  DollarSign,
  Home,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useTenants } from "@/contexts/TenantsContext";
import { toast } from "sonner";
import CreateTenantModal from "@/components/modals/CreateTenantModal";
import EditTenantModal from "@/components/modals/EditTenantModal";
import ViewTenantModal from "@/components/modals/ViewTenantModal";

const Tenants = () => {
  const {
    tenants,
    isLoading,
    error,
    pagination,
    filters,
    getTenants,
    deleteTenant,
    updateFilters,
    clearError,
    getTenantsStats,
  } = useTenants();

  console.log(tenants);

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");
  const [showFilters, setShowFilters] = useState(false);

  // Estados para estadísticas
  const [stats, setStats] = useState(null);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, []);

  // Cargar inquilinos cuando cambien los filtros
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter, pagination.currentPage]);

  const loadStats = async () => {
    const result = await getTenantsStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  const handleSearch = () => {
    const newFilters = {
      ...filters,
      search: searchTerm,
      status: statusFilter,
      page: 1,
    };
    updateFilters(newFilters);
    getTenants(newFilters);
  };

  const handlePageChange = (newPage) => {
    const newFilters = {
      ...filters,
      page: newPage,
    };
    updateFilters(newFilters);
    getTenants(newFilters);
  };

  const handleCreateTenant = () => {
    setShowCreateModal(true);
  };

  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowEditModal(true);
  };

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowViewModal(true);
  };

  const handleDeleteTenant = async (tenant) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar al inquilino ${
          tenant.name || tenant.nombre
        } ${tenant.apellido}?`
      )
    ) {
      const result = await deleteTenant(tenant._id);
      if (result.success) {
        toast.success("Inquilino eliminado exitosamente");
        // Recargar la lista
        getTenants(filters);
        loadStats();
      } else {
        toast.error(result.error || "Error al eliminar inquilino");
      }
    }
  };

  const handleRefresh = () => {
    getTenants(filters);
    loadStats();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      activo: {
        variant: "default",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Activo",
      },
      inactivo: {
        variant: "secondary",
        className: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Inactivo",
      },
      suspendido: {
        variant: "default",
        className: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Suspendido",
      },
    };

    const config = statusConfig[status] || statusConfig.activo;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-AR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inquilinos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los inquilinos de tus propiedades
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
          <Button onClick={handleCreateTenant}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Inquilino
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Inquilinos
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalInquilinos || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Activos
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.inquilinosActivos || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pagos Pendientes
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.pagosPendientes || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pagos Vencidos
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.pagosVencidos || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar inquilinos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status-filter">Estado</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los estados</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de inquilinos */}
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="animate-spin h-8 w-8 text-primary" />
              <span className="ml-2 text-muted-foreground">
                Cargando inquilinos...
              </span>
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No hay inquilinos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comienza agregando un nuevo inquilino.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreateTenant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Inquilino
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inquilino</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Propiedad</TableHead>
                  <TableHead>Alquiler</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {tenant.name || tenant.nombre} {tenant.apellido}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {tenant.email && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-3 w-3 mr-1" />
                            {tenant.email}
                          </div>
                        )}
                        {tenant.telefono && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            {tenant.telefono}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(tenant.propiedad || tenant.property) && (
                        <div className="flex items-center text-sm">
                          <Home className="h-3 w-3 mr-1 text-muted-foreground" />
                          {tenant.propiedad?.direccion ||
                            tenant.propiedad?.address ||
                            tenant.property?.address ||
                            tenant.property?.title ||
                            "Propiedad asignada"}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {tenant.montoAlquiler && (
                        <div className="font-medium">
                          {formatCurrency(tenant.montoAlquiler)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(tenant.status || tenant.estado)}
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
                          <DropdownMenuItem
                            onClick={() => handleViewTenant(tenant)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditTenant(tenant)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteTenant(tenant)}
                            className="text-destructive"
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

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <Card className="mt-6">
          <CardContent className="px-4 py-3 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Siguiente
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Mostrando{" "}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      pagination.totalItems
                    )}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium">{pagination.totalItems}</span>{" "}
                  resultados
                </p>
              </div>
              <div>
                <nav className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.currentPage) <= 2
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                        <Button
                          variant={
                            page === pagination.currentPage
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      <CreateTenantModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false);
          getTenants(filters);
          loadStats();
        }}
      />

      {showEditModal && selectedTenant && (
        <EditTenantModal
          isOpen={showEditModal}
          tenant={selectedTenant}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTenant(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedTenant(null);
            getTenants(filters);
            loadStats();
          }}
        />
      )}

      {showViewModal && selectedTenant && (
        <ViewTenantModal
          isOpen={showViewModal}
          tenant={selectedTenant}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTenant(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            setShowEditModal(true);
          }}
        />
      )}
    </div>
  );
};

export default Tenants;
