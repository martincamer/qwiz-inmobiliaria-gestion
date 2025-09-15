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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  FileText,
  Building2,
  User,
  Receipt,
} from "lucide-react";
import { useChequera } from "../../contexts/ChequeraContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Chequeras = () => {
  const { user } = useAuth();
  const {
    chequeras,
    isLoading,
    error,
    getChequeras,
    createChequera,
    updateChequera,
    deleteChequera,
  } = useChequera();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedChequera, setSelectedChequera] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    banco: "",
    tipo: "propia",
    titular: "",
    numeroCuenta: "",
    rangoDesde: "",
    rangoHasta: "",
    proximoNumero: "",
    observaciones: "",
  });

  useEffect(() => {
    getChequeras();
  }, []);

  const resetForm = () => {
    setFormData({
      nombre: "",
      banco: "",
      tipo: "propia",
      titular: "",
      numeroCuenta: "",
      rangoDesde: "",
      rangoHasta: "",
      proximoNumero: "",
      observaciones: "",
    });
  };

  const handleCreate = async () => {
    try {
      await createChequera(formData);
      setIsCreateDialogOpen(false);
      resetForm();
      getChequeras();
    } catch (error) {
      console.error("Error creating chequera:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await updateChequera(selectedChequera._id, formData);
      setIsEditDialogOpen(false);
      setSelectedChequera(null);
      resetForm();
      getChequeras();
    } catch (error) {
      console.error("Error updating chequera:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta chequera?")) {
      try {
        await deleteChequera(id);
        getChequeras();
      } catch (error) {
        console.error("Error deleting chequera:", error);
      }
    }
  };

  const openEditDialog = (chequera) => {
    setSelectedChequera(chequera);
    setFormData({
      nombre: chequera.nombre,
      banco: chequera.banco,
      tipo: chequera.tipo,
      titular: chequera.titular,
      numeroCuenta: chequera.numeroCuenta || "",
      rangoDesde: chequera.rangoDesde || "",
      rangoHasta: chequera.rangoHasta || "",
      proximoNumero: chequera.proximoNumero || "",
      observaciones: chequera.observaciones || "",
    });
    setIsEditDialogOpen(true);
  };

  const filteredChequeras = chequeras.filter((chequera) => {
    const matchesSearch = 
      chequera.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chequera.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chequera.titular.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || chequera.tipo === filterTipo;
    const matchesEstado = filterEstado === "all" || 
      (filterEstado === "active" && chequera.isActive) ||
      (filterEstado === "inactive" && !chequera.isActive);
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getStatsData = () => {
    const total = chequeras.length;
    const propias = chequeras.filter(c => c.tipo === 'propia').length;
    const terceros = chequeras.filter(c => c.tipo === 'terceros').length;
    const activas = chequeras.filter(c => c.isActive).length;
    
    return { total, propias, terceros, activas };
  };

  const stats = getStatsData();

  if (isLoading && chequeras.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando chequeras...</p>
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
            <CreditCard className="h-8 w-8" />
            Gestión de Chequeras
          </h1>
          <p className="text-muted-foreground">
            Administra tus chequeras propias y cheques de terceros
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Chequera
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Crear Nueva Chequera
              </DialogTitle>
              <DialogDescription>
                Configura una nueva chequera para gestionar tus cheques
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre" className="text-sm font-medium">
                    Nombre de la Chequera *
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ej: Chequera Principal"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="banco" className="text-sm font-medium">
                    Banco *
                  </Label>
                  <Input
                    id="banco"
                    value={formData.banco}
                    onChange={(e) => setFormData({...formData, banco: e.target.value})}
                    placeholder="Nombre del banco"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipo" className="text-sm font-medium">
                  Tipo de Chequera *
                </Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="propia">Chequera Propia</SelectItem>
                    <SelectItem value="terceros">Cheques de Terceros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="titular" className="text-sm font-medium">
                  Titular *
                </Label>
                <Input
                  id="titular"
                  value={formData.titular}
                  onChange={(e) => setFormData({...formData, titular: e.target.value})}
                  placeholder="Nombre del titular"
                />
              </div>

              {formData.tipo === 'propia' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="numeroCuenta" className="text-sm font-medium">
                      Número de Cuenta
                    </Label>
                    <Input
                      id="numeroCuenta"
                      value={formData.numeroCuenta}
                      onChange={(e) => setFormData({...formData, numeroCuenta: e.target.value})}
                      placeholder="Número de cuenta bancaria"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="rangoDesde" className="text-sm font-medium">
                        Rango Desde
                      </Label>
                      <Input
                        id="rangoDesde"
                        type="number"
                        value={formData.rangoDesde}
                        onChange={(e) => setFormData({...formData, rangoDesde: e.target.value})}
                        placeholder="1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rangoHasta" className="text-sm font-medium">
                        Rango Hasta
                      </Label>
                      <Input
                        id="rangoHasta"
                        type="number"
                        value={formData.rangoHasta}
                        onChange={(e) => setFormData({...formData, rangoHasta: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="proximoNumero" className="text-sm font-medium">
                        Próximo Número
                      </Label>
                      <Input
                        id="proximoNumero"
                        type="number"
                        value={formData.proximoNumero}
                        onChange={(e) => setFormData({...formData, proximoNumero: e.target.value})}
                        placeholder="1"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="observaciones" className="text-sm font-medium">
                  Observaciones
                </Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Observaciones adicionales"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!formData.nombre || !formData.banco || !formData.titular}
              >
                Crear Chequera
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <CardTitle className="text-sm font-medium">Total Chequeras</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Chequeras registradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chequeras Propias</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.propias}</div>
            <p className="text-xs text-muted-foreground">
              Para emitir cheques
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cheques Terceros</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.terceros}</div>
            <p className="text-xs text-muted-foreground">
              Cheques recibidos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activas}</div>
            <p className="text-xs text-muted-foreground">
              Chequeras en uso
            </p>
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
                  placeholder="Buscar por nombre, banco o titular..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="propia">Chequeras Propias</SelectItem>
                <SelectItem value="terceros">Cheques Terceros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Chequeras List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredChequeras.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay chequeras</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterTipo !== 'all' || filterEstado !== 'all' 
                ? 'No se encontraron chequeras con los filtros aplicados'
                : 'Aún no has creado ninguna chequera'
              }
            </p>
            {(!searchTerm && filterTipo === 'all' && filterEstado === 'all') && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Chequera
              </Button>
            )}
          </div>
        ) : (
          filteredChequeras.map((chequera) => (
            <Card key={chequera._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <CardTitle className="text-lg">{chequera.nombre}</CardTitle>
                  </div>
                  <Badge variant={chequera.isActive ? "default" : "secondary"}>
                    {chequera.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <CardDescription>
                  {chequera.banco} • {chequera.tipo === 'propia' ? 'Chequera Propia' : 'Cheques de Terceros'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Titular:</span>
                    <span className="font-medium">{chequera.titular}</span>
                  </div>
                  
                  {chequera.tipo === 'propia' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Próximo:</span>
                      <span className="font-medium">#{chequera.proximoNumero}</span>
                    </div>
                  )}
                  
                  {chequera.observaciones && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chequera.observaciones}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Link to={`/chequeras/${chequera._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(chequera)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(chequera._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Chequera
            </DialogTitle>
            <DialogDescription>
              Modifica los datos de la chequera seleccionada
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-nombre" className="text-sm font-medium">
                  Nombre de la Chequera *
                </Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Chequera Principal"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-banco" className="text-sm font-medium">
                  Banco *
                </Label>
                <Input
                  id="edit-banco"
                  value={formData.banco}
                  onChange={(e) => setFormData({...formData, banco: e.target.value})}
                  placeholder="Nombre del banco"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-tipo" className="text-sm font-medium">
                Tipo de Chequera *
              </Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="propia">Chequera Propia</SelectItem>
                  <SelectItem value="terceros">Cheques de Terceros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-titular" className="text-sm font-medium">
                Titular *
              </Label>
              <Input
                id="edit-titular"
                value={formData.titular}
                onChange={(e) => setFormData({...formData, titular: e.target.value})}
                placeholder="Nombre del titular"
              />
            </div>

            {formData.tipo === 'propia' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="edit-numeroCuenta" className="text-sm font-medium">
                    Número de Cuenta
                  </Label>
                  <Input
                    id="edit-numeroCuenta"
                    value={formData.numeroCuenta}
                    onChange={(e) => setFormData({...formData, numeroCuenta: e.target.value})}
                    placeholder="Número de cuenta bancaria"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-rangoDesde" className="text-sm font-medium">
                      Rango Desde
                    </Label>
                    <Input
                      id="edit-rangoDesde"
                      type="number"
                      value={formData.rangoDesde}
                      onChange={(e) => setFormData({...formData, rangoDesde: e.target.value})}
                      placeholder="1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-rangoHasta" className="text-sm font-medium">
                      Rango Hasta
                    </Label>
                    <Input
                      id="edit-rangoHasta"
                      type="number"
                      value={formData.rangoHasta}
                      onChange={(e) => setFormData({...formData, rangoHasta: e.target.value})}
                      placeholder="100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-proximoNumero" className="text-sm font-medium">
                      Próximo Número
                    </Label>
                    <Input
                      id="edit-proximoNumero"
                      type="number"
                      value={formData.proximoNumero}
                      onChange={(e) => setFormData({...formData, proximoNumero: e.target.value})}
                      placeholder="1"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-observaciones" className="text-sm font-medium">
                Observaciones
              </Label>
              <Textarea
                id="edit-observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                placeholder="Observaciones adicionales"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEdit}
              disabled={!formData.nombre || !formData.banco || !formData.titular}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { Chequeras };
export default Chequeras;
