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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CreditCard,
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
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Banknote,
  Calculator,
  Download,
  RefreshCw,
  Target,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";

const CuentaCorriente = ({ clienteId }) => {
  const { 
    cuentaCorriente, 
    getCuentaCorrienteByCliente, 
    createMovimientoCuentaCorriente, 
    updateMovimientoCuentaCorriente, 
    deleteMovimientoCuentaCorriente,
    getResumenCuentaCorriente,
    isLoading, 
    error 
  } = useCliente();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [resumen, setResumen] = useState(null);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipo: "debe", // debe, haber
    concepto: "",
    descripcion: "",
    monto: 0,
    referencia: "", // número de factura, recibo, etc.
    observaciones: "",
    categoria: "factura" // factura, pago, ajuste, interes, descuento
  });

  useEffect(() => {
    if (clienteId) {
      getCuentaCorrienteByCliente(clienteId);
      loadResumen();
    }
  }, [clienteId]);

  const loadResumen = async () => {
    try {
      const resumenData = await getResumenCuentaCorriente(clienteId);
      setResumen(resumenData);
    } catch (error) {
      console.error("Error loading resumen:", error);
    }
  };

  const handleCreateMovimiento = async () => {
    try {
      const movimientoData = {
        ...formData,
        cliente: clienteId,
        monto: parseFloat(formData.monto) || 0
      };
      
      const result = await createMovimientoCuentaCorriente(movimientoData);
      if (result.success) {
        setIsCreateDialogOpen(false);
        resetForm();
        getCuentaCorrienteByCliente(clienteId);
        loadResumen();
      }
    } catch (error) {
      console.error("Error creating movimiento:", error);
    }
  };

  const handleEditMovimiento = async () => {
    try {
      const result = await updateMovimientoCuentaCorriente(selectedMovimiento._id, formData);
      if (result.success) {
        setIsEditDialogOpen(false);
        setSelectedMovimiento(null);
        resetForm();
        getCuentaCorrienteByCliente(clienteId);
        loadResumen();
      }
    } catch (error) {
      console.error("Error updating movimiento:", error);
    }
  };

  const handleDeleteMovimiento = async (movimientoId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este movimiento?")) {
      try {
        const result = await deleteMovimientoCuentaCorriente(movimientoId);
        if (result.success) {
          getCuentaCorrienteByCliente(clienteId);
          loadResumen();
        }
      } catch (error) {
        console.error("Error deleting movimiento:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipo: "debe",
      concepto: "",
      descripcion: "",
      monto: 0,
      referencia: "",
      observaciones: "",
      categoria: "factura"
    });
  };

  const openEditDialog = (movimiento) => {
    setSelectedMovimiento(movimiento);
    setFormData({
      fecha: movimiento.fecha ? movimiento.fecha.split('T')[0] : "",
      tipo: movimiento.tipo || "debe",
      concepto: movimiento.concepto || "",
      descripcion: movimiento.descripcion || "",
      monto: movimiento.monto || 0,
      referencia: movimiento.referencia || "",
      observaciones: movimiento.observaciones || "",
      categoria: movimiento.categoria || "factura"
    });
    setIsEditDialogOpen(true);
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

  const getTipoBadge = (tipo) => {
    return tipo === 'debe' ? (
      <Badge variant="destructive" className="flex items-center gap-1">
        <ArrowUpRight className="h-3 w-3" />
        Debe
      </Badge>
    ) : (
      <Badge variant="default" className="flex items-center gap-1">
        <ArrowDownLeft className="h-3 w-3" />
        Haber
      </Badge>
    );
  };

  const getCategoriaBadge = (categoria) => {
    const categoriaConfig = {
      factura: { variant: "outline", icon: FileText, label: "Factura" },
      pago: { variant: "default", icon: DollarSign, label: "Pago" },
      ajuste: { variant: "secondary", icon: Edit, label: "Ajuste" },
      interes: { variant: "destructive", icon: TrendingUp, label: "Interés" },
      descuento: { variant: "default", icon: TrendingDown, label: "Descuento" },
      nota_credito: { variant: "secondary", icon: Receipt, label: "N. Crédito" },
      nota_debito: { variant: "destructive", icon: Receipt, label: "N. Débito" }
    };
    
    const config = categoriaConfig[categoria] || categoriaConfig.factura;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredMovimientos = cuentaCorriente.filter(movimiento => {
    const matchesSearch = movimiento.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movimiento.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movimiento.referencia?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "all" || movimiento.tipo === tipoFilter;
    const matchesFecha = (!fechaDesde || new Date(movimiento.fecha) >= new Date(fechaDesde)) &&
                        (!fechaHasta || new Date(movimiento.fecha) <= new Date(fechaHasta));
    return matchesSearch && matchesTipo && matchesFecha;
  });

  // Calcular saldo acumulado
  let saldoAcumulado = 0;
  const movimientosConSaldo = filteredMovimientos
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map(movimiento => {
      if (movimiento.tipo === 'debe') {
        saldoAcumulado += movimiento.monto;
      } else {
        saldoAcumulado -= movimiento.monto;
      }
      return {
        ...movimiento,
        saldoAcumulado
      };
    });

  const totalDebe = filteredMovimientos
    .filter(m => m.tipo === 'debe')
    .reduce((sum, m) => sum + (m.monto || 0), 0);
  
  const totalHaber = filteredMovimientos
    .filter(m => m.tipo === 'haber')
    .reduce((sum, m) => sum + (m.monto || 0), 0);
  
  const saldoActual = totalDebe - totalHaber;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Cuenta Corriente
          </h2>
          <p className="text-muted-foreground">
            Gestiona los movimientos de cuenta corriente del cliente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadResumen}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Nuevo Movimiento
                </DialogTitle>
                <DialogDescription>
                  Registra un nuevo movimiento en la cuenta corriente
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fecha" className="text-sm font-medium">
                      Fecha *
                    </Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="tipo" className="text-sm font-medium">
                      Tipo de Movimiento *
                    </Label>
                    <Select 
                      value={formData.tipo} 
                      onValueChange={(value) => setFormData({...formData, tipo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debe">Debe (Cargo)</SelectItem>
                        <SelectItem value="haber">Haber (Pago)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="categoria" className="text-sm font-medium">
                      Categoría *
                    </Label>
                    <Select 
                      value={formData.categoria} 
                      onValueChange={(value) => setFormData({...formData, categoria: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="factura">Factura</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="ajuste">Ajuste</SelectItem>
                        <SelectItem value="interes">Interés</SelectItem>
                        <SelectItem value="descuento">Descuento</SelectItem>
                        <SelectItem value="nota_credito">Nota de Crédito</SelectItem>
                        <SelectItem value="nota_debito">Nota de Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="monto" className="text-sm font-medium">
                      Monto *
                    </Label>
                    <Input
                      id="monto"
                      type="number"
                      step="0.01"
                      value={formData.monto}
                      onChange={(e) => setFormData({...formData, monto: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="concepto" className="text-sm font-medium">
                      Concepto *
                    </Label>
                    <Input
                      id="concepto"
                      value={formData.concepto}
                      onChange={(e) => setFormData({...formData, concepto: e.target.value})}
                      placeholder="Concepto del movimiento"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="referencia" className="text-sm font-medium">
                      Referencia
                    </Label>
                    <Input
                      id="referencia"
                      value={formData.referencia}
                      onChange={(e) => setFormData({...formData, referencia: e.target.value})}
                      placeholder="Nº factura, recibo, etc."
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="descripcion" className="text-sm font-medium">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Descripción detallada del movimiento"
                    rows={3}
                  />
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
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateMovimiento}
                  disabled={isLoading || !formData.concepto || !formData.monto || !formData.fecha}
                >
                  {isLoading ? "Creando..." : "Crear Movimiento"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="movimientos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="movimientos" className="space-y-6">
          {/* Resumen de Saldos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Saldo Actual</p>
                    <p className={`text-2xl font-bold ${saldoActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(saldoActual)}
                    </p>
                  </div>
                  <CreditCard className={`h-8 w-8 ${saldoActual >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Debe</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebe)}</p>
                  </div>
                  <ArrowUpRight className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Haber</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalHaber)}</p>
                  </div>
                  <ArrowDownLeft className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Movimientos</p>
                    <p className="text-2xl font-bold">{filteredMovimientos.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
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
                      placeholder="Buscar por concepto, descripción, referencia..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={tipoFilter} onValueChange={setTipoFilter}>
                    <SelectTrigger className="w-[120px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="debe">Debe</SelectItem>
                      <SelectItem value="haber">Haber</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    placeholder="Desde"
                    className="w-[140px]"
                  />
                  
                  <Input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    placeholder="Hasta"
                    className="w-[140px]"
                  />
                  
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setTipoFilter("all");
                    setFechaDesde("");
                    setFechaHasta("");
                  }}>
                    Limpiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Movimientos */}
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Cuenta Corriente</CardTitle>
              <CardDescription>
                {filteredMovimientos.length} movimiento(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Cargando movimientos...</p>
                </div>
              ) : movimientosConSaldo.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No se encontraron movimientos</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Referencia</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Debe</TableHead>
                      <TableHead className="text-right">Haber</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimientosConSaldo.reverse().map((movimiento) => (
                      <TableRow key={movimiento._id}>
                        <TableCell>
                          <div className="font-medium">{formatDate(movimiento.fecha)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{movimiento.concepto}</div>
                          {movimiento.descripcion && (
                            <div className="text-sm text-muted-foreground">
                              {movimiento.descripcion}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {movimiento.referencia && (
                            <Badge variant="outline">{movimiento.referencia}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {getCategoriaBadge(movimiento.categoria)}
                        </TableCell>
                        <TableCell>
                          {getTipoBadge(movimiento.tipo)}
                        </TableCell>
                        <TableCell className="text-right">
                          {movimiento.tipo === 'debe' && (
                            <span className="font-medium text-red-600">
                              {formatCurrency(movimiento.monto)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {movimiento.tipo === 'haber' && (
                            <span className="font-medium text-green-600">
                              {formatCurrency(movimiento.monto)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${movimiento.saldoAcumulado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(movimiento.saldoAcumulado)}
                          </span>
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
                              <DropdownMenuItem onClick={() => openEditDialog(movimiento)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteMovimiento(movimiento._id)}
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
        </TabsContent>

        <TabsContent value="resumen" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Cuenta Corriente</CardTitle>
              <CardDescription>
                Análisis detallado del estado de la cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resumen ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Estado Actual</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Saldo Actual:</span>
                          <span className={`font-medium ${resumen.saldoActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(resumen.saldoActual)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Límite de Crédito:</span>
                          <span className="font-medium">{formatCurrency(resumen.limiteCredito || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Crédito Disponible:</span>
                          <span className="font-medium text-blue-600">
                            {formatCurrency((resumen.limiteCredito || 0) + resumen.saldoActual)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Estadísticas</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Facturado:</span>
                          <span className="font-medium">{formatCurrency(resumen.totalFacturado || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Pagado:</span>
                          <span className="font-medium">{formatCurrency(resumen.totalPagado || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Promedio Mensual:</span>
                          <span className="font-medium">{formatCurrency(resumen.promedioMensual || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Cargando resumen...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas y Análisis</CardTitle>
              <CardDescription>
                Análisis de tendencias y patrones de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Gráficos y estadísticas en desarrollo...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Movimiento
            </DialogTitle>
            <DialogDescription>
              Modifica los datos del movimiento seleccionado
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
              onClick={handleEditMovimiento}
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

export default CuentaCorriente;