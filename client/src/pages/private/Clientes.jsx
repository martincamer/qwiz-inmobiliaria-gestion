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
import { Badge } from "@/components/ui/badge";
import SheetCrearCliente from "../../components/cliente/SheetCrearCliente";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Clientes = () => {
  const { user } = useAuth();
  const {
    clientes,
    isLoading,
    error,
    pagination,
    getClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    clearError,
  } = useCliente();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipoPersona, setFilterTipoPersona] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Form state

  useEffect(() => {
    loadClientes();
  }, [currentPage, filterTipoPersona, filterEstado, searchTerm]);

  const loadClientes = async () => {
    const params = {
      page: currentPage,
      limit: 10,
    };

    if (searchTerm) params.search = searchTerm;
    if (filterTipoPersona !== "all") params.tipoPersona = filterTipoPersona;
    if (filterEstado !== "all") params.estado = filterEstado;

    await getClientes(params);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      try {
        const result = await deleteCliente(id);
        if (result.success) {
          loadClientes();
        }
      } catch (error) {
        console.error("Error deleting cliente:", error);
      }
    }
  };

  const getStatsData = () => {
    const total = clientes.length;
    const fisicas = clientes.filter((c) => c.tipoPersona === "fisica").length;
    const juridicas = clientes.filter(
      (c) => c.tipoPersona === "juridica"
    ).length;
    const activos = clientes.filter((c) => c.estado === "activo").length;

    return { total, fisicas, juridicas, activos };
  };

  const stats = getStatsData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case "activo":
        return "default";
      case "inactivo":
        return "secondary";
      case "suspendido":
        return "destructive";
      case "moroso":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading && clientes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8" />
            Gestión de Clientes
          </h1>
          <p className="text-muted-foreground">
            Administra tu cartera de clientes y sus datos comerciales
          </p>
        </div>
        <SheetCrearCliente />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Clientes registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Personas Físicas
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fisicas}</div>
            <p className="text-xs text-muted-foreground">Individuos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Personas Jurídicas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.juridicas}</div>
            <p className="text-xs text-muted-foreground">Empresas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activos}</div>
            <p className="text-xs text-muted-foreground">Clientes activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, DNI, CUIT o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filterTipoPersona}
              onValueChange={setFilterTipoPersona}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="fisica">Personas Físicas</SelectItem>
                <SelectItem value="juridica">Personas Jurídicas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
                <SelectItem value="suspendido">Suspendidos</SelectItem>
                <SelectItem value="moroso">Morosos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clientes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {pagination.totalItems} cliente
            {pagination.totalItems !== 1 ? "s" : ""} encontrado
            {pagination.totalItems !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay clientes</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                filterTipoPersona !== "all" ||
                filterEstado !== "all"
                  ? "No se encontraron clientes con los filtros aplicados"
                  : "Aún no has registrado ningún cliente"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {cliente.nombreCompleto}
                          </div>
                          {cliente.tipoPersona === "juridica" &&
                            cliente.razonSocial && (
                              <div className="text-sm text-muted-foreground">
                                {cliente.razonSocial}
                              </div>
                            )}
                          <div className="text-sm text-muted-foreground">
                            {cliente.tipoPersona === "fisica"
                              ? `DNI: ${cliente.dni}`
                              : `CUIT: ${cliente.datosFiscales?.cuit || "N/A"}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {cliente.tipoPersona === "fisica"
                            ? "Persona Física"
                            : "Persona Jurídica"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {cliente.contacto?.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {cliente.contacto.email}
                            </div>
                          )}
                          {cliente.contacto?.celular && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {cliente.contacto.celular}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(cliente.estado)}>
                          {cliente.estado.charAt(0).toUpperCase() +
                            cliente.estado.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`font-medium ${
                            cliente.saldoActual > 0
                              ? "text-red-600"
                              : cliente.saldoActual < 0
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatCurrency(cliente.saldoActual)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/customers/${cliente._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(cliente._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página {pagination.currentPage} de {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrevPage}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!pagination.hasNextPage}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
