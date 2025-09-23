import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  FileText,
  Star,
  Building,
  Home,
  AlertCircle,
  Edit,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Target,
} from "lucide-react";
import { useProspects } from "@/contexts/ProspectsContext";
import { toast } from "sonner";

const ViewProspectModal = ({ open, onOpenChange, prospect, onEdit }) => {
  const { addInteraction, addShownProperty } = useProspects();
  const [activeTab, setActiveTab] = useState("details");
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [showAddShownProperty, setShowAddShownProperty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para nueva interacción
  const [newInteraction, setNewInteraction] = useState({
    tipo: "",
    descripcion: "",
    resultado: "",
    proximaAccion: "",
    fechaProgramada: "",
  });

  // Estados para propiedad mostrada
  const [newShownProperty, setNewShownProperty] = useState({
    propiedadId: "",
    fechaMuestra: "",
    feedback: "",
    nivelInteres: "",
    calificacion: "",
  });

  // Limpiar formularios cuando se abre/cierra el modal
  useEffect(() => {
    if (open) {
      setActiveTab("details");
      setShowAddInteraction(false);
      setShowAddShownProperty(false);
      setNewInteraction({
        tipo: "",
        descripcion: "",
        resultado: "",
        proximaAccion: "",
        fechaProgramada: "",
      });
      setNewShownProperty({
        propiedadId: "",
        fechaMuestra: "",
        feedback: "",
        nivelInteres: "",
        calificacion: "",
      });
    }
  }, [open]);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Formatear fecha y hora
  const formatDateTime = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  // Manejar agregar interacción
  const handleAddInteraction = async () => {
    if (!newInteraction.tipo || !newInteraction.descripcion) {
      toast.error("Tipo y descripción son requeridos");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addInteraction(prospect._id, newInteraction);
      if (result.success) {
        toast.success("Interacción agregada exitosamente");
        setShowAddInteraction(false);
        setNewInteraction({
          tipo: "",
          descripcion: "",
          resultado: "",
          proximaAccion: "",
          fechaProgramada: "",
        });
      } else {
        toast.error(result.error || "Error al agregar interacción");
      }
    } catch (error) {
      toast.error("Error al agregar interacción");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar agregar propiedad mostrada
  const handleAddShownProperty = async () => {
    if (!newShownProperty.propiedadId || !newShownProperty.fechaMuestra) {
      toast.error("Propiedad y fecha son requeridos");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addShownProperty(prospect._id, newShownProperty);
      if (result.success) {
        toast.success("Propiedad mostrada agregada exitosamente");
        setShowAddShownProperty(false);
        setNewShownProperty({
          propiedadId: "",
          fechaMuestra: "",
          feedback: "",
          nivelInteres: "",
          calificacion: "",
        });
      } else {
        toast.error(result.error || "Error al agregar propiedad mostrada");
      }
    } catch (error) {
      toast.error("Error al agregar propiedad mostrada");
    } finally {
      setIsLoading(false);
    }
  };

  if (!prospect) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {prospect.nombre} {prospect.apellido}
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(prospect.estado)}
              {getPriorityBadge(prospect.prioridad)}
            </div>
          </DialogTitle>
          <DialogDescription>
            Información completa del prospecto y su historial de interacciones
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="interactions">Interacciones</TabsTrigger>
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>

          {/* Detalles del Prospecto */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Información Personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Nombre:</span>
                    <span className="text-sm">
                      {prospect.nombre} {prospect.apellido}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tipo Cliente:</span>
                    <span className="text-sm">
                      {prospect.tipoCliente || "No especificado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Fecha Nacimiento:
                    </span>
                    <span className="text-sm">
                      {formatDate(prospect.fechaNacimiento)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Fecha Registro:</span>
                    <span className="text-sm">
                      {formatDate(prospect.fechaRegistro)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{prospect.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Teléfono:</span>
                    <span className="text-sm">{prospect.telefono}</span>
                  </div>
                  {prospect.telefonoSecundario && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Tel. Secundario:
                      </span>
                      <span className="text-sm">
                        {prospect.telefonoSecundario}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Dirección:</span>
                    <span className="text-sm">
                      {prospect.direccion || "No especificada"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Interés */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Interés en Propiedades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tipo Propiedad:</span>
                    <span className="text-sm">
                      {prospect.tipoPropiedad || "No especificado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ubicación:</span>
                    <span className="text-sm">
                      {prospect.ubicacionPreferida || "No especificada"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Presupuesto:</span>
                    <span className="text-sm">
                      {prospect.presupuestoMin && prospect.presupuestoMax
                        ? `$${prospect.presupuestoMin.toLocaleString()} - $${prospect.presupuestoMax.toLocaleString()}`
                        : prospect.presupuestoMax
                        ? `Hasta $${prospect.presupuestoMax.toLocaleString()}`
                        : "No especificado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Habitaciones:</span>
                    <span className="text-sm">
                      {prospect.habitaciones || "No especificado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Baños:</span>
                    <span className="text-sm">
                      {prospect.baños || "No especificado"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Estado y Seguimiento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Estado y Seguimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    {getStatusBadge(prospect.estado)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Prioridad:</span>
                    {getPriorityBadge(prospect.prioridad)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Origen:</span>
                    <span className="text-sm">{prospect.origen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Agente:</span>
                    <span className="text-sm">
                      {prospect.agenteAsignado?.nombre || "No asignado"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Características Especiales */}
            {prospect.caracteristicasEspeciales && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Características Especiales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {prospect.caracteristicasEspeciales}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Interacciones */}
          <TabsContent value="interactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Historial de Interacciones
              </h3>
              <Button onClick={() => setShowAddInteraction(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Interacción
              </Button>
            </div>

            {showAddInteraction && (
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Nueva Interacción</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Interacción</Label>
                      <Select
                        value={newInteraction.tipo}
                        onValueChange={(value) =>
                          setNewInteraction({ ...newInteraction, tipo: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Llamada">Llamada</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Reunión">Reunión</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Visita">Visita</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Programada</Label>
                      <Input
                        type="datetime-local"
                        value={newInteraction.fechaProgramada}
                        onChange={(e) =>
                          setNewInteraction({
                            ...newInteraction,
                            fechaProgramada: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={newInteraction.descripcion}
                      onChange={(e) =>
                        setNewInteraction({
                          ...newInteraction,
                          descripcion: e.target.value,
                        })
                      }
                      placeholder="Describe la interacción..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resultado</Label>
                    <Textarea
                      value={newInteraction.resultado}
                      onChange={(e) =>
                        setNewInteraction({
                          ...newInteraction,
                          resultado: e.target.value,
                        })
                      }
                      placeholder="¿Cuál fue el resultado?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Próxima Acción</Label>
                    <Input
                      value={newInteraction.proximaAccion}
                      onChange={(e) =>
                        setNewInteraction({
                          ...newInteraction,
                          proximaAccion: e.target.value,
                        })
                      }
                      placeholder="¿Qué hacer a continuación?"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddInteraction} disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar Interacción"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddInteraction(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Interacciones */}
            <div className="space-y-3">
              {prospect.interacciones && prospect.interacciones.length > 0 ? (
                prospect.interacciones.map((interaction, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{interaction.tipo}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(interaction.fecha)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{interaction.descripcion}</p>
                      {interaction.resultado && (
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>Resultado:</strong> {interaction.resultado}
                        </p>
                      )}
                      {interaction.proximaAccion && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Próxima acción:</strong>{" "}
                          {interaction.proximaAccion}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No hay interacciones registradas
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Propiedades Mostradas */}
          <TabsContent value="properties" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Propiedades Mostradas</h3>
              <Button onClick={() => setShowAddShownProperty(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Propiedad
              </Button>
            </div>

            {showAddShownProperty && (
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Propiedad Mostrada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ID de Propiedad</Label>
                      <Input
                        value={newShownProperty.propiedadId}
                        onChange={(e) =>
                          setNewShownProperty({
                            ...newShownProperty,
                            propiedadId: e.target.value,
                          })
                        }
                        placeholder="ID de la propiedad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Muestra</Label>
                      <Input
                        type="datetime-local"
                        value={newShownProperty.fechaMuestra}
                        onChange={(e) =>
                          setNewShownProperty({
                            ...newShownProperty,
                            fechaMuestra: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nivel de Interés</Label>
                      <Select
                        value={newShownProperty.nivelInteres}
                        onValueChange={(value) =>
                          setNewShownProperty({
                            ...newShownProperty,
                            nivelInteres: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alto">Alto</SelectItem>
                          <SelectItem value="Medio">Medio</SelectItem>
                          <SelectItem value="Bajo">Bajo</SelectItem>
                          <SelectItem value="Nulo">Nulo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Calificación (1-5)</Label>
                      <Select
                        value={newShownProperty.calificacion}
                        onValueChange={(value) =>
                          setNewShownProperty({
                            ...newShownProperty,
                            calificacion: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Calificación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Muy malo</SelectItem>
                          <SelectItem value="2">2 - Malo</SelectItem>
                          <SelectItem value="3">3 - Regular</SelectItem>
                          <SelectItem value="4">4 - Bueno</SelectItem>
                          <SelectItem value="5">5 - Excelente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Feedback</Label>
                    <Textarea
                      value={newShownProperty.feedback}
                      onChange={(e) =>
                        setNewShownProperty({
                          ...newShownProperty,
                          feedback: e.target.value,
                        })
                      }
                      placeholder="Comentarios del prospecto sobre la propiedad..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddShownProperty}
                      disabled={isLoading}
                    >
                      {isLoading ? "Guardando..." : "Guardar Propiedad"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddShownProperty(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Propiedades Mostradas */}
            <div className="space-y-3">
              {prospect.propiedadesMostradas &&
              prospect.propiedadesMostradas.length > 0 ? (
                prospect.propiedadesMostradas.map((property, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Propiedad {property.propiedadId}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(property.fechaMuestra)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              property.nivelInteres === "Alto"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {property.nivelInteres}
                          </Badge>
                          {property.calificacion && (
                            <Badge variant="outline">
                              {property.calificacion}/5 ⭐
                            </Badge>
                          )}
                        </div>
                      </div>
                      {property.feedback && (
                        <p className="text-sm text-muted-foreground">
                          {property.feedback}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No se han mostrado propiedades
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Notas */}
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notas del Prospecto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prospect.notas ? (
                  <p className="text-sm whitespace-pre-wrap">
                    {prospect.notas}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay notas registradas para este prospecto.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Prospecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProspectModal;
