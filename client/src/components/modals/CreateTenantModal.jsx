import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTenants } from "@/contexts/TenantsContext";
import { useProperties } from "@/contexts/PropertiesContext";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  FileText,
  Save,
  AlertCircle,
  Users,
  Building,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

const CreateTenantModal = ({ open, onOpenChange, onSuccess }) => {
  const { createTenant, isLoading } = useTenants();
  const { properties, getProperties } = useProperties();

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Información personal
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    numeroDocumento: "",
    tipoDocumento: "DNI",

    // Dirección
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",

    // Información del alquiler
    propiedad: "",
    fechaInicioContrato: "",
    fechaFinContrato: "",
    montoAlquiler: "",
    montoDeposito: "",
    diaVencimiento: "10",

    // Estado y notas
    estado: "activo",
    notas: "",

    // Información de contacto de emergencia
    contactoEmergenciaNombre: "",
    contactoEmergenciaTelefono: "",
    contactoEmergenciaRelacion: "",

    // Información laboral
    ocupacion: "",
    empleador: "",
    ingresosMensuales: "",

    // Referencias
    referenciaPersonalNombre: "",
    referenciaPersonalTelefono: "",
    referenciaLaboralNombre: "",
    referenciaLaboralTelefono: "",
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Cargar propiedades al abrir el modal
  useEffect(() => {
    if (open) {
      getProperties({ disponible: true });
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Información personal
        if (!formData.nombre.trim()) {
          newErrors.nombre = "El nombre es requerido";
        }
        if (!formData.apellido.trim()) {
          newErrors.apellido = "El apellido es requerido";
        }
        if (!formData.email.trim()) {
          newErrors.email = "El email es requerido";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "El email no es válido";
        }
        if (!formData.telefono.trim()) {
          newErrors.telefono = "El teléfono es requerido";
        }
        if (!formData.numeroDocumento.trim()) {
          newErrors.numeroDocumento = "El número de documento es requerido";
        }
        break;

      case 2: // Dirección
        if (!formData.direccion.trim()) {
          newErrors.direccion = "La dirección es requerida";
        }
        if (!formData.ciudad.trim()) {
          newErrors.ciudad = "La ciudad es requerida";
        }
        if (!formData.provincia.trim()) {
          newErrors.provincia = "La provincia es requerida";
        }
        break;

      case 3: // Información del alquiler
        if (!formData.propiedad) {
          newErrors.propiedad = "Debe seleccionar una propiedad";
        }
        if (!formData.fechaInicioContrato) {
          newErrors.fechaInicioContrato = "La fecha de inicio es requerida";
        }
        if (!formData.fechaFinContrato) {
          newErrors.fechaFinContrato = "La fecha de fin es requerida";
        }
        if (!formData.montoAlquiler || formData.montoAlquiler <= 0) {
          newErrors.montoAlquiler = "El monto del alquiler es requerido";
        }
        break;

      case 4: // Información adicional (opcional)
        // No hay validaciones obligatorias en este paso
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los pasos
    let isValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        isValid = false;
        setCurrentStep(step);
        break;
      }
    }

    if (!isValid) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    try {
      const result = await createTenant(formData);

      if (result.success) {
        toast.success("Inquilino creado exitosamente");
        onSuccess();
        resetForm();
      } else {
        toast.error(result.error || "Error al crear inquilino");
      }
    } catch (error) {
      console.error("Error al crear inquilino:", error);
      toast.error("Error inesperado al crear inquilino");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      fechaNacimiento: "",
      numeroDocumento: "",
      tipoDocumento: "DNI",
      direccion: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      propiedad: "",
      fechaInicioContrato: "",
      fechaFinContrato: "",
      montoAlquiler: "",
      montoDeposito: "",
      diaVencimiento: "10",
      estado: "activo",
      notas: "",
      contactoEmergenciaNombre: "",
      contactoEmergenciaTelefono: "",
      contactoEmergenciaRelacion: "",
      ocupacion: "",
      empleador: "",
      ingresosMensuales: "",
      referenciaPersonalNombre: "",
      referenciaPersonalTelefono: "",
      referenciaLaboralNombre: "",
      referenciaLaboralTelefono: "",
    });
    setErrors({});
    setCurrentStep(1);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Personal
        </CardTitle>
        <CardDescription>Datos básicos del inquilino</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del inquilino"
              className={errors.nombre ? "border-red-500" : ""}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">
              Apellido <span className="text-red-500">*</span>
            </Label>
            <Input
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="Apellido del inquilino"
              className={errors.apellido ? "border-red-500" : ""}
            />
            {errors.apellido && (
              <p className="text-sm text-red-500">{errors.apellido}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@ejemplo.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="+54 11 1234-5678"
              className={errors.telefono ? "border-red-500" : ""}
            />
            {errors.telefono && (
              <p className="text-sm text-red-500">{errors.telefono}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
            <Select
              value={formData.tipoDocumento}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "tipoDocumento", value } })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DNI">DNI</SelectItem>
                <SelectItem value="CUIT">CUIT</SelectItem>
                <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroDocumento">
              Número de Documento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="numeroDocumento"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleInputChange}
              placeholder="12345678"
              className={errors.numeroDocumento ? "border-red-500" : ""}
            />
            {errors.numeroDocumento && (
              <p className="text-sm text-red-500">{errors.numeroDocumento}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
            <Input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Dirección
        </CardTitle>
        <CardDescription>
          Información de ubicación del inquilino
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="direccion">
              Dirección <span className="text-red-500">*</span>
            </Label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder="Calle, número, piso, departamento"
              className={errors.direccion ? "border-red-500" : ""}
            />
            {errors.direccion && (
              <p className="text-sm text-red-500">{errors.direccion}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ciudad">
              Ciudad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleInputChange}
              placeholder="Ciudad"
              className={errors.ciudad ? "border-red-500" : ""}
            />
            {errors.ciudad && (
              <p className="text-sm text-red-500">{errors.ciudad}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincia">
              Provincia <span className="text-red-500">*</span>
            </Label>
            <Input
              id="provincia"
              name="provincia"
              value={formData.provincia}
              onChange={handleInputChange}
              placeholder="Provincia"
              className={errors.provincia ? "border-red-500" : ""}
            />
            {errors.provincia && (
              <p className="text-sm text-red-500">{errors.provincia}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="codigoPostal">Código Postal</Label>
            <Input
              id="codigoPostal"
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleInputChange}
              placeholder="1234"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Información del Alquiler
        </CardTitle>
        <CardDescription>Detalles del contrato de alquiler</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="propiedad">
              Propiedad <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.propiedad}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "propiedad", value } })
              }
            >
              <SelectTrigger
                className={errors.propiedad ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Seleccionar propiedad" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property._id} value={property._id}>
                    {property.location?.address || property.title} -{" "}
                    {property.type} (
                    {property.pricing?.rentPrice
                      ? `$${property.pricing.rentPrice}`
                      : "Sin precio"}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propiedad && (
              <p className="text-sm text-red-500">{errors.propiedad}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaInicioContrato">
              Fecha Inicio Contrato <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fechaInicioContrato"
              name="fechaInicioContrato"
              type="date"
              value={formData.fechaInicioContrato}
              onChange={handleInputChange}
              className={errors.fechaInicioContrato ? "border-red-500" : ""}
            />
            {errors.fechaInicioContrato && (
              <p className="text-sm text-red-500">
                {errors.fechaInicioContrato}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaFinContrato">
              Fecha Fin Contrato <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fechaFinContrato"
              name="fechaFinContrato"
              type="date"
              value={formData.fechaFinContrato}
              onChange={handleInputChange}
              className={errors.fechaFinContrato ? "border-red-500" : ""}
            />
            {errors.fechaFinContrato && (
              <p className="text-sm text-red-500">{errors.fechaFinContrato}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="montoAlquiler">
              Monto Alquiler <span className="text-red-500">*</span>
            </Label>
            <Input
              id="montoAlquiler"
              name="montoAlquiler"
              type="number"
              value={formData.montoAlquiler}
              onChange={handleInputChange}
              placeholder="50000"
              min="0"
              step="0.01"
              className={errors.montoAlquiler ? "border-red-500" : ""}
            />
            {errors.montoAlquiler && (
              <p className="text-sm text-red-500">{errors.montoAlquiler}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="montoDeposito">Monto Depósito</Label>
            <Input
              id="montoDeposito"
              name="montoDeposito"
              type="number"
              value={formData.montoDeposito}
              onChange={handleInputChange}
              placeholder="50000"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diaVencimiento">Día de Vencimiento</Label>
            <Select
              value={formData.diaVencimiento.toString()}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "diaVencimiento", value: parseInt(value) },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "estado", value } })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Información Adicional
        </CardTitle>
        <CardDescription>Datos complementarios del inquilino</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contacto de emergencia */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Contacto de Emergencia</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactoEmergenciaNombre">Nombre</Label>
              <Input
                id="contactoEmergenciaNombre"
                name="contactoEmergenciaNombre"
                value={formData.contactoEmergenciaNombre}
                onChange={handleInputChange}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactoEmergenciaTelefono">Teléfono</Label>
              <Input
                id="contactoEmergenciaTelefono"
                name="contactoEmergenciaTelefono"
                type="tel"
                value={formData.contactoEmergenciaTelefono}
                onChange={handleInputChange}
                placeholder="+54 11 1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactoEmergenciaRelacion">Relación</Label>
              <Input
                id="contactoEmergenciaRelacion"
                name="contactoEmergenciaRelacion"
                value={formData.contactoEmergenciaRelacion}
                onChange={handleInputChange}
                placeholder="Padre, hermano, etc."
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Información laboral */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Información Laboral</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ocupacion">Ocupación</Label>
              <Input
                id="ocupacion"
                name="ocupacion"
                value={formData.ocupacion}
                onChange={handleInputChange}
                placeholder="Profesión u ocupación"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empleador">Empleador</Label>
              <Input
                id="empleador"
                name="empleador"
                value={formData.empleador}
                onChange={handleInputChange}
                placeholder="Empresa o empleador"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingresosMensuales">Ingresos Mensuales</Label>
              <Input
                id="ingresosMensuales"
                name="ingresosMensuales"
                type="number"
                value={formData.ingresosMensuales}
                onChange={handleInputChange}
                placeholder="100000"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Referencias */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Referencias</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referenciaPersonalNombre">
                Referencia Personal - Nombre
              </Label>
              <Input
                id="referenciaPersonalNombre"
                name="referenciaPersonalNombre"
                value={formData.referenciaPersonalNombre}
                onChange={handleInputChange}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenciaPersonalTelefono">
                Referencia Personal - Teléfono
              </Label>
              <Input
                id="referenciaPersonalTelefono"
                name="referenciaPersonalTelefono"
                type="tel"
                value={formData.referenciaPersonalTelefono}
                onChange={handleInputChange}
                placeholder="+54 11 1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenciaLaboralNombre">
                Referencia Laboral - Nombre
              </Label>
              <Input
                id="referenciaLaboralNombre"
                name="referenciaLaboralNombre"
                value={formData.referenciaLaboralNombre}
                onChange={handleInputChange}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenciaLaboralTelefono">
                Referencia Laboral - Teléfono
              </Label>
              <Input
                id="referenciaLaboralTelefono"
                name="referenciaLaboralTelefono"
                type="tel"
                value={formData.referenciaLaboralTelefono}
                onChange={handleInputChange}
                placeholder="+54 11 1234-5678"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Notas */}
        <div className="space-y-2">
          <Label htmlFor="notas">Notas</Label>
          <Textarea
            id="notas"
            name="notas"
            value={formData.notas}
            onChange={handleInputChange}
            rows={4}
            placeholder="Notas adicionales sobre el inquilino..."
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Nuevo Inquilino
          </DialogTitle>
          <DialogDescription>
            Crea un nuevo inquilino completando la información requerida
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dirección
              </TabsTrigger>
              <TabsTrigger value="rental" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Alquiler
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Adicional
              </TabsTrigger>
            </TabsList>

            {/* Tab: Información Personal */}
            <TabsContent value="personal" className="space-y-4">
              {renderStep1()}
            </TabsContent>

            {/* Tab: Dirección */}
            <TabsContent value="address" className="space-y-4">
              {renderStep2()}
            </TabsContent>

            {/* Tab: Información del Alquiler */}
            <TabsContent value="rental" className="space-y-4">
              {renderStep3()}
            </TabsContent>

            {/* Tab: Información Adicional
            <TabsContent value="additional" className="space-y-4">
              {renderStep4()}
            </TabsContent> */}
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Crear Inquilino
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTenantModal;
