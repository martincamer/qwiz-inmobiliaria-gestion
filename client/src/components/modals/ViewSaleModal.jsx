import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShoppingCart,
  Building,
  User,
  DollarSign,
  Calendar,
  FileText,
  X,
  Clock,
  Target,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  MessageSquare,
  Percent,
  CreditCard,
  Home,
  Users,
  TrendingUp,
  Star,
  Flag,
} from "lucide-react";

const ViewSaleModal = ({ open, onOpenChange, sale, onEdit }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Resetear tab al abrir modal
  useEffect(() => {
    if (open) {
      setActiveTab("overview");
    }
  }, [open]);

  if (!sale) return null;

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Función para formatear precios
  const formatPrice = (price, currency = "ARS") => {
    if (!price) return "No especificado";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    const colors = {
      "Pendiente": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "En Proceso": "bg-blue-100 text-blue-800 border-blue-200",
      "Completada": "bg-green-100 text-green-800 border-green-200",
      "Cancelada": "bg-red-100 text-red-800 border-red-200",
      "Pausada": "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Función para obtener el color de la prioridad
  const getPriorityColor = (priority) => {
    const colors = {
      "Alta": "bg-red-100 text-red-800 border-red-200",
      "Media": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Baja": "bg-green-100 text-green-800 border-green-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Función para obtener el ícono del método de contacto
  const getContactMethodIcon = (method) => {
    const icons = {
      phone: Phone,
      email: Mail,
      whatsapp: MessageSquare,
      meeting: Users,
      visit: Home,
    };
    return icons[method] || MessageSquare;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Detalles de la Venta
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(sale.status)}>
                {sale.status}
              </Badge>
              <Badge className={getPriorityColor(sale.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {sale.priority}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Información completa de la venta #{sale._id?.slice(-8)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financiero
              </TabsTrigger>
              <TabsTrigger value="parties" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Partes
              </TabsTrigger>
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Términos
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Seguimiento
              </TabsTrigger>
            </TabsList>

            {/* Tab: Resumen */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Información General */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Propiedad</p>
                        <p className="text-base">
                          {sale.property?.title || "No especificada"}
                        </p>
                        {sale.property?.address && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {sale.property.address}
                          </p>
                        )}
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm font-medium text-gray-500">Descripción</p>
                        <p className="text-base">
                          {sale.description || "Sin descripción"}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
                          <p className="text-base flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(sale.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Fecha Esperada</p>
                          <p className="text-base flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(sale.expectedCloseDate)}
                          </p>
                        </div>
                      </div>

                      {sale.actualCloseDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Fecha de Cierre</p>
                          <p className="text-base flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {formatDate(sale.actualCloseDate)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Métricas Rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Métricas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(sale.price, sale.currency)}
                          </p>
                          <p className="text-sm text-gray-600">Precio de Venta</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {sale.commission ? (
                              sale.commissionType === "percentage" 
                                ? `${sale.commission}%`
                                : formatPrice(sale.commission, sale.currency)
                            ) : "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">Comisión</p>
                        </div>
                      </div>

                      {sale.commission && sale.price && (
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-xl font-bold text-yellow-600">
                            {sale.commissionType === "percentage" 
                              ? formatPrice((sale.price * sale.commission) / 100, sale.currency)
                              : formatPrice(sale.commission, sale.currency)
                            }
                          </p>
                          <p className="text-sm text-gray-600">Comisión Total</p>
                        </div>
                      )}

                      {/* Progreso de la venta */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>
                            {sale.status === "Completada" ? "100%" : 
                             sale.status === "En Proceso" ? "50%" : 
                             sale.status === "Pendiente" ? "25%" : "0%"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              sale.status === "Completada" ? "bg-green-500" :
                              sale.status === "En Proceso" ? "bg-blue-500" :
                              sale.status === "Pendiente" ? "bg-yellow-500" : "bg-gray-400"
                            }`}
                            style={{
                              width: sale.status === "Completada" ? "100%" : 
                                     sale.status === "En Proceso" ? "50%" : 
                                     sale.status === "Pendiente" ? "25%" : "0%"
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notas */}
              {sale.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Notas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{sale.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab: Información Financiera */}
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Detalles del Precio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Precio de Venta:</span>
                        <span className="font-semibold text-lg">
                          {formatPrice(sale.price, sale.currency)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Moneda:</span>
                        <Badge variant="outline">{sale.currency}</Badge>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Comisión:</span>
                        <span className="font-semibold">
                          {sale.commission ? (
                            sale.commissionType === "percentage" 
                              ? `${sale.commission}%`
                              : formatPrice(sale.commission, sale.currency)
                          ) : "No especificada"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tipo de Comisión:</span>
                        <Badge variant="outline">
                          {sale.commissionType === "percentage" ? (
                            <>
                              <Percent className="h-3 w-3 mr-1" />
                              Porcentaje
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3 w-3 mr-1" />
                              Monto Fijo
                            </>
                          )}
                        </Badge>
                      </div>

                      {sale.commission && sale.price && (
                        <>
                          <Separator />
                          <div className="flex justify-between items-center text-green-600">
                            <span className="font-medium">Comisión Total:</span>
                            <span className="font-bold text-lg">
                              {sale.commissionType === "percentage" 
                                ? formatPrice((sale.price * sale.commission) / 100, sale.currency)
                                : formatPrice(sale.commission, sale.currency)
                              }
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Cronograma
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Fecha de Inicio</p>
                          <p className="text-sm text-gray-600">{formatDate(sale.startDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Fecha Esperada de Cierre</p>
                          <p className="text-sm text-gray-600">{formatDate(sale.expectedCloseDate)}</p>
                        </div>
                      </div>

                      {sale.actualCloseDate && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Fecha Real de Cierre</p>
                            <p className="text-sm text-gray-600">{formatDate(sale.actualCloseDate)}</p>
                          </div>
                        </div>
                      )}

                      {/* Duración */}
                      {sale.startDate && sale.expectedCloseDate && (
                        <>
                          <Separator />
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Duración Estimada</p>
                            <p className="font-semibold">
                              {Math.ceil(
                                (new Date(sale.expectedCloseDate) - new Date(sale.startDate)) / 
                                (1000 * 60 * 60 * 24)
                              )} días
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Partes Involucradas */}
            <TabsContent value="parties" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Propiedad */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Propiedad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{sale.property?.title || "No especificada"}</p>
                      {sale.property?.address && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {sale.property.address}
                        </p>
                      )}
                    </div>
                    {sale.property?.type && (
                      <Badge variant="outline">{sale.property.type}</Badge>
                    )}
                    {sale.property?.price && (
                      <p className="text-sm text-gray-600">
                        Precio Lista: {formatPrice(sale.property.price, sale.property.currency)}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Propietario */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Propietario
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">
                        {sale.owner?.nombre && sale.owner?.apellido 
                          ? `${sale.owner.nombre} ${sale.owner.apellido}`
                          : "No especificado"
                        }
                      </p>
                    </div>
                    {sale.owner?.email && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {sale.owner.email}
                      </p>
                    )}
                    {sale.owner?.telefono && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {sale.owner.telefono}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Prospecto */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Prospecto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">
                        {sale.prospect?.nombre && sale.prospect?.apellido 
                          ? `${sale.prospect.nombre} ${sale.prospect.apellido}`
                          : "No especificado"
                        }
                      </p>
                    </div>
                    {sale.prospect?.email && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {sale.prospect.email}
                      </p>
                    )}
                    {sale.prospect?.telefono && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {sale.prospect.telefono}
                      </p>
                    )}
                    {sale.prospect?.estado && (
                      <Badge variant="outline">{sale.prospect.estado}</Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Términos y Condiciones */}
            <TabsContent value="terms" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Términos de Pago */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Términos de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Método de Pago</p>
                        <p className="text-base">
                          {sale.terms?.paymentMethod || "No especificado"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Costos de Cierre</p>
                        <p className="text-base">
                          {sale.terms?.closingCosts || "No especificados"}
                        </p>
                      </div>

                      {sale.terms?.inspectionDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Fecha de Inspección</p>
                          <p className="text-base flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(sale.terms.inspectionDate)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Documentos Requeridos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentos Requeridos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries({
                        propertyTitle: "Título de Propiedad",
                        taxClearance: "Libre Deuda",
                        utilityBills: "Servicios",
                        inspection: "Inspección",
                        appraisal: "Tasación",
                        insurance: "Seguro",
                        financing: "Financiamiento",
                        contract: "Contrato",
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center gap-2">
                          {sale.requiredDocuments?.[key] ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">{label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detalles Adicionales */}
              <div className="grid grid-cols-1 gap-4">
                {sale.terms?.financingDetails && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalles de Financiamiento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {sale.terms.financingDetails}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {sale.terms?.contingencies && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Contingencias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {sale.terms.contingencies}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Tab: Seguimiento */}
            <TabsContent value="tracking" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Próximo Contacto */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Próximo Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sale.followUp?.nextContactDate ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Fecha</p>
                          <p className="text-base flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(sale.followUp.nextContactDate)}
                          </p>
                        </div>

                        {sale.followUp.contactMethod && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Método</p>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const IconComponent = getContactMethodIcon(sale.followUp.contactMethod);
                                return <IconComponent className="h-4 w-4" />;
                              })()}
                              <span className="capitalize">{sale.followUp.contactMethod}</span>
                            </div>
                          </div>
                        )}

                        {sale.followUp.reminderNotes && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Notas</p>
                            <p className="text-base text-gray-700">
                              {sale.followUp.reminderNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No hay contactos programados</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Información de Creación */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Información del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">ID de Venta</p>
                      <p className="text-base font-mono text-sm">
                        {sale._id}
                      </p>
                    </div>

                    {sale.createdAt && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                        <p className="text-base">
                          {formatDate(sale.createdAt)}
                        </p>
                      </div>
                    )}

                    {sale.updatedAt && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Última Actualización</p>
                        <p className="text-base">
                          {formatDate(sale.updatedAt)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
          {onEdit && (
            <Button onClick={() => onEdit(sale)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSaleModal;