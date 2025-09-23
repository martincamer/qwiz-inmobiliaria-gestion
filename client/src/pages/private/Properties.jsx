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
  Building,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Car,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Home,
} from "lucide-react";
import { useProperties } from "@/contexts/PropertiesContext";
import { toast } from "sonner";
import CreatePropertyModal from "@/components/modals/CreatePropertyModal";
import EditPropertyModal from "@/components/modals/EditPropertyModal";
import ViewPropertyModal from "@/components/modals/ViewPropertyModal";

const Properties = () => {
  const {
    properties,
    isLoading,
    error,
    pagination,
    filters,
    getProperties,
    deleteProperty,
    updateFilters,
    updatePagination,
    clearError,
  } = useProperties();

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
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
      type: localFilters.type === "all" ? "" : localFilters.type,
      bedrooms: localFilters.bedrooms === "all" ? "" : localFilters.bedrooms,
      bathrooms: localFilters.bathrooms === "all" ? "" : localFilters.bathrooms,
    };
    updateFilters(filtersToSend);
    updatePagination({ ...pagination, currentPage: 1 });
  };

  // Limpiar filtros
  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      status: "all",
      type: "all",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "all",
      bathrooms: "all",
    };
    const filtersToSend = {
      search: "",
      status: "",
      type: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
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
    if (!propertyToDelete) return;

    try {
      const result = await deleteProperty(propertyToDelete._id);
      if (result.success) {
        toast.success("Propiedad eliminada exitosamente");
        setShowDeleteDialog(false);
        setPropertyToDelete(null);
        // Recargar la lista
        getProperties();
      } else {
        toast.error(result.error || "Error al eliminar propiedad");
      }
    } catch (error) {
      toast.error("Error al eliminar propiedad");
    }
  };

  // Abrir modal de edición
  const openEditModal = (property) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  };

  // Abrir modal de vista
  const openViewModal = (property) => {
    setSelectedProperty(property);
    setShowViewModal(true);
  };

  // Abrir diálogo de eliminación
  const openDeleteDialog = (property) => {
    setPropertyToDelete(property);
    setShowDeleteDialog(true);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
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
      Venta: { variant: "default", className: "bg-blue-100 text-blue-800" },
      Alquiler: {
        variant: "default",
        className: "bg-green-100 text-green-800",
      },
      Alquilado: {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-800",
      },
      Vendido: { variant: "secondary", className: "bg-gray-100 text-gray-800" },
      Reservado: {
        variant: "secondary",
        className: "bg-purple-100 text-purple-800",
      },
    };

    const config = statusConfig[status] || statusConfig.Venta;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  // Obtener badge de tipo
  const getTypeBadge = (type) => {
    const typeConfig = {
      Casa: { className: "bg-green-100 text-green-800" },
      Departamento: { className: "bg-blue-100 text-blue-800" },
      Local: { className: "bg-purple-100 text-purple-800" },
      Terreno: { className: "bg-orange-100 text-orange-800" },
      Oficina: { className: "bg-indigo-100 text-indigo-800" },
      Pozo: { className: "bg-red-100 text-red-800" },
      Otro: { className: "bg-gray-100 text-gray-800" },
    };

    const config = typeConfig[type] || typeConfig.Otro;

    return (
      <Badge variant="outline" className={config.className}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propiedades</h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de propiedades
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Propiedad
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
                placeholder="Título, dirección, descripción..."
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
                  <SelectItem value="Venta">Venta</SelectItem>
                  <SelectItem value="Alquiler">Alquiler</SelectItem>
                  <SelectItem value="Alquilado">Alquilado</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                  <SelectItem value="Reservado">Reservado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={localFilters.type}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Departamento">Departamento</SelectItem>
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                  <SelectItem value="Oficina">Oficina</SelectItem>
                  <SelectItem value="Pozo">Pozo</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="Ciudad..."
                value={localFilters.city}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, city: e.target.value })
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
            <div className="space-y-2">
              <Label>Dormitorios</Label>
              <Select
                value={localFilters.bedrooms}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, bedrooms: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cualquier cantidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier cantidad</SelectItem>
                  <SelectItem value="0">Sin dormitorios</SelectItem>
                  <SelectItem value="1">1 dormitorio</SelectItem>
                  <SelectItem value="2">2 dormitorios</SelectItem>
                  <SelectItem value="3">3 dormitorios</SelectItem>
                  <SelectItem value="4">4+ dormitorios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
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

      {/* Tabla de Propiedades */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Propiedades</CardTitle>
          <CardDescription>
            {pagination.totalItems} propiedades encontradas
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
                Error al cargar propiedades
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => getProperties()} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Home className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No hay propiedades
              </h3>
              <p className="text-gray-600 mb-4">
                No se encontraron propiedades con los filtros aplicados
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Propiedad
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propiedad</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Características</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {property.title}
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                              {getTypeBadge(property.type)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              {property.address}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {property.city}, {property.province}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3 text-sm">
                              {property.characteristics?.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bed className="h-3 w-3" />
                                  {property.characteristics.bedrooms}
                                </div>
                              )}
                              {property.characteristics?.bathrooms > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bath className="h-3 w-3" />
                                  {property.characteristics.bathrooms}
                                </div>
                              )}
                              {property.characteristics?.garages > 0 && (
                                <div className="flex items-center gap-1">
                                  <Car className="h-3 w-3" />
                                  {property.characteristics.garages}
                                </div>
                              )}
                            </div>
                            {property.characteristics?.totalArea && (
                              <span className="text-sm text-muted-foreground">
                                {property.characteristics.totalArea} m²
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-medium">
                                {property.status === "Venta" ||
                                property.status === "Vendido"
                                  ? formatPrice(
                                      property.pricing?.salePrice,
                                      property.pricing?.currency
                                    )
                                  : formatPrice(
                                      property.pricing?.rentPrice,
                                      property.pricing?.currency
                                    )}
                              </span>
                            </div>
                            {property.pricing?.expenses > 0 && (
                              <span className="text-sm text-muted-foreground">
                                +{" "}
                                {formatPrice(
                                  property.pricing.expenses,
                                  property.pricing?.currency
                                )}{" "}
                                exp.
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(property.status)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {property.owner?.nombre}{" "}
                              {property.owner?.apellido}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {property.owner?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(property.createdAt)}</TableCell>
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
                                onClick={() => openViewModal(property)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditModal(property)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(property)}
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
                    de {pagination.totalItems} propiedades
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
      <CreatePropertyModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false);
          getProperties();
        }}
      />

      {selectedProperty && (
        <>
          <EditPropertyModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            property={selectedProperty}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedProperty(null);
              getProperties();
            }}
          />

          <ViewPropertyModal
            open={showViewModal}
            onOpenChange={setShowViewModal}
            property={selectedProperty}
            onClose={() => {
              setShowViewModal(false);
              setSelectedProperty(null);
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
              ¿Estás seguro de que deseas eliminar la propiedad{" "}
              <strong>{propertyToDelete?.title}</strong>? Esta acción no se
              puede deshacer.
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

export default Properties;
