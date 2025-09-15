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
  Wallet,
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
} from "lucide-react";
import { useCashBox } from "../../contexts/CashBoxContext";
import { useAuth } from "../../contexts/AuthContext";

const CashBox = () => {
  const { user } = useAuth();
  const {
    cashBoxes,
    movements,
    isLoading,
    error,
    getCashBoxes,
    createCashBox,
    updateCashBox,
    deleteCashBox,
    addMovement,
    getMovements,
    getCashBoxSummary,
  } = useCashBox();

  const [selectedCashBox, setSelectedCashBox] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cashBoxToDelete, setCashBoxToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Form states
  const [newCashBox, setNewCashBox] = useState({
    name: "",
    initialBalance: 0,
  });
  const [editCashBox, setEditCashBox] = useState({
    name: "",
    isActive: true,
  });
  const [newMovement, setNewMovement] = useState({
    type: "ingreso",
    amount: 0,
    description: "",
  });

  useEffect(() => {
    getCashBoxes();
  }, []);

  useEffect(() => {
    if (selectedCashBox) {
      getMovements(selectedCashBox._id, 1, 10);
    }
  }, [selectedCashBox]);

  const handleCreateCashBox = async () => {
    try {
      await createCashBox(newCashBox);
      setNewCashBox({ name: "", initialBalance: 0 });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating cash box:", error);
    }
  };

  const handleEditCashBox = async () => {
    try {
      await updateCashBox(selectedCashBox._id, editCashBox);
      setIsEditDialogOpen(false);
      setSelectedCashBox(null);
    } catch (error) {
      console.error("Error updating cash box:", error);
    }
  };

  const handleDeleteCashBox = async () => {
    if (cashBoxToDelete) {
      try {
        await deleteCashBox(cashBoxToDelete._id);
        if (selectedCashBox && selectedCashBox._id === cashBoxToDelete._id) {
          setSelectedCashBox(null);
        }
        setIsDeleteDialogOpen(false);
        setCashBoxToDelete(null);
      } catch (error) {
        console.error("Error deleting cash box:", error);
      }
    }
  };

  const openDeleteDialog = (cashBox) => {
    setCashBoxToDelete(cashBox);
    setIsDeleteDialogOpen(true);
  };

  const handleAddMovement = async () => {
    try {
      await addMovement(selectedCashBox._id, newMovement);
      setNewMovement({ type: "ingreso", amount: 0, description: "" });
      setIsMovementDialogOpen(false);
      // Refresh movements
      getMovements(selectedCashBox._id, 1, 10);
    } catch (error) {
      console.error("Error adding movement:", error);
    }
  };

  const filteredCashBoxes = cashBoxes.filter((cashBox) => {
    const matchesSearch = cashBox.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && cashBox.isActive) ||
      (filterStatus === "inactive" && !cashBox.isActive);
    return matchesSearch && matchesFilter;
  });

  const totalBalance = cashBoxes.reduce(
    (sum, cashBox) => sum + cashBox.currentBalance,
    0
  );
  const activeCashBoxes = cashBoxes.filter((cb) => cb.isActive).length;
  const inactiveCashBoxes = cashBoxes.filter((cb) => !cb.isActive).length;

  if (isLoading && cashBoxes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando cajas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Cajas
          </h1>
          <p className="text-muted-foreground">
            Administra tus cajas y movimientos de efectivo
          </p>
        </div>
        <Sheet open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Caja
            </Button>
          </SheetTrigger>
          <SheetContent className="p-4 min-w-xl max-md:w-full">
            <div className="grid gap-6 py-6">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Crear Nueva Caja
                </SheetTitle>
                <SheetDescription>
                  Crea una nueva caja para gestionar movimientos de efectivo de
                  tu negocio
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nombre de la Caja *
                </Label>
                <Input
                  id="name"
                  value={newCashBox.name}
                  onChange={(e) =>
                    setNewCashBox({ ...newCashBox, name: e.target.value })
                  }
                  placeholder="Ej: Caja Principal, Caja Sucursal Norte"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa un nombre descriptivo para identificar esta caja
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="initialBalance" className="text-sm font-medium">
                  Saldo Inicial
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="initialBalance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCashBox.initialBalance}
                    onChange={(e) =>
                      setNewCashBox({
                        ...newCashBox,
                        initialBalance: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Monto inicial con el que comenzará esta caja
                </p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Información importante
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>
                        • La caja se creará con estado "Activa" por defecto
                      </li>
                      <li>• Podrás agregar movimientos una vez creada</li>
                      <li>
                        • El saldo se actualizará automáticamente con cada
                        movimiento
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateCashBox}
                disabled={!newCashBox.name.trim()}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Caja
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              $
              {totalBalance.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              en {cashBoxes.length} cajas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cajas Activas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {activeCashBoxes}
            </div>
            <p className="text-xs text-muted-foreground">
              {inactiveCashBoxes} inactivas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Cajas
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {cashBoxes.length}
            </div>
            <p className="text-xs text-muted-foreground">cajas registradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cajas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las cajas</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cash Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCashBoxes.map((cashBox) => (
              <Card
                key={cashBox._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cashBox.name}</CardTitle>
                    <Badge variant={cashBox.isActive ? "default" : "secondary"}>
                      {cashBox.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Creada el{" "}
                    {new Date(cashBox.createdAt).toLocaleDateString("es-ES")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Saldo Actual
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        $
                        {cashBox.currentBalance.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCashBox(cashBox);
                          setActiveTab("movements");
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCashBox(cashBox);
                          setEditCashBox({
                            name: cashBox.name,
                            isActive: cashBox.isActive,
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(cashBox)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCashBoxes.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron cajas
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "No hay cajas que coincidan con los filtros aplicados"
                    : "Aún no has creado ninguna caja. Crea tu primera caja para comenzar."}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Caja
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          {selectedCashBox ? (
            <>
              {/* Selected Cash Box Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        {selectedCashBox.name}
                      </CardTitle>
                      <CardDescription>
                        Movimientos y transacciones de esta caja
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Saldo Actual
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        $
                        {selectedCashBox.currentBalance.toLocaleString(
                          "es-ES",
                          { minimumFractionDigits: 2 }
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Sheet
                      open={isMovementDialogOpen}
                      onOpenChange={setIsMovementDialogOpen}
                    >
                      <SheetTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Movimiento
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="p-4 min-w-xl max-md:w-full">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Agregar Movimiento
                          </SheetTitle>
                          <SheetDescription>
                            Registra un nuevo ingreso o egreso en{" "}
                            {selectedCashBox.name}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-6 py-6">
                          <div className="grid gap-2">
                            <Label
                              htmlFor="type"
                              className="text-sm font-medium"
                            >
                              Tipo de Movimiento *
                            </Label>
                            <Select
                              value={newMovement.type}
                              onValueChange={(value) =>
                                setNewMovement({ ...newMovement, type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ingreso">
                                  <div className="flex items-center gap-2">
                                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                                    Ingreso
                                  </div>
                                </SelectItem>
                                <SelectItem value="egreso">
                                  <div className="flex items-center gap-2">
                                    <ArrowDownLeft className="h-4 w-4 text-red-600" />
                                    Egreso
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Selecciona si es un ingreso o egreso de dinero
                            </p>
                          </div>

                          <div className="grid gap-2">
                            <Label
                              htmlFor="amount"
                              className="text-sm font-medium"
                            >
                              Monto *
                            </Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={newMovement.amount}
                                onChange={(e) =>
                                  setNewMovement({
                                    ...newMovement,
                                    amount: parseFloat(e.target.value) || 0,
                                  })
                                }
                                placeholder="0.00"
                                className="pl-10"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Ingresa el monto del movimiento
                            </p>
                          </div>

                          <div className="grid gap-2">
                            <Label
                              htmlFor="description"
                              className="text-sm font-medium"
                            >
                              Descripción *
                            </Label>
                            <Textarea
                              id="description"
                              value={newMovement.description}
                              onChange={(e) =>
                                setNewMovement({
                                  ...newMovement,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe el motivo del movimiento..."
                              rows={3}
                              className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                              Proporciona detalles sobre este movimiento
                            </p>
                          </div>

                          <div className="rounded-lg border p-4 bg-muted/50">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">
                                  Información del movimiento
                                </p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>
                                    • El saldo se actualizará automáticamente
                                  </li>
                                  <li>
                                    • Los ingresos aumentan el saldo de la caja
                                  </li>
                                  <li>
                                    • Los egresos disminuyen el saldo de la caja
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <SheetFooter className="gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsMovementDialogOpen(false)}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={handleAddMovement}
                            disabled={
                              !newMovement.amount || !newMovement.description
                            }
                            className="flex-1"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Movimiento
                          </Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCashBox(null)}
                    >
                      Volver a Vista General
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Movements List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historial de Movimientos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {movements.length > 0 ? (
                    <div className="space-y-4">
                      {movements.map((movement, index) => (
                        <div
                          key={movement._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-full ${
                                movement.type === "ingreso"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {movement.type === "ingreso" ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownLeft className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  #
                                  {String(movements.length - index).padStart(
                                    3,
                                    "0"
                                  )}
                                </Badge>
                                <p className="font-medium text-foreground">
                                  {movement.description}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(movement.createdAt).toLocaleString(
                                  "es-ES"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                movement.type === "ingreso"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {movement.type === "ingreso" ? "+" : "-"}$
                              {movement.amount.toLocaleString("es-ES", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Saldo: $
                              {movement.balanceAfter.toLocaleString("es-ES", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No hay movimientos
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Esta caja aún no tiene movimientos registrados
                      </p>
                      <Button onClick={() => setIsMovementDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Primer Movimiento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Selecciona una caja
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Elige una caja de la vista general para ver sus movimientos
                </p>
                <Button onClick={() => setActiveTab("overview")}>
                  Ir a Vista General
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Cash Box Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Caja</DialogTitle>
            <DialogDescription>
              Modifica la información de la caja seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Nombre de la Caja</Label>
              <Input
                id="editName"
                value={editCashBox.name}
                onChange={(e) =>
                  setEditCashBox({ ...editCashBox, name: e.target.value })
                }
                placeholder="Nombre de la caja"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStatus">Estado</Label>
              <Select
                value={editCashBox.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setEditCashBox({
                    ...editCashBox,
                    isActive: value === "active",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="inactive">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditCashBox} disabled={!editCashBox.name}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              caja y todos sus movimientos.
            </DialogDescription>
          </DialogHeader>
          {cashBoxToDelete && (
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  Caja: {cashBoxToDelete.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Saldo actual: $
                  {cashBoxToDelete.currentBalance.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Creada el:{" "}
                  {new Date(cashBoxToDelete.createdAt).toLocaleDateString(
                    "es-ES"
                  )}
                </p>
              </div>
            </div>
          )}
          <div className="rounded-lg border border-red-200 p-4 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-800">
                  ¿Estás seguro de que deseas eliminar esta caja?
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Se eliminarán todos los movimientos asociados</li>
                  <li>• Esta acción no se puede deshacer</li>
                  <li>• Los datos no podrán ser recuperados</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCashBoxToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCashBox}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Caja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashBox;
