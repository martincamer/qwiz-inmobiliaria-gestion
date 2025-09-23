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
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Star,
  Users,
  Building,
  Home,
  AlertCircle,
} from "lucide-react";
import { useProspects } from "@/contexts/ProspectsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CreateProspectModal = ({ open, onOpenChange, onSuccess }) => {
  const { createProspect } = useProspects();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [newProspect, setNewProspect] = useState({
    // Información personal
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    telefonoSecundario: "",
    fechaNacimiento: "",
    
    // Información de contacto
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    
    // Información de interés
    tipoCliente: "Comprador",
    tipoPropiedad: "",
    ubicacionPreferida: "",
    presupuestoMin: "",
    presupuestoMax: "",
    habitaciones: "",
    baños: "",
    caracteristicasEspeciales: "",
    
    // Estado y seguimiento
    estado: "Nuevo",
    origen: "",
    prioridad: "Media",
    notas: "",
    agenteAsignado: user?._id || "",
  });

  // Limpiar formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (open) {
      setNewProspect({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        telefonoSecundario: "",
        fechaNacimiento: "",
        direccion: "",
        ciudad: "",
        provincia: "",
        codigoPostal: "",
        tipoCliente: "Comprador",
        tipoPropiedad: "",
        ubicacionPreferida: "",
        presupuestoMin: "",
        presupuestoMax: "",
        habitaciones: "",
        baños: "",
        caracteristicasEspeciales: "",
        estado: "Nuevo",
        origen: "",
        prioridad: "Media",
        notas: "",
        agenteAsignado: user?._id || "",
      });
      setErrors({});
    }
  }, [open, user]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones requeridas
    if (!newProspect.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!newProspect.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    if (!newProspect.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(newProspect.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!newProspect.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    }

    if (!newProspect.origen.trim()) {
      newErrors.origen = "El origen es requerido";
    }

    // Validaciones de presupuesto
    if (newProspect.presupuestoMin && newProspect.presupuestoMax) {
      const min = parseFloat(newProspect.presupuestoMin);
      const max = parseFloat(newProspect.presupuestoMax);
      if (min > max) {
        newErrors.presupuestoMax = "El presupuesto máximo debe ser mayor al mínimo";
      }
    }

    // Validaciones numéricas
    if (newProspect.habitaciones && isNaN(newProspect.habitaciones)) {
      newErrors.habitaciones = "Debe ser un número válido";
    }

    if (newProspect.baños && isNaN(newProspect.baños)) {
      newErrors.baños = "Debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para envío
      const prospectData = {
        ...newProspect,
        presupuestoMin: newProspect.presupuestoMin ? parseFloat(newProspect.presupuestoMin) : undefined,
        presupuestoMax: newProspect.presupuestoMax ? parseFloat(newProspect.presupuestoMax) : undefined,
        habitaciones: newProspect.habitaciones ? parseInt(newProspect.habitaciones) : undefined,
        baños: newProspect.baños ? parseInt(newProspect.baños) : undefined,
      };

      // Limpiar campos vacíos
      Object.keys(prospectData).forEach(key => {
        if (prospectData[key] === "" || prospectData[key] === undefined) {
          delete prospectData[key];
        }
      });

      const result = await createProspect(prospectData);
      
      if (result.success) {
        toast.success("Prospecto creado exitosamente");
        onSuccess();
      } else {
        toast.error(result.error || "Error al crear prospecto");
      }
    } catch (error) {
      console.error("Error creating prospect:", error);
      toast.error("Error al crear prospecto");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en los campos
  const handleInputChange = (field, value) => {
    setNewProspect(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Crear Nuevo Prospecto
          </DialogTitle>
          <DialogDescription>
            Completa la información del nuevo prospecto. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contacto</TabsTrigger>
              <TabsTrigger value="interest">Interés</TabsTrigger>
              <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
            </TabsList>

            {/* Información Personal */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">
                        Nombre *
                        {errors.nombre && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.nombre})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="nombre"
                        value={newProspect.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        placeholder="Nombre del prospecto"
                        className={errors.nombre ? "border-red-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">
                        Apellido *
                        {errors.apellido && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.apellido})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="apellido"
                        value={newProspect.apellido}
                        onChange={(e) => handleInputChange("apellido", e.target.value)}
                        placeholder="Apellido del prospecto"
                        className={errors.apellido ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email *
                        {errors.email && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.email})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newProspect.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@ejemplo.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={newProspect.fechaNacimiento}
                        onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
                    <Select
                      value={newProspect.tipoCliente}
                      onValueChange={(value) => handleInputChange("tipoCliente", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Comprador">Comprador</SelectItem>
                        <SelectItem value="Vendedor">Vendedor</SelectItem>
                        <SelectItem value="Inquilino">Inquilino</SelectItem>
                        <SelectItem value="Propietario">Propietario</SelectItem>
                        <SelectItem value="Inversor">Inversor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Información de Contacto */}
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">
                        Teléfono Principal *
                        {errors.telefono && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.telefono})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="telefono"
                        value={newProspect.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="+54 11 1234-5678"
                        className={errors.telefono ? "border-red-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefonoSecundario">Teléfono Secundario</Label>
                      <Input
                        id="telefonoSecundario"
                        value={newProspect.telefonoSecundario}
                        onChange={(e) => handleInputChange("telefonoSecundario", e.target.value)}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={newProspect.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                      placeholder="Calle, número, piso, departamento"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        value={newProspect.ciudad}
                        onChange={(e) => handleInputChange("ciudad", e.target.value)}
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provincia">Provincia</Label>
                      <Input
                        id="provincia"
                        value={newProspect.provincia}
                        onChange={(e) => handleInputChange("provincia", e.target.value)}
                        placeholder="Provincia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        value={newProspect.codigoPostal}
                        onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                        placeholder="1234"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Información de Interés */}
            <TabsContent value="interest" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Interés en Propiedades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoPropiedad">Tipo de Propiedad</Label>
                      <Select
                        value={newProspect.tipoPropiedad}
                        onValueChange={(value) => handleInputChange("tipoPropiedad", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Departamento">Departamento</SelectItem>
                          <SelectItem value="PH">PH</SelectItem>
                          <SelectItem value="Oficina">Oficina</SelectItem>
                          <SelectItem value="Local">Local</SelectItem>
                          <SelectItem value="Terreno">Terreno</SelectItem>
                          <SelectItem value="Galpón">Galpón</SelectItem>
                          <SelectItem value="Quinta">Quinta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ubicacionPreferida">Ubicación Preferida</Label>
                      <Input
                        id="ubicacionPreferida"
                        value={newProspect.ubicacionPreferida}
                        onChange={(e) => handleInputChange("ubicacionPreferida", e.target.value)}
                        placeholder="Barrio, zona, ciudad"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="presupuestoMin">
                        Presupuesto Mínimo
                        {errors.presupuestoMin && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.presupuestoMin})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="presupuestoMin"
                        type="number"
                        value={newProspect.presupuestoMin}
                        onChange={(e) => handleInputChange("presupuestoMin", e.target.value)}
                        placeholder="100000"
                        className={errors.presupuestoMin ? "border-red-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="presupuestoMax">
                        Presupuesto Máximo
                        {errors.presupuestoMax && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.presupuestoMax})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="presupuestoMax"
                        type="number"
                        value={newProspect.presupuestoMax}
                        onChange={(e) => handleInputChange("presupuestoMax", e.target.value)}
                        placeholder="500000"
                        className={errors.presupuestoMax ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="habitaciones">
                        Habitaciones
                        {errors.habitaciones && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.habitaciones})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="habitaciones"
                        type="number"
                        value={newProspect.habitaciones}
                        onChange={(e) => handleInputChange("habitaciones", e.target.value)}
                        placeholder="3"
                        min="1"
                        className={errors.habitaciones ? "border-red-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baños">
                        Baños
                        {errors.baños && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.baños})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="baños"
                        type="number"
                        value={newProspect.baños}
                        onChange={(e) => handleInputChange("baños", e.target.value)}
                        placeholder="2"
                        min="1"
                        className={errors.baños ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caracteristicasEspeciales">Características Especiales</Label>
                    <Textarea
                      id="caracteristicasEspeciales"
                      value={newProspect.caracteristicasEspeciales}
                      onChange={(e) => handleInputChange("caracteristicasEspeciales", e.target.value)}
                      placeholder="Piscina, jardín, garage, etc."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Seguimiento */}
            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Estado y Seguimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select
                        value={newProspect.estado}
                        onValueChange={(value) => handleInputChange("estado", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Label htmlFor="origen">
                        Origen *
                        {errors.origen && (
                          <span className="text-red-500 text-sm ml-1">
                            ({errors.origen})
                          </span>
                        )}
                      </Label>
                      <Select
                        value={newProspect.origen}
                        onValueChange={(value) => handleInputChange("origen", value)}
                      >
                        <SelectTrigger className={errors.origen ? "border-red-500" : ""}>
                          <SelectValue placeholder="¿Cómo nos conoció?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web">Página Web</SelectItem>
                          <SelectItem value="Referido">Referido</SelectItem>
                          <SelectItem value="Redes Sociales">Redes Sociales</SelectItem>
                          <SelectItem value="Publicidad">Publicidad</SelectItem>
                          <SelectItem value="Llamada">Llamada Directa</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prioridad">Prioridad</Label>
                      <Select
                        value={newProspect.prioridad}
                        onValueChange={(value) => handleInputChange("prioridad", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Media">Media</SelectItem>
                          <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      value={newProspect.notas}
                      onChange={(e) => handleInputChange("notas", e.target.value)}
                      placeholder="Notas adicionales sobre el prospecto..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Crear Prospecto
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProspectModal;