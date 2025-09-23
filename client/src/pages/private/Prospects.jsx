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
  User,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useProspects } from "@/contexts/ProspectsContext";
import { toast } from "sonner";
import CreateProspectModal from "@/components/modals/CreateProspectModal";
import EditProspectModal from "@/components/modals/EditProspectModal";
import ViewProspectModal from "@/components/modals/ViewProspectModal";

const Prospects = () => {
  const {
    prospects,
    isLoading,
    error,
    pagination,
    filters,
    getProspects,
    deleteProspect,
    updateFilters,
    updatePagination,
    clearError,
  } = useProspects();

  const [selectedProspect, setSelectedProspect] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [prospectToDelete, setProspectToDelete] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    status: "all",
    source: "all",
    priority: "all",
    startDate: "",
    endDate: "",
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
      source: localFilters.source === "all" ? "" : localFilters.source,
      priority: localFilters.priority === "all" ? "" : localFilters.priority,
    };
    updateFilters(filtersToSend);
    updatePagination({ ...pagination, currentPage: 1 });
  };

  // Limpiar filtros
  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      status: "all",
      source: "all",
      priority: "all",
      startDate: "",
      endDate: "",
    };
    const filtersToSend = {
      search: "",
      status: "",
      source: "",
      priority: "",
      startDate: "",
      endDate: "",
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
    if (!prospectToDelete) return;

    try {
      const result = await deleteProspect(prospectToDelete._id);
      if (result.success) {
        toast.success("Prospecto eliminado exitosamente");
        setShowDeleteDialog(false);
        setProspectToDelete(null);
        // Recargar la lista
        getProspects();
      } else {
        toast.error(result.error || "Error al eliminar prospecto");
      }
    } catch (error) {
      toast.error("Error al eliminar prospecto");
    }
  };

  // Abrir modal de edición
  const openEditModal = (prospect) => {
    setSelectedProspect(prospect);
    setShowEditModal(true);
  };

  // Abrir modal de vista
  const openViewModal = (prospect) => {
    setSelectedProspect(prospect);
    setShowViewModal(true);
  };

  // Abrir diálogo de eliminación
  const openDeleteDialog = (prospect) => {
    setProspectToDelete(prospect);
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

  // Obtener badge de estado
  const getStatusBadge = (status) => {
    const statusConfig = {
      Nuevo: {
        variant: "default",
        className: "bg-blue-100 text-blue-800",
        icon: Star,
      },
      Contactado: {
        variant: "default",
        className: "bg-yellow-100 text-yellow-800",
        icon: Phone,
      },
      Calificado: {
        variant: "default",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      Propuesta: {
        variant: "default",
        className: "bg-purple-100 text-purple-800",
        icon: AlertCircle,
      },
      Negociación: {
        variant: "default",
        className: "bg-orange-100 text-orange-800",
        icon: Clock,
      },
      Cerrado: {
        variant: "default",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      Perdido: {
        variant: "secondary",
        className: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.Nuevo;
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

  // Obtener badge de origen
  const getSourceBadge = (source) => {
    const sourceConfig = {
      Web: { className: "bg-blue-100 text-blue-800" },
      Referido: { className: "bg-green-100 text-green-800" },
      "Redes Sociales": { className: "bg-purple-100 text-purple-800" },
      Publicidad: { className: "bg-orange-100 text-orange-800" },
      Llamada: { className: "bg-yellow-100 text-yellow-800" },
      Email: { className: "bg-gray-100 text-gray-800" },
      Otro: { className: "bg-gray-100 text-gray-800" },
    };

    const config = sourceConfig[source] || sourceConfig.Otro;

    return (
      <Badge variant="outline" className={config.className}>
        {source}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prospectos</h1>
          <p className="text-muted-foreground">
            Gestiona tus prospectos y oportunidades de venta
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Prospecto
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
                placeholder="Nombre, email, teléfono..."
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
                  <SelectItem value="Nuevo">Nuevo</SelectItem>
                  <SelectItem value="Contactado">Contactado</SelectItem>
                  <SelectItem value="Calificado">Calificado</SelectItem>
                  <SelectItem value="Propuesta">Propuesta</SelectItem>
                  <SelectItem value="Negociación">Negociación</SelectItem>
                  <SelectItem value="Cerrado">Cerrado</SelectItem>
                  <SelectItem value="Perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Origen</Label>
              <Select
                value={localFilters.source}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, source: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los orígenes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los orígenes</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Referido">Referido</SelectItem>
                  <SelectItem value="Redes Sociales">Redes Sociales</SelectItem>
                  <SelectItem value="Publicidad">Publicidad</SelectItem>
                  <SelectItem value="Llamada">Llamada</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select
                value={localFilters.priority}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
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

      {/* Tabla de Prospectos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Prospectos</CardTitle>
          <CardDescription>
            {pagination.totalItems} prospectos encontrados
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
                Error al cargar prospectos
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => getProspects()} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : prospects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No hay prospectos
              </h3>
              <p className="text-gray-600 mb-4">
                No se encontraron prospectos con los filtros aplicados
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Prospecto
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prospecto</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Origen</TableHead>
                      <TableHead>Interés</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prospects.map((prospect) => (
                      <TableRow key={prospect._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {prospect.nombre} {prospect.apellido}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              {prospect.tipoCliente || "Cliente"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {prospect.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {prospect.telefono || "No especificado"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(prospect.estado)}</TableCell>
                        <TableCell>
                          {getPriorityBadge(prospect.prioridad)}
                        </TableCell>
                        <TableCell>{getSourceBadge(prospect.origen)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {prospect.tipoPropiedad || "No especificado"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {prospect.presupuestoMax
                                ? `Hasta $${prospect.presupuestoMax.toLocaleString()}`
                                : "Sin presupuesto"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(prospect.fechaRegistro)}
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
                                onClick={() => openViewModal(prospect)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditModal(prospect)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(prospect)}
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
                    de {pagination.totalItems} prospectos
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
      <CreateProspectModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false);
          getProspects();
        }}
      />

      <EditProspectModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        prospect={selectedProspect}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedProspect(null);
          getProspects();
        }}
      />

      <ViewProspectModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        prospect={selectedProspect}
        onEdit={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
      />

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este prospecto? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
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

export default Prospects;
