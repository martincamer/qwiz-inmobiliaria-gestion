import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Banknote,
  Receipt,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Edit,
  TrendingDown,
  CheckCircle,
  Calendar,
  Plus,
  Eye,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";
import { useAuth } from "../../contexts/AuthContext";

// Componentes que crearemos
import InformacionPersonal from "../../components/cliente/InformacionPersonal";
import GestionFacturas from "../../components/cliente/GestionFacturas";
import PagosEfectivo from "../../components/cliente/PagosEfectivo";
import PagosBancarios from "../../components/cliente/PagosBancarios";
import PagosCheques from "../../components/cliente/PagosCheques";
import GestionPresupuestos from "../../components/cliente/GestionPresupuestos";
import CuentaCorriente from "../../components/cliente/CuentaCorriente";

const ClienteObtenido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentCliente: clienteActual,
    facturas,
    presupuestos,
    pagos,
    cuentaCorriente,
    isLoading,
    error,
    getClienteById,
    getFacturas,
    getPresupuestos,
    getPagos,
    getCuentaCorriente,
    clearError,
  } = useCliente();

  console.log(clienteActual);

  const [activeTab, setActiveTab] = useState("informacion");

  useEffect(() => {
    if (id) {
      loadClienteData();
    }
  }, [id]);

  const loadClienteData = async () => {
    try {
      await getClienteById(id);
      await getFacturas(id);
      await getPresupuestos(id);
      await getPagos(id);
      await getCuentaCorriente(id);
    } catch (error) {
      console.error("Error loading cliente data:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-AR");
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

  const getResumenFinanciero = () => {
    if (!clienteActual) return null;

    const totalFacturas = facturas.reduce((sum, f) => sum + f.total, 0);
    const totalPagos = pagos.reduce((sum, p) => sum + p.monto, 0);
    const saldoPendiente = totalFacturas - totalPagos;

    return {
      totalFacturas,
      totalPagos,
      saldoPendiente,
      facturasPendientes: facturas.filter((f) => f.estado === "pendiente")
        .length,
      facturasVencidas: facturas.filter((f) => f.estado === "vencida").length,
    };
  };

  const resumen = getResumenFinanciero();

  if (isLoading && !clienteActual) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Cargando información del cliente...
          </p>
        </div>
      </div>
    );
  }

  if (!clienteActual) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Cliente no encontrado</h3>
        <p className="text-muted-foreground mb-4">
          El cliente que buscas no existe o no tienes permisos para verlo.
        </p>
        <Button onClick={() => navigate("/customers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Clientes
        </Button>
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
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              {clienteActual.tipoPersona === "fisica" ? (
                <User className="h-8 w-8" />
              ) : (
                <Building2 className="h-8 w-8" />
              )}
              {clienteActual.nombreCompleto}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getEstadoBadgeVariant(clienteActual.estado)}>
                {clienteActual.estado.charAt(0).toUpperCase() +
                  clienteActual.estado.slice(1)}
              </Badge>
              <Badge variant="outline">
                {clienteActual.tipoPersona === "fisica"
                  ? "Persona Física"
                  : "Persona Jurídica"}
              </Badge>
              {clienteActual.tipoPersona === "fisica" && clienteActual.dni && (
                <span className="text-sm text-muted-foreground">
                  DNI: {clienteActual.dni}
                </span>
              )}
              {clienteActual.tipoPersona === "juridica" &&
                clienteActual.datosFiscales?.cuit && (
                  <span className="text-sm text-muted-foreground">
                    CUIT: {clienteActual.datosFiscales.cuit}
                  </span>
                )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar Cliente
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Resumen Financiero */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Actual
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  clienteActual.saldoActual > 0
                    ? "text-red-600"
                    : clienteActual.saldoActual < 0
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {formatCurrency(clienteActual.saldoActual)}
              </div>
              <p className="text-xs text-muted-foreground">
                {clienteActual.saldoActual > 0
                  ? "A favor del cliente"
                  : clienteActual.saldoActual < 0
                  ? "Debe el cliente"
                  : "Sin saldo pendiente"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Facturas
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(resumen.totalFacturas)}
              </div>
              <p className="text-xs text-muted-foreground">
                {facturas.length} factura{facturas.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pagos</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(resumen.totalPagos)}
              </div>
              <p className="text-xs text-muted-foreground">
                {pagos.length} pago{pagos.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Facturas Pendientes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resumen.facturasPendientes}
              </div>
              <p className="text-xs text-muted-foreground">
                {resumen.facturasVencidas} vencida
                {resumen.facturasVencidas !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información Rápida */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contacto */}
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contacto
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {clienteActual.contacto?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {clienteActual.contacto.email}
                  </div>
                )}
                {clienteActual.contacto?.celular && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {clienteActual.contacto.celular}
                  </div>
                )}
                {clienteActual.contacto?.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {clienteActual.contacto.telefono}
                  </div>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dirección
              </h3>
              <div className="text-sm text-muted-foreground">
                {clienteActual.direccionFiscal && (
                  <div>
                    {clienteActual.direccionFiscal.calle}{" "}
                    {clienteActual.direccionFiscal.numero}
                    {clienteActual.direccionFiscal.piso &&
                      `, Piso ${clienteActual.direccionFiscal.piso}`}
                    {clienteActual.direccionFiscal.departamento &&
                      `, Depto ${clienteActual.direccionFiscal.departamento}`}
                    <br />
                    {clienteActual.direccionFiscal.localidad},{" "}
                    {clienteActual.direccionFiscal.provincia}
                    {clienteActual.direccionFiscal.codigoPostal &&
                      ` (${clienteActual.direccionFiscal.codigoPostal})`}
                  </div>
                )}
              </div>
            </div>

            {/* Datos Fiscales */}
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Datos Fiscales
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>
                  Condición IVA:{" "}
                  {clienteActual.datosFiscales?.condicionIva?.replace(
                    "_",
                    " "
                  ) || "N/A"}
                </div>
                {clienteActual.datosFiscales?.cuit && (
                  <div>CUIT: {clienteActual.datosFiscales.cuit}</div>
                )}
                {clienteActual.datosFiscales?.categoriaMonotributo && (
                  <div>
                    Categoría:{" "}
                    {clienteActual.datosFiscales.categoriaMonotributo}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Gestión */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="informacion" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Información</span>
          </TabsTrigger>
          <TabsTrigger value="facturas" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Facturas</span>
          </TabsTrigger>
          <TabsTrigger value="efectivo" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            <span className="hidden sm:inline">Efectivo</span>
          </TabsTrigger>
          <TabsTrigger value="bancarios" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Bancarios</span>
          </TabsTrigger>
          <TabsTrigger value="cheques" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Cheques</span>
          </TabsTrigger>
          <TabsTrigger value="presupuestos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Presupuestos</span>
          </TabsTrigger>
          <TabsTrigger value="cuenta" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Cuenta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="space-y-6">
          <InformacionPersonal
            cliente={clienteActual}
            onUpdate={loadClienteData}
          />
        </TabsContent>

        <TabsContent value="facturas" className="space-y-6">
          <GestionFacturas
            clienteId={id}
            facturas={clienteActual.facturas}
            onUpdate={loadClienteData}
          />
        </TabsContent>

        <TabsContent value="efectivo" className="space-y-6">
          <PagosEfectivo
            clienteId={id}
            pagos={clienteActual.pagoEfectivo}
            onUpdate={loadClienteData}
          />
        </TabsContent>

        <TabsContent value="bancarios" className="space-y-6">
          <PagosBancarios clienteId={id} onUpdate={loadClienteData} />
        </TabsContent>

        <TabsContent value="cheques" className="space-y-6">
          <PagosCheques
            clienteId={id}
            pagos={pagos.filter((p) => p.tipo === "cheque")}
            onUpdate={loadClienteData}
          />
        </TabsContent>

        <TabsContent value="presupuestos" className="space-y-6">
          <GestionPresupuestos
            clienteId={id}
            presupuestos={presupuestos}
            onUpdate={loadClienteData}
          />
        </TabsContent>

        <TabsContent value="cuenta" className="space-y-6">
          <CuentaCorriente
            clienteId={id}
            cuentaCorriente={cuentaCorriente}
            cliente={clienteActual}
            onUpdate={loadClienteData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClienteObtenido;
