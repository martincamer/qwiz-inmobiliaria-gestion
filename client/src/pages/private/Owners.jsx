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
  DialogTrigger,
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
  Users,
  Building,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
} from "lucide-react";
import { useOwners } from "@/contexts/OwnersContext";
import CreateOwnerModal from "@/components/modals/CreateOwnerModal";
import EditOwnerModal from "@/components/modals/EditOwnerModal";
import ViewOwnerModal from "@/components/modals/ViewOwnerModal";
import { toast } from "sonner";

const Owners = () => {
  const {
    owners,
    isLoading,
    error,
    pagination,
    filters,
    getOwners,
    deleteOwner,
    updateFilters,
    updatePagination,
    clearError,
  } = useOwners();

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    activo: "all",
    tipoIdentificacion: "all",
  });

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
  }, []);

  // Manejar búsqueda
  const handleSearch = () => {
    const filtersToSend = {
      ...localFilters,
      activo: localFilters.activo === "all" ? "" : localFilters.activo,
      tipoIdentificacion:
        localFilters.tipoIdentificacion === "all"
          ? ""
          : localFilters.tipoIdentificacion,
    };
    updateFilters(filtersToSend);
    updatePagination({ ...pagination, currentPage: 1 });
  };

  // Limpiar filtros
  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      activo: "all",
      tipoIdentificacion: "all",
    };
    const filtersToSend = {
      search: "",
      activo: "",
      tipoIdentificacion: "",
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
    if (!ownerToDelete) return;

    try {
      const result = await deleteOwner(ownerToDelete._id);
      if (result.success) {
        toast.success("Propietario eliminado exitosamente");
        setShowDeleteDialog(false);
        setOwnerToDelete(null);
        // Recargar la lista
        getOwners();
      } else {
        toast.error(result.error || "Error al eliminar propietario");
      }
    } catch (error) {
      toast.error("Error al eliminar propietario");
    }
  };

  // Abrir modal de edición
  const openEditModal = (owner) => {
    setSelectedOwner(owner);
    setShowEditModal(true);
  };

  // Abrir modal de vista
  const openViewModal = (owner) => {
    setSelectedOwner(owner);
    setShowViewModal(true);
  };

  // Abrir diálogo de eliminación
  const openDeleteDialog = (owner) => {
    setOwnerToDelete(owner);
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

  // Obtener badge de estado
  const getStatusBadge = (activo) => {
    return activo ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Inactivo
      </Badge>
    );
  };

  // Obtener badge de tipo de identificación
  const getIdTypeBadge = (tipo) => {
    const colors = {
      DNI: "bg-blue-100 text-blue-800",
      CUIT: "bg-purple-100 text-purple-800",
      CUIL: "bg-orange-100 text-orange-800",
      RAZON_SOCIAL: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        variant="outline"
        className={colors[tipo] || "bg-gray-100 text-gray-800"}
      >
        {tipo}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propietarios</h1>
          <p className="text-muted-foreground">
            Gestiona los propietarios de inmuebles
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Propietario
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Nombre, email, identificación..."
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
                value={localFilters.activo}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, activo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Identificación</Label>
              <Select
                value={localFilters.tipoIdentificacion}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    tipoIdentificacion: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="CUIT">CUIT</SelectItem>
                  <SelectItem value="CUIL">CUIL</SelectItem>
                  <SelectItem value="RAZON_SOCIAL">Razón Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
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

      {/* Tabla de Propietarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Propietarios</CardTitle>
          <CardDescription>
            {pagination.totalItems} propietarios encontrados
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
                Error al cargar propietarios
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => getOwners()} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : owners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No hay propietarios
              </h3>
              <p className="text-gray-600 mb-4">
                No se encontraron propietarios con los filtros aplicados
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Propietario
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Identificación</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Propiedades</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {owners.map((owner) => (
                      <TableRow key={owner._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {owner.nombre} {owner.apellido}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {owner.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getIdTypeBadge(owner.tipoIdentificacion)}
                            <span className="text-sm text-muted-foreground">
                              {owner.numeroIdentificacion}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {owner.telefono && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {owner.telefono}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {owner.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {owner.estadisticas?.totalPropiedades || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(owner.activo)}</TableCell>
                        <TableCell>{formatDate(owner.fechaRegistro)}</TableCell>
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
                                onClick={() => openViewModal(owner)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditModal(owner)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(owner)}
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
                    de {pagination.totalItems} propietarios
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
      <CreateOwnerModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false);
          getOwners();
        }}
      />

      {selectedOwner && (
        <>
          <EditOwnerModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            owner={selectedOwner}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedOwner(null);
              getOwners();
            }}
          />

          <ViewOwnerModal
            open={showViewModal}
            onOpenChange={setShowViewModal}
            owner={selectedOwner}
            onClose={() => {
              setShowViewModal(false);
              setSelectedOwner(null);
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
              ¿Estás seguro de que deseas eliminar al propietario{" "}
              <strong>
                {ownerToDelete?.nombre} {ownerToDelete?.apellido}
              </strong>
              ? Esta acción no se puede deshacer.
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

export default Owners;
