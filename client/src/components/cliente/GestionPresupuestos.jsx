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
  Calculator,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  X,
  Download,
  Copy,
  TrendingUp,
  Package,
  Users,
  Target,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";

const GestionPresupuestos = ({ clienteId }) => {
  const { 
    presupuestos, 
    getPresupuestos, 
    agregarPresupuesto, 
    updatePresupuesto, 
    deletePresupuesto,
    isLoading, 
    error 
  } = useCliente();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [formData, setFormData] = useState({
    numero: "",
    fecha: new Date().toISOString().split('T')[0],
    fechaVencimiento: "",
    descripcion: "",
    observaciones: "",
    estado: "borrador",
    subtotal: 0,
    descuento: 0,
    impuestos: 0,
    total: 0,
    validezDias: 30,
    condicionesPago: "",
    tiempoEntrega: "",
    garantia: "",
    items: [{
      descripcion: "",
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      subtotal: 0
    }]
  });

  useEffect(() => {
    if (clienteId) {
      getPresupuestos(clienteId);
    }
  }, [clienteId]);

  const handleCreatePresupuesto = async () => {
    try {
      const presupuestoData = {
        ...formData,
        cliente: clienteId,
        subtotal: parseFloat(formData.subtotal) || 0,
        descuento: parseFloat(formData.descuento) || 0,
        impuestos: parseFloat(formData.impuestos) || 0,
        total: parseFloat(formData.total) || 0
      };
      
      const result = await agregarPresupuesto(clienteId, presupuestoData);
      if (result.success) {
        setIsCreateDialogOpen(false);
        resetForm();
        getPresupuestos(clienteId);
      }
    } catch (error) {
      console.error("Error creating presupuesto:", error);
    }
  };

  const handleEditPresupuesto = async () => {
    try {
      const result = await updatePresupuesto(selectedPresupuesto._id, formData);
      if (result.success) {
        setIsEditDialogOpen(false);
        setSelectedPresupuesto(null);
        resetForm();
        getPresupuestos(clienteId);
      }
    } catch (error) {
      console.error("Error updating presupuesto:", error);
    }
  };

  const handleDeletePresupuesto = async (presupuestoId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este presupuesto?")) {
      try {
        const result = await deletePresupuesto(presupuestoId);
        if (result.success) {
          getPresupuestos(clienteId);
        }
      } catch (error) {
        console.error("Error deleting presupuesto:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      numero: "",
      fecha: new Date().toISOString().split('T')[0],
      fechaVencimiento: "",
      descripcion: "",
      observaciones: "",
      estado: "borrador",
      subtotal: 0,
      descuento: 0,
      impuestos: 0,
      total: 0,
      validezDias: 30,
      condicionesPago: "",
      tiempoEntrega: "",
      garantia: "",
      items: [{
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
        subtotal: 0
      }]
    });
  };

  const openEditDialog = (presupuesto) => {
    setSelectedPresupuesto(presupuesto);
    setFormData({
      numero: presupuesto.numero || "",
      fecha: presupuesto.fecha ? presupuesto.fecha.split('T')[0] : "",
      fechaVencimiento: presupuesto.fechaVencimiento ? presupuesto.fechaVencimiento.split('T')[0] : "",
      descripcion: presupuesto.descripcion || "",
      observaciones: presupuesto.observaciones || "",
      estado: presupuesto.estado || "borrador",
      subtotal: presupuesto.subtotal || 0,
      descuento: presupuesto.descuento || 0,
      impuestos: presupuesto.impuestos || 0,
      total: presupuesto.total || 0,
      validezDias: presupuesto.validezDias || 30,
      condicionesPago: presupuesto.condicionesPago || "",
      tiempoEntrega: presupuesto.tiempoEntrega || "",
      garantia: presupuesto.garantia || "",
      items: presupuesto.items || [{
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
        subtotal: 0
      }]
    });
    setIsEditDialogOpen(true);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
        subtotal: 0
      }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
    calculateTotals(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calcular subtotal del item
    if (field === 'cantidad' || field === 'precioUnitario' || field === 'descuento') {
      const cantidad = parseFloat(newItems[index].cantidad) || 0;
      const precio = parseFloat(newItems[index].precioUnitario) || 0;
      const descuento = parseFloat(newItems[index].descuento) || 0;
      newItems[index].subtotal = (cantidad * precio) - descuento;
    }
    
    setFormData({ ...formData, items: newItems });
    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0);
    const descuentoTotal = parseFloat(formData.descuento) || 0;
    const impuestosTotal = parseFloat(formData.impuestos) || 0;
    const total = subtotal - descuentoTotal + impuestosTotal;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-AR');
  };

  const getEstadoBadge = (estado) => {
    const estadoConfig = {
      borrador: { variant: "outline", icon: Edit, label: "Borrador" },
      enviado: { variant: "secondary", icon: Send, label: "Enviado" },
      aprobado: { variant: "default", icon: CheckCircle, label: "Aprobado" },
      rechazado: { variant: "destructive", icon: X, label: "Rechazado" },
      vencido: { variant: "destructive", icon: Clock, label: "Vencido" },
      facturado: { variant: "default", icon: FileText, label: "Facturado" }
    };
    
    const config = estadoConfig[estado] || estadoConfig.borrador;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const isVencido = (fechaVencimiento) => {
    if (!fechaVencimiento) return false;
    return new Date(fechaVencimiento) < new Date();
  };

  const filteredPresupuestos = presupuestos.filter(presupuesto => {
    const matchesSearch = presupuesto.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         presupuesto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         presupuesto.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === "all" || presupuesto.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const totalPresupuestos = filteredPresupuestos.length;
  const totalMonto = filteredPresupuestos.reduce((sum, p) => sum + (p.total || 0), 0);
  const aprobados = filteredPresupuestos.filter(p => p.estado === 'aprobado').length;
  const pendientes = filteredPresupuestos.filter(p => ['borrador', 'enviado'].includes(p.estado)).length;
  const vencidos = filteredPresupuestos.filter(p => isVencido(p.fechaVencimiento) && p.estado !== 'facturado').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Gestión de Presupuestos
          </h2>
          <p className="text-muted-foreground">
            Crea y gestiona presupuestos para el cliente
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Presupuesto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Nuevo Presupuesto
              </DialogTitle>
              <DialogDescription>
                Crea un nuevo presupuesto para el cliente
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Datos Básicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos Básicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="numero" className="text-sm font-medium">
                      Número de Presupuesto *
                    </Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => setFormData({...formData, numero: e.target.value})}
                      placeholder="PRES-001"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fecha" className="text-sm font-medium">
                      Fecha de Emisión *
                    </Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fechaVencimiento" className="text-sm font-medium">
                      Fecha de Vencimiento
                    </Label>
                    <Input
                      id="fechaVencimiento"
                      type="date"
                      value={formData.fechaVencimiento}
                      onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="validezDias" className="text-sm font-medium">
                      Validez (días)
                    </Label>
                    <Input
                      id="validezDias"
                      type="number"
                      value={formData.validezDias}
                      onChange={(e) => setFormData({...formData, validezDias: e.target.value})}
                      placeholder="30"
                    />
                  </div>
                  
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="descripcion" className="text-sm font-medium">
                      Descripción *
                    </Label>
                    <Input
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Descripción del presupuesto"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="estado" className="text-sm font-medium">
                      Estado
                    </Label>
                    <Select 
                      value={formData.estado} 
                      onValueChange={(value) => setFormData({...formData, estado: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="borrador">Borrador</SelectItem>
                        <SelectItem value="enviado">Enviado</SelectItem>
                        <SelectItem value="aprobado">Aprobado</SelectItem>
                        <SelectItem value="rechazado">Rechazado</SelectItem>
                        <SelectItem value="vencido">Vencido</SelectItem>
                        <SelectItem value="facturado">Facturado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Items del Presupuesto */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Items del Presupuesto</h3>
                  <Button type="button" variant="outline" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium">Descripción *</Label>
                          <Input
                            value={item.descripcion}
                            onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                            placeholder="Descripción del producto/servicio"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Cantidad *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.cantidad}
                            onChange={(e) => updateItem(index, 'cantidad', e.target.value)}
                            placeholder="1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Precio Unitario *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.precioUnitario}
                            onChange={(e) => updateItem(index, 'precioUnitario', e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Descuento</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.descuento}
                            onChange={(e) => updateItem(index, 'descuento', e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Label className="text-sm font-medium">Subtotal</Label>
                            <Input
                              value={formatCurrency(item.subtotal || 0)}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          {formData.items.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Totales</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subtotal" className="text-sm font-medium">
                      Subtotal
                    </Label>
                    <Input
                      id="subtotal"
                      value={formatCurrency(formData.subtotal)}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="descuento" className="text-sm font-medium">
                      Descuento General
                    </Label>
                    <Input
                      id="descuento"
                      type="number"
                      step="0.01"
                      value={formData.descuento}
                      onChange={(e) => {
                        setFormData({...formData, descuento: e.target.value});
                        calculateTotals(formData.items);
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="impuestos" className="text-sm font-medium">
                      Impuestos
                    </Label>
                    <Input
                      id="impuestos"
                      type="number"
                      step="0.01"
                      value={formData.impuestos}
                      onChange={(e) => {
                        setFormData({...formData, impuestos: e.target.value});
                        calculateTotals(formData.items);
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="total" className="text-sm font-medium">
                      Total
                    </Label>
                    <Input
                      id="total"
                      value={formatCurrency(formData.total)}
                      disabled
                      className="bg-gray-50 font-bold text-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Condiciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Condiciones y Términos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="condicionesPago" className="text-sm font-medium">
                      Condiciones de Pago
                    </Label>
                    <Textarea
                      id="condicionesPago"
                      value={formData.condicionesPago}
                      onChange={(e) => setFormData({...formData, condicionesPago: e.target.value})}
                      placeholder="Ej: 50% al firmar, 50% contra entrega"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="tiempoEntrega" className="text-sm font-medium">
                      Tiempo de Entrega
                    </Label>
                    <Textarea
                      id="tiempoEntrega"
                      value={formData.tiempoEntrega}
                      onChange={(e) => setFormData({...formData, tiempoEntrega: e.target.value})}
                      placeholder="Ej: 15 días hábiles"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="garantia" className="text-sm font-medium">
                      Garantía
                    </Label>
                    <Textarea
                      id="garantia"
                      value={formData.garantia}
                      onChange={(e) => setFormData({...formData, garantia: e.target.value})}
                      placeholder="Ej: 12 meses contra defectos de fabricación"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="observaciones" className="text-sm font-medium">
                    Observaciones
                  </Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreatePresupuesto}
                disabled={isLoading || !formData.numero || !formData.descripcion || !formData.fecha}
              >
                {isLoading ? "Creando..." : "Crear Presupuesto"}
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Presupuestos</p>
                <p className="text-2xl font-bold">{totalPresupuestos}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monto Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalMonto)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold text-green-600">{aprobados}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{pendientes}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">{vencidos}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
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
                  placeholder="Buscar por número, descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="borrador">Borradores</SelectItem>
                  <SelectItem value="enviado">Enviados</SelectItem>
                  <SelectItem value="aprobado">Aprobados</SelectItem>
                  <SelectItem value="rechazado">Rechazados</SelectItem>
                  <SelectItem value="vencido">Vencidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Presupuestos */}
      <Card>
        <CardHeader>
          <CardTitle>Presupuestos</CardTitle>
          <CardDescription>
            {filteredPresupuestos.length} presupuesto(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando presupuestos...</p>
            </div>
          ) : filteredPresupuestos.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron presupuestos</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPresupuestos.map((presupuesto) => (
                  <TableRow key={presupuesto._id} className={isVencido(presupuesto.fechaVencimiento) && presupuesto.estado !== 'facturado' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="font-medium">{presupuesto.numero}</div>
                      <div className="text-sm text-muted-foreground">
                        {presupuesto.validezDias} días de validez
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{presupuesto.descripcion}</div>
                      <div className="text-sm text-muted-foreground">
                        {presupuesto.items?.length || 0} item(s)
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(presupuesto.fecha)}
                    </TableCell>
                    <TableCell>
                      <div className={isVencido(presupuesto.fechaVencimiento) && presupuesto.estado !== 'facturado' ? 'text-red-600 font-medium' : ''}>
                        {formatDate(presupuesto.fechaVencimiento)}
                        {isVencido(presupuesto.fechaVencimiento) && presupuesto.estado !== 'facturado' && (
                          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            Vencido
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {formatCurrency(presupuesto.total)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getEstadoBadge(presupuesto.estado)}
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
                          <DropdownMenuItem onClick={() => openEditDialog(presupuesto)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeletePresupuesto(presupuesto._id)}
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

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Presupuesto
            </DialogTitle>
            <DialogDescription>
              Modifica los datos del presupuesto seleccionado
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Formulario de edición similar al de creación...
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEditPresupuesto}
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionPresupuestos;