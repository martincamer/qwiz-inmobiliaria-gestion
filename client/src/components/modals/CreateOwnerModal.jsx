import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOwners } from "@/contexts/OwnersContext";
import { toast } from "sonner";
import {
  User,
  MapPin,
  CreditCard,
  FileText,
  Settings,
  Save,
  X,
} from "lucide-react";

const CreateOwnerModal = ({ open, onOpenChange, onSuccess }) => {
  const { createOwner, isLoading } = useOwners();

  const [formData, setFormData] = useState({
    // Información personal
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    numeroIdentificacion: "",
    tipoIdentificacion: "DNI",

    // Dirección
    direccion: {
      calle: "",
      numero: "",
      piso: "",
      departamento: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
    },

    // Información bancaria
    informacionBancaria: {
      banco: "",
      tipoCuenta: "CAJA_AHORRO",
      numeroCuenta: "",
      cbu: "",
      alias: "",
    },

    // Información fiscal
    informacionFiscal: {
      condicionIva: "CONSUMIDOR_FINAL",
      ingresosBrutos: "",
    },

    // Configuración
    password: "",
    notas: "",
    configuracionNotificaciones: {
      email: true,
      sms: false,
      whatsapp: false,
    },
  });

  const [errors, setErrors] = useState({});

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones obligatorias
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido.trim())
      newErrors.apellido = "El apellido es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    if (!formData.numeroIdentificacion.trim())
      newErrors.numeroIdentificacion =
        "El número de identificación es obligatorio";

    // Validar email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Ingrese un email válido";
    }

    // Validar CBU si se proporciona
    if (
      formData.informacionBancaria.cbu &&
      formData.informacionBancaria.cbu.length !== 22
    ) {
      newErrors.cbu = "El CBU debe tener 22 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      const result = await createOwner(formData);

      if (result.success) {
        toast.success("Propietario creado exitosamente");
        onSuccess();
        resetForm();
      } else {
        // Mostrar errores específicos del servidor
        if (result.details && Array.isArray(result.details)) {
          // Mostrar errores de validación específicos
          result.details.forEach((validationError) => {
            const fieldName =
              validationError.field || validationError.param || "campo";
            const message =
              validationError.message ||
              validationError.msg ||
              "Error de validación";
            toast.error(`${fieldName}: ${message}`);
          });
        } else if (result.error) {
          // Mostrar error principal
          toast.error(result.error);
        } else {
          toast.error("Error al crear propietario");
        }
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);

      // Manejar errores de red o del cliente
      if (error.response?.data?.message) {
        const serverMessage = error.response.data.message;

        if (serverMessage.includes("email")) {
          toast.error("Ya existe un propietario con este email");
        } else if (
          serverMessage.includes("identificación") ||
          serverMessage.includes("identificacion")
        ) {
          toast.error(
            "Ya existe un propietario con este número de identificación"
          );
        } else {
          toast.error(serverMessage);
        }
      } else if (error.message) {
        toast.error("Error de conexión: " + error.message);
      } else {
        toast.error("Error inesperado al crear propietario");
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      numeroIdentificacion: "",
      tipoIdentificacion: "DNI",
      direccion: {
        calle: "",
        numero: "",
        piso: "",
        departamento: "",
        ciudad: "",
        provincia: "",
        codigoPostal: "",
      },
      informacionBancaria: {
        banco: "",
        tipoCuenta: "CAJA_AHORRO",
        numeroCuenta: "",
        cbu: "",
        alias: "",
      },
      informacionFiscal: {
        condicionIva: "CONSUMIDOR_FINAL",
        ingresosBrutos: "",
      },
      password: "",
      notas: "",
      configuracionNotificaciones: {
        email: true,
        sms: false,
        whatsapp: false,
      },
    });
    setErrors({});
  };

  // Manejar cierre del modal
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl max-h-auto h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Crear Nuevo Propietario
          </DialogTitle>
          <DialogDescription>
            Complete la información del nuevo propietario. Los campos marcados
            con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="direccion">Dirección</TabsTrigger>
              <TabsTrigger value="bancaria">Bancaria</TabsTrigger>
              <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
              <TabsTrigger value="configuracion">Config</TabsTrigger>
            </TabsList>

            {/* Información Personal */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Datos básicos del propietario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) =>
                          handleInputChange("nombre", e.target.value)
                        }
                        placeholder="Ingrese el nombre"
                        className={errors.nombre ? "border-red-500" : ""}
                      />
                      {errors.nombre && (
                        <p className="text-sm text-red-500">{errors.nombre}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) =>
                          handleInputChange("apellido", e.target.value)
                        }
                        placeholder="Ingrese el apellido"
                        className={errors.apellido ? "border-red-500" : ""}
                      />
                      {errors.apellido && (
                        <p className="text-sm text-red-500">
                          {errors.apellido}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="ejemplo@correo.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) =>
                          handleInputChange("telefono", e.target.value)
                        }
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Identificación</Label>
                      <Select
                        value={formData.tipoIdentificacion}
                        onValueChange={(value) =>
                          handleInputChange("tipoIdentificacion", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DNI">DNI</SelectItem>
                          <SelectItem value="CUIT">CUIT</SelectItem>
                          <SelectItem value="CUIL">CUIL</SelectItem>
                          <SelectItem value="RAZON_SOCIAL">
                            Razón Social
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroIdentificacion">
                        Número de Identificación *
                      </Label>
                      <Input
                        id="numeroIdentificacion"
                        value={formData.numeroIdentificacion}
                        onChange={(e) =>
                          handleInputChange(
                            "numeroIdentificacion",
                            e.target.value
                          )
                        }
                        placeholder="12345678"
                        className={
                          errors.numeroIdentificacion ? "border-red-500" : ""
                        }
                      />
                      {errors.numeroIdentificacion && (
                        <p className="text-sm text-red-500">
                          {errors.numeroIdentificacion}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña (opcional)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Contraseña para acceso al sistema"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dirección */}
            <TabsContent value="direccion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Dirección
                  </CardTitle>
                  <CardDescription>
                    Información de domicilio del propietario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="calle">Calle</Label>
                      <Input
                        id="calle"
                        value={formData.direccion.calle}
                        onChange={(e) =>
                          handleInputChange(
                            "calle",
                            e.target.value,
                            "direccion"
                          )
                        }
                        placeholder="Nombre de la calle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input
                        id="numero"
                        value={formData.direccion.numero}
                        onChange={(e) =>
                          handleInputChange(
                            "numero",
                            e.target.value,
                            "direccion"
                          )
                        }
                        placeholder="1234"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="piso">Piso</Label>
                      <Input
                        id="piso"
                        value={formData.direccion.piso}
                        onChange={(e) =>
                          handleInputChange("piso", e.target.value, "direccion")
                        }
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Input
                        id="departamento"
                        value={formData.direccion.departamento}
                        onChange={(e) =>
                          handleInputChange(
                            "departamento",
                            e.target.value,
                            "direccion"
                          )
                        }
                        placeholder="A"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        value={formData.direccion.ciudad}
                        onChange={(e) =>
                          handleInputChange(
                            "ciudad",
                            e.target.value,
                            "direccion"
                          )
                        }
                        placeholder="Buenos Aires"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provincia">Provincia</Label>
                      <Input
                        id="provincia"
                        value={formData.direccion.provincia}
                        onChange={(e) =>
                          handleInputChange(
                            "provincia",
                            e.target.value,
                            "direccion"
                          )
                        }
                        placeholder="Buenos Aires"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        value={formData.direccion.codigoPostal}
                        onChange={(e) =>
                          handleInputChange(
                            "codigoPostal",
                            e.target.value,
                            "direccion"
                          )
                        }
                        placeholder="1234"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Información Bancaria */}
            <TabsContent value="bancaria" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Información Bancaria
                  </CardTitle>
                  <CardDescription>
                    Datos bancarios para transferencias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco</Label>
                      <Input
                        id="banco"
                        value={formData.informacionBancaria.banco}
                        onChange={(e) =>
                          handleInputChange(
                            "banco",
                            e.target.value,
                            "informacionBancaria"
                          )
                        }
                        placeholder="Banco Nación"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Cuenta</Label>
                      <Select
                        value={formData.informacionBancaria.tipoCuenta}
                        onValueChange={(value) =>
                          handleInputChange(
                            "tipoCuenta",
                            value,
                            "informacionBancaria"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CAJA_AHORRO">
                            Caja de Ahorro
                          </SelectItem>
                          <SelectItem value="CORRIENTE">
                            Cuenta Corriente
                          </SelectItem>
                          <SelectItem value="AHORRO">Ahorro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroCuenta">Número de Cuenta</Label>
                      <Input
                        id="numeroCuenta"
                        value={formData.informacionBancaria.numeroCuenta}
                        onChange={(e) =>
                          handleInputChange(
                            "numeroCuenta",
                            e.target.value,
                            "informacionBancaria"
                          )
                        }
                        placeholder="1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alias">Alias</Label>
                      <Input
                        id="alias"
                        value={formData.informacionBancaria.alias}
                        onChange={(e) =>
                          handleInputChange(
                            "alias",
                            e.target.value,
                            "informacionBancaria"
                          )
                        }
                        placeholder="PROPIETARIO.CASA.AZUL"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cbu">CBU</Label>
                    <Input
                      id="cbu"
                      value={formData.informacionBancaria.cbu}
                      onChange={(e) =>
                        handleInputChange(
                          "cbu",
                          e.target.value,
                          "informacionBancaria"
                        )
                      }
                      placeholder="1234567890123456789012"
                      maxLength={22}
                      className={errors.cbu ? "border-red-500" : ""}
                    />
                    {errors.cbu && (
                      <p className="text-sm text-red-500">{errors.cbu}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      El CBU debe tener exactamente 22 dígitos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Información Fiscal */}
            <TabsContent value="fiscal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Información Fiscal
                  </CardTitle>
                  <CardDescription>
                    Datos fiscales y tributarios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Condición IVA</Label>
                      <Select
                        value={formData.informacionFiscal.condicionIva}
                        onValueChange={(value) =>
                          handleInputChange(
                            "condicionIva",
                            value,
                            "informacionFiscal"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CONSUMIDOR_FINAL">
                            Consumidor Final
                          </SelectItem>
                          <SelectItem value="RESPONSABLE_INSCRIPTO">
                            Responsable Inscripto
                          </SelectItem>
                          <SelectItem value="MONOTRIBUTISTA">
                            Monotributista
                          </SelectItem>
                          <SelectItem value="EXENTO">Exento</SelectItem>
                          <SelectItem value="RESPONSABLE_NO_INSCRIPTO">
                            Responsable No Inscripto
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ingresosBrutos">Ingresos Brutos</Label>
                      <Input
                        id="ingresosBrutos"
                        value={formData.informacionFiscal.ingresosBrutos}
                        onChange={(e) =>
                          handleInputChange(
                            "ingresosBrutos",
                            e.target.value,
                            "informacionFiscal"
                          )
                        }
                        placeholder="123456789"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración */}
            <TabsContent value="configuracion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración
                  </CardTitle>
                  <CardDescription>
                    Preferencias y notas adicionales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      value={formData.notas}
                      onChange={(e) =>
                        handleInputChange("notas", e.target.value)
                      }
                      placeholder="Notas adicionales sobre el propietario..."
                      rows={4}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-medium">
                      Notificaciones
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="email-notifications"
                          checked={formData.configuracionNotificaciones.email}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "email",
                              checked,
                              "configuracionNotificaciones"
                            )
                          }
                        />
                        <Label htmlFor="email-notifications">
                          Notificaciones por Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sms-notifications"
                          checked={formData.configuracionNotificaciones.sms}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "sms",
                              checked,
                              "configuracionNotificaciones"
                            )
                          }
                        />
                        <Label htmlFor="sms-notifications">
                          Notificaciones por SMS
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="whatsapp-notifications"
                          checked={
                            formData.configuracionNotificaciones.whatsapp
                          }
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "whatsapp",
                              checked,
                              "configuracionNotificaciones"
                            )
                          }
                        />
                        <Label htmlFor="whatsapp-notifications">
                          Notificaciones por WhatsApp
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Creando..." : "Crear Propietario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOwnerModal;
