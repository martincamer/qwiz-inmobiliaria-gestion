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
import { Separator } from "@/components/ui/separator";
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
  Plus,
  CreditCard,
  DollarSign,
  Edit,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  CheckCircle,
  Search,
  Receipt,
  Building2,
  User,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useChequera } from "../../contexts/ChequeraContext";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const ChequeraObtenida = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    chequeras,
    cheques,
    isLoading,
    error,
    getChequeras,
    getCheques,
    emitirCheque,
    agregarChequeTerceros,
    cambiarEstadoCheque,
  } = useChequera();

  const [selectedCheque, setSelectedCheque] = useState(null);
  const [isChequeDialogOpen, setIsChequeDialogOpen] = useState(false);
  const [isEstadoDialogOpen, setIsEstadoDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("all");
  const [nuevoEstado, setNuevoEstado] = useState("");

  // Form states
  const [newCheque, setNewCheque] = useState({
    monto: "",
    fechaVencimiento: "",
    beneficiario: "",
    concepto: "",
    observaciones: "",
    numero: "",
    fechaEmision: "",
    estado: "disponible",
    emisorData: {
      nombre: "",
      cuit: "",
      banco: "",
      numeroCuenta: "",
    },
  });

  const [movimientoData, setMovimientoData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    observaciones: "",
  });

  const chequera = chequeras.find(c => c._id === id);

  useEffect(() => {
    if (!chequeras.length) {
      getChequeras();
    }
  }, []);

  useEffect(() => {
    if (id) {
      getCheques(id, { page: 1, limit: 50 });
    }
  }, [id]);

  const resetChequeForm = () => {
    setNewCheque({
      monto: "",
      fechaVencimiento: "",
      beneficiario: "",
      concepto: "",
      observaciones: "",
      numero: "",
      fechaEmision: "",
      estado: "disponible",
      emisorData: {
        nombre: "",
        cuit: "",
        banco: "",
        numeroCuenta: "",
      },
    });
  };

  const handleAddCheque = async () => {
    try {
      if (chequera.tipo === "propia") {
        await emitirCheque(id, {
          monto: parseFloat(newCheque.monto),
          fechaEmision: newCheque.fechaEmision || new Date().toISOString().split('T')[0],
          fechaVencimiento: newCheque.fechaVencimiento,
          beneficiario: newCheque.beneficiario,
          concepto: newCheque.concepto,
          observaciones: newCheque.observaciones,
          clienteCuit: newCheque.clienteCuit || '',
          clienteTelefono: newCheque.clienteTelefono || '',
          clienteEmail: newCheque.clienteEmail || '',
          clienteDireccion: newCheque.clienteDireccion || ''
        });
      } else {
        await agregarChequeTerceros(id, {
          numero: newCheque.numero,
          monto: parseFloat(newCheque.monto),
          fechaEmision: newCheque.fechaEmision,
          fechaVencimiento: newCheque.fechaVencimiento,
          beneficiario: newCheque.beneficiario,
          concepto: newCheque.concepto,
          observaciones: newCheque.observaciones,
          clienteCuit: newCheque.clienteCuit || '',
          clienteTelefono: newCheque.clienteTelefono || '',
          clienteEmail: newCheque.clienteEmail || '',
          clienteDireccion: newCheque.clienteDireccion || '',
          emisorNombre: newCheque.emisorNombre || '',
          emisorCuit: newCheque.emisorCuit || '',
          emisorBanco: newCheque.emisorBanco || ''
        });
      }

      resetChequeForm();
      setIsChequeDialogOpen(false);
      getCheques(id, { page: 1, limit: 50 });
    } catch (error) {
      console.error("Error adding cheque:", error);
    }
  };

  const handleCambiarEstado = async () => {
    try {
      await cambiarEstadoCheque(id, selectedCheque._id, {
        estado: nuevoEstado,
        motivo: movimientoData.observaciones,
        fecha: movimientoData.fecha,
      });
      setIsEstadoDialogOpen(false);
      setSelectedCheque(null);
      setNuevoEstado("");
      setMovimientoData({
        fecha: new Date().toISOString().split('T')[0],
        observaciones: "",
      });
      getCheques(id, { page: 1, limit: 50 });
    } catch (error) {
      console.error("Error changing cheque status:", error);
    }
  };

  const openEstadoDialog = (cheque) => {
    setSelectedCheque(cheque);
    setNuevoEstado(cheque.estado);
    setIsEstadoDialogOpen(true);
  };

  const filteredCheques = cheques.filter((cheque) => {
    const matchesSearch = 
      cheque.numero?.toString().includes(searchTerm) ||
      cheque.beneficiario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheque.concepto?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === "all" || cheque.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case "disponible":
        return "default";
      case "emitido":
        return "secondary";
      case "cobrado":
        return "default";
      case "rechazado":
        return "destructive";
      case "vencido":
        return "destructive";
      case "anulado":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "disponible":
        return <CheckCircle2 className="h-3 w-3" />;
      case "emitido":
        return <Clock className="h-3 w-3" />;
      case "cobrado":
        return <CheckCircle className="h-3 w-3" />;
      case "rechazado":
        return <XCircle className="h-3 w-3" />;
      case "vencido":
        return <AlertCircle className="h-3 w-3" />;
      case "anulado":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR');
  };

  if (isLoading && !chequera) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando chequera...</p>
        </div>
      </div>
    );
  }

  if (!chequera) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Chequera no encontrada</h2>
          <p className="text-muted-foreground mb-4">La chequera que buscas no existe o no tienes permisos para verla.</p>
          <Button onClick={() => navigate('/chequeras')}>
            Volver a Chequeras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/chequeras')}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-8 w-8" />
              {chequera.nombre}
            </h1>
            <p className="text-muted-foreground">
              {chequera.banco} • {chequera.tipo === 'propia' ? 'Chequera Propia' : 'Cheques de Terceros'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isChequeDialogOpen} onOpenChange={setIsChequeDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetChequeForm}>
                <Plus className="h-4 w-4 mr-2" />
                {chequera.tipo === 'propia' ? 'Emitir Cheque' : 'Agregar Cheque'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  {chequera.tipo === 'propia' ? 'Emitir Nuevo Cheque' : 'Agregar Cheque de Terceros'}
                </DialogTitle>
                <DialogDescription>
                  {chequera.tipo === 'propia' 
                    ? 'Emite un nuevo cheque de tu chequera'
                    : 'Agrega un cheque recibido de terceros'
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {chequera.tipo === 'terceros' && (
                  <div className="grid gap-2">
                    <Label htmlFor="numero" className="text-sm font-medium">
                      Número de Cheque *
                    </Label>
                    <Input
                      id="numero"
                      value={newCheque.numero}
                      onChange={(e) => setNewCheque({...newCheque, numero: e.target.value})}
                      placeholder="Número del cheque"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="monto" className="text-sm font-medium">
                      Monto *
                    </Label>
                    <Input
                      id="monto"
                      type="number"
                      step="0.01"
                      value={newCheque.monto}
                      onChange={(e) => setNewCheque({...newCheque, monto: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fechaVencimiento" className="text-sm font-medium">
                      Fecha de Vencimiento *
                    </Label>
                    <Input
                      id="fechaVencimiento"
                      type="date"
                      value={newCheque.fechaVencimiento}
                      onChange={(e) => setNewCheque({...newCheque, fechaVencimiento: e.target.value})}
                    />
                  </div>
                </div>

                {chequera.tipo === 'terceros' && (
                  <div className="grid gap-2">
                    <Label htmlFor="fechaEmision" className="text-sm font-medium">
                      Fecha de Emisión *
                    </Label>
                    <Input
                      id="fechaEmision"
                      type="date"
                      value={newCheque.fechaEmision}
                      onChange={(e) => setNewCheque({...newCheque, fechaEmision: e.target.value})}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="beneficiario" className="text-sm font-medium">
                    Beneficiario *
                  </Label>
                  <Input
                    id="beneficiario"
                    value={newCheque.beneficiario}
                    onChange={(e) => setNewCheque({...newCheque, beneficiario: e.target.value})}
                    placeholder="Nombre del beneficiario"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="concepto" className="text-sm font-medium">
                    Concepto
                  </Label>
                  <Input
                    id="concepto"
                    value={newCheque.concepto}
                    onChange={(e) => setNewCheque({...newCheque, concepto: e.target.value})}
                    placeholder="Concepto del pago"
                  />
                </div>

                {chequera.tipo === 'terceros' && (
                  <>
                    <Separator />
                    <h4 className="font-medium">Datos del Emisor</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium">Nombre/Razón Social</Label>
                        <Input
                          value={newCheque.emisorData.nombre}
                          onChange={(e) => setNewCheque({
                            ...newCheque,
                            emisorData: {...newCheque.emisorData, nombre: e.target.value}
                          })}
                          placeholder="Nombre del emisor"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium">CUIT</Label>
                        <Input
                          value={newCheque.emisorData.cuit}
                          onChange={(e) => setNewCheque({
                            ...newCheque,
                            emisorData: {...newCheque.emisorData, cuit: e.target.value}
                          })}
                          placeholder="XX-XXXXXXXX-X"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium">Banco</Label>
                        <Input
                          value={newCheque.emisorData.banco}
                          onChange={(e) => setNewCheque({
                            ...newCheque,
                            emisorData: {...newCheque.emisorData, banco: e.target.value}
                          })}
                          placeholder="Banco emisor"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium">Número de Cuenta</Label>
                        <Input
                          value={newCheque.emisorData.numeroCuenta}
                          onChange={(e) => setNewCheque({
                            ...newCheque,
                            emisorData: {...newCheque.emisorData, numeroCuenta: e.target.value}
                          })}
                          placeholder="Número de cuenta"
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
                    value={newCheque.observaciones}
                    onChange={(e) => setNewCheque({...newCheque, observaciones: e.target.value})}
                    placeholder="Observaciones adicionales"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsChequeDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddCheque}
                  disabled={!newCheque.monto || !newCheque.fechaVencimiento || !newCheque.beneficiario}
                >
                  {chequera.tipo === 'propia' ? 'Emitir Cheque' : 'Agregar Cheque'}
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

      {/* Chequera Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Chequera
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Titular</p>
              <p className="font-medium">{chequera.titular}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Banco</p>
              <p className="font-medium">{chequera.banco}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant={chequera.isActive ? "default" : "secondary"}>
                {chequera.isActive ? "Activa" : "Inactiva"}
              </Badge>
            </div>
            {chequera.tipo === 'propia' && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Número de Cuenta</p>
                  <p className="font-medium">{chequera.numeroCuenta || 'No especificado'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Próximo Número</p>
                  <p className="font-medium">{chequera.proximoNumero}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Rango</p>
                  <p className="font-medium">{chequera.rangoDesde} - {chequera.rangoHasta}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, beneficiario o concepto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="emitido">Emitido</SelectItem>
                <SelectItem value="cobrado">Cobrado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
                <SelectItem value="anulado">Anulado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cheques List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Cheques ({filteredCheques.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredCheques.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay cheques</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterEstado !== 'all' 
                  ? 'No se encontraron cheques con los filtros aplicados'
                  : 'Aún no hay cheques en esta chequera'
                }
              </p>
              {(!searchTerm && filterEstado === 'all') && (
                <Button onClick={() => setIsChequeDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {chequera.tipo === 'propia' ? 'Emitir Primer Cheque' : 'Agregar Primer Cheque'}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCheques.map((cheque) => (
                <div key={cheque._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(cheque.estado)}
                        <Badge variant={getEstadoBadgeVariant(cheque.estado)}>
                          {cheque.estado}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">
                          Cheque #{cheque.numero} • {formatCurrency(cheque.monto)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {cheque.beneficiario} • Vence: {formatDate(cheque.fechaVencimiento)}
                        </p>
                        {cheque.concepto && (
                          <p className="text-sm text-muted-foreground">
                            {cheque.concepto}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEstadoDialog(cheque)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Cambiar Estado
                      </Button>
                    </div>
                  </div>
                  {cheque.observaciones && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Observaciones:</strong> {cheque.observaciones}
                      </p>
                    </div>
                  )}
                  {cheque.emisorData && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Emisor:</strong> {cheque.emisorData.nombre} • {cheque.emisorData.banco}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para cambiar estado */}
      <Dialog open={isEstadoDialogOpen} onOpenChange={setIsEstadoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Estado del Cheque</DialogTitle>
            <DialogDescription>
              Modifica el estado del cheque #{selectedCheque?.numero}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nuevoEstado" className="text-sm font-medium">
                Nuevo Estado *
              </Label>
              <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="emitido">Emitido</SelectItem>
                  <SelectItem value="cobrado">Cobrado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="anulado">Anulado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fecha" className="text-sm font-medium">
                Fecha del Movimiento *
              </Label>
              <Input
                id="fecha"
                type="date"
                value={movimientoData.fecha}
                onChange={(e) => setMovimientoData({...movimientoData, fecha: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacionesMovimiento" className="text-sm font-medium">
                Observaciones
              </Label>
              <Textarea
                id="observacionesMovimiento"
                value={movimientoData.observaciones}
                onChange={(e) => setMovimientoData({...movimientoData, observaciones: e.target.value})}
                placeholder="Motivo del cambio de estado"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEstadoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCambiarEstado}
              disabled={!nuevoEstado || !movimientoData.fecha}
            >
              Cambiar Estado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChequeraObtenida;