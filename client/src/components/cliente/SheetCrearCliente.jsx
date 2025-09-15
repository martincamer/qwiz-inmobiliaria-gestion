import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Users,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";

const SheetCrearCliente = ({ onClienteCreated }) => {
  const { createCliente, isLoading, error } = useCliente();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipoPersona: "fisica",
    nombreCompleto: "",
    razonSocial: "",
    dni: "",
    fechaNacimiento: "",
    nacionalidad: "Argentina",
    estadoCivil: "soltero",
    profesion: "",
    datosFiscales: {
      condicionIva: "consumidor_final",
      cuit: "",
      categoriaMonotributo: "A",
      actividadPrincipal: {
        codigo: "",
        descripcion: "",
      },
    },
    contacto: {
      telefono: "",
      celular: "",
      email: "",
      sitioWeb: "",
    },
    direccionFiscal: {
      calle: "",
      numero: "",
      piso: "",
      departamento: "",
      localidad: "",
      provincia: "",
      codigoPostal: "",
      pais: "Argentina",
    },
    configuracionComercial: {
      limiteCredito: 0,
      diasCredito: 0,
      descuentoGeneral: 0,
      observacionesComerciales: "",
    },
  });

  const resetForm = () => {
    setFormData({
      tipoPersona: "fisica",
      nombreCompleto: "",
      razonSocial: "",
      dni: "",
      fechaNacimiento: "",
      nacionalidad: "Argentina",
      estadoCivil: "soltero",
      profesion: "",
      datosFiscales: {
        condicionIva: "consumidor_final",
        cuit: "",
        categoriaMonotributo: "A",
        actividadPrincipal: {
          codigo: "",
          descripcion: "",
        },
      },
      contacto: {
        telefono: "",
        celular: "",
        email: "",
        sitioWeb: "",
      },
      direccionFiscal: {
        calle: "",
        numero: "",
        piso: "",
        departamento: "",
        localidad: "",
        provincia: "",
        codigoPostal: "",
        pais: "Argentina",
      },
      configuracionComercial: {
        limiteCredito: 0,
        diasCredito: 0,
        descuentoGeneral: 0,
        observacionesComerciales: "",
      },
    });
  };

  const handleCreate = async () => {
    try {
      // Validaciones adicionales
      if (
        formData.tipoPersona === "fisica" &&
        (formData.dni.length < 7 || formData.dni.length > 8)
      ) {
        return;
      }

      if (
        formData.datosFiscales.condicionIva === "monotributista" &&
        !formData.datosFiscales.categoriaMonotributo
      ) {
        return;
      }

      const result = await createCliente(formData);
      if (result.success) {
        setIsOpen(false);
        resetForm();
        if (onClienteCreated) {
          onClienteCreated();
        }
      }
    } catch (error) {
      console.error("Error creating cliente:", error);
    }
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      resetForm();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-2xl max-md:max-w-xl p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Crear Nuevo Cliente
          </SheetTitle>
          <SheetDescription>
            Registra un nuevo cliente con sus datos personales y comerciales
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-6 py-4 px-2">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Tipo de Persona */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <h3 className="text-lg font-medium">Tipo de Persona</h3>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipoPersona" className="text-sm font-medium">
                  Tipo de Persona *
                </Label>
                <Select
                  value={formData.tipoPersona}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipoPersona: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fisica">Persona Física</SelectItem>
                    <SelectItem value="juridica">Persona Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Datos Básicos */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <h3 className="text-lg font-medium">Datos Básicos</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="nombreCompleto"
                    className="text-sm font-medium"
                  >
                    {formData.tipoPersona === "fisica"
                      ? "Nombre Completo"
                      : "Nombre de Fantasía"}{" "}
                    *
                  </Label>
                  <Input
                    id="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombreCompleto: e.target.value,
                      })
                    }
                    placeholder={
                      formData.tipoPersona === "fisica"
                        ? "Juan Pérez"
                        : "Mi Empresa SRL"
                    }
                  />
                </div>

                {formData.tipoPersona === "juridica" && (
                  <div className="grid gap-2">
                    <Label
                      htmlFor="razonSocial"
                      className="text-sm font-medium"
                    >
                      Razón Social *
                    </Label>
                    <Input
                      id="razonSocial"
                      value={formData.razonSocial}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          razonSocial: e.target.value,
                        })
                      }
                      placeholder="Mi Empresa Sociedad de Responsabilidad Limitada"
                    />
                  </div>
                )}

                {formData.tipoPersona === "fisica" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="dni" className="text-sm font-medium">
                        DNI *
                      </Label>
                      <Input
                        id="dni"
                        value={formData.dni}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 7);
                          setFormData({ ...formData, dni: value });
                        }}
                        placeholder="1234567"
                        maxLength={7}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="fechaNacimiento"
                        className="text-sm font-medium"
                      >
                        Fecha de Nacimiento *
                      </Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fechaNacimiento: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="estadoCivil"
                        className="text-sm font-medium"
                      >
                        Estado Civil *
                      </Label>
                      <Select
                        value={formData.estadoCivil}
                        onValueChange={(value) =>
                          setFormData({ ...formData, estadoCivil: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soltero">Soltero/a</SelectItem>
                          <SelectItem value="casado">Casado/a</SelectItem>
                          <SelectItem value="divorciado">
                            Divorciado/a
                          </SelectItem>
                          <SelectItem value="viudo">Viudo/a</SelectItem>
                          <SelectItem value="union_convivencial">
                            Unión Convivencial
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="profesion"
                        className="text-sm font-medium"
                      >
                        Profesión
                      </Label>
                      <Input
                        id="profesion"
                        value={formData.profesion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profesion: e.target.value,
                          })
                        }
                        placeholder="Contador, Médico, etc."
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Datos Fiscales */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <h3 className="text-lg font-medium">Datos Fiscales</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="condicionIva" className="text-sm font-medium">
                    Condición IVA *
                  </Label>
                  <Select
                    value={formData.datosFiscales.condicionIva}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        datosFiscales: {
                          ...formData.datosFiscales,
                          condicionIva: value,
                          categoriaMonotributo:
                            value === "monotributista" ? "A" : "",
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar condición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="responsable_inscripto">
                        Responsable Inscripto
                      </SelectItem>
                      <SelectItem value="monotributista">
                        Monotributista
                      </SelectItem>
                      <SelectItem value="exento">Exento</SelectItem>
                      <SelectItem value="consumidor_final">
                        Consumidor Final
                      </SelectItem>
                      <SelectItem value="no_responsable">
                        No Responsable
                      </SelectItem>
                      <SelectItem value="responsable_no_inscripto">
                        Responsable No Inscripto
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.datosFiscales.condicionIva ===
                  "responsable_inscripto" ||
                  formData.datosFiscales.condicionIva === "monotributista") && (
                  <div className="grid gap-2">
                    <Label htmlFor="cuit" className="text-sm font-medium">
                      CUIT *
                    </Label>
                    <Input
                      id="cuit"
                      value={formData.datosFiscales.cuit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          datosFiscales: {
                            ...formData.datosFiscales,
                            cuit: e.target.value,
                          },
                        })
                      }
                      placeholder="20-12345678-9"
                    />
                  </div>
                )}

                {formData.datosFiscales.condicionIva === "monotributista" && (
                  <div className="grid gap-2">
                    <Label
                      htmlFor="categoriaMonotributo"
                      className="text-sm font-medium"
                    >
                      Categoría Monotributo *
                    </Label>
                    <Select
                      value={formData.datosFiscales.categoriaMonotributo}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          datosFiscales: {
                            ...formData.datosFiscales,
                            categoriaMonotributo: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Categoría A</SelectItem>
                        <SelectItem value="B">Categoría B</SelectItem>
                        <SelectItem value="C">Categoría C</SelectItem>
                        <SelectItem value="D">Categoría D</SelectItem>
                        <SelectItem value="E">Categoría E</SelectItem>
                        <SelectItem value="F">Categoría F</SelectItem>
                        <SelectItem value="G">Categoría G</SelectItem>
                        <SelectItem value="H">Categoría H</SelectItem>
                        <SelectItem value="I">Categoría I</SelectItem>
                        <SelectItem value="J">Categoría J</SelectItem>
                        <SelectItem value="K">Categoría K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label
                    htmlFor="actividadCodigo"
                    className="text-sm font-medium"
                  >
                    Código de Actividad
                  </Label>
                  <Input
                    id="actividadCodigo"
                    value={formData.datosFiscales.actividadPrincipal.codigo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        datosFiscales: {
                          ...formData.datosFiscales,
                          actividadPrincipal: {
                            ...formData.datosFiscales.actividadPrincipal,
                            codigo: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="123456"
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label
                    htmlFor="actividadDescripcion"
                    className="text-sm font-medium"
                  >
                    Descripción de Actividad
                  </Label>
                  <Input
                    id="actividadDescripcion"
                    value={
                      formData.datosFiscales.actividadPrincipal.descripcion
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        datosFiscales: {
                          ...formData.datosFiscales,
                          actividadPrincipal: {
                            ...formData.datosFiscales.actividadPrincipal,
                            descripcion: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Servicios de contabilidad"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contacto */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <h3 className="text-lg font-medium">Datos de Contacto</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="telefono" className="text-sm font-medium">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    value={formData.contacto.telefono}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacto: {
                          ...formData.contacto,
                          telefono: e.target.value,
                        },
                      })
                    }
                    placeholder="011-1234-5678"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="celular" className="text-sm font-medium">
                    Celular
                  </Label>
                  <Input
                    id="celular"
                    value={formData.contacto.celular}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacto: {
                          ...formData.contacto,
                          celular: e.target.value,
                        },
                      })
                    }
                    placeholder="11-1234-5678"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contacto.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacto: {
                          ...formData.contacto,
                          email: e.target.value,
                        },
                      })
                    }
                    placeholder="cliente@email.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sitioWeb" className="text-sm font-medium">
                    Sitio Web
                  </Label>
                  <Input
                    id="sitioWeb"
                    value={formData.contacto.sitioWeb}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacto: {
                          ...formData.contacto,
                          sitioWeb: e.target.value,
                        },
                      })
                    }
                    placeholder="https://www.ejemplo.com"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Dirección */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <h3 className="text-lg font-medium">Dirección Fiscal</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="calle" className="text-sm font-medium">
                    Calle
                  </Label>
                  <Input
                    id="calle"
                    value={formData.direccionFiscal.calle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccionFiscal: {
                          ...formData.direccionFiscal,
                          calle: e.target.value,
                        },
                      })
                    }
                    placeholder="Av. Corrientes"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="numero" className="text-sm font-medium">
                    Número
                  </Label>
                  <Input
                    id="numero"
                    value={formData.direccionFiscal.numero}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccionFiscal: {
                          ...formData.direccionFiscal,
                          numero: e.target.value,
                        },
                      })
                    }
                    placeholder="1234"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="piso" className="text-sm font-medium">
                    Piso
                  </Label>
                  <Input
                    id="piso"
                    value={formData.direccionFiscal.piso}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccionFiscal: {
                          ...formData.direccionFiscal,
                          piso: e.target.value,
                        },
                      })
                    }
                    placeholder="5"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="departamento" className="text-sm font-medium">
                    Departamento
                  </Label>
                  <Input
                    id="departamento"
                    value={formData.direccionFiscal.departamento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccionFiscal: {
                          ...formData.direccionFiscal,
                          departamento: e.target.value,
                        },
                      })
                    }
                    placeholder="A"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="localidad" className="text-sm font-medium">
                    Localidad
                  </Label>
                  <Input
                    id="localidad"
                    value={formData.direccionFiscal.localidad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccionFiscal: {
                          ...formData.direccionFiscal,
                          localidad: e.target.value,
                        },
                      })
                    }
                    placeholder="CABA"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="provincia" className="text-sm font-medium">
                    Provincia
                  </Label>
                  <Input
                    id="provincia"
                    value={formData.direccionFiscal.provincia}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccionFiscal: {
                          ...formData.direccionFiscal,
                          provincia: e.target.value,
                        },
                      })
                    }
                    placeholder="Buenos Aires"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="codigoPostal" className="text-sm font-medium">
                    Código Postal
                  </Label>
                  <Input
                    id="codigoPostal"
                    value={formData.direccionFiscal.codigoPostal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccionFiscal: {
                          ...formData.direccionFiscal,
                          codigoPostal: e.target.value,
                        },
                      })
                    }
                    placeholder="1000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pais" className="text-sm font-medium">
                    País
                  </Label>
                  <Input
                    id="pais"
                    value={formData.direccionFiscal.pais}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccionFiscal: {
                          ...formData.direccionFiscal,
                          pais: e.target.value,
                        },
                      })
                    }
                    placeholder="Argentina"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Configuración Comercial */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <h3 className="text-lg font-medium">Configuración Comercial</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="limiteCredito"
                    className="text-sm font-medium"
                  >
                    Límite de Crédito
                  </Label>
                  <Input
                    id="limiteCredito"
                    type="number"
                    step="0.01"
                    value={formData.configuracionComercial.limiteCredito}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        configuracionComercial: {
                          ...formData.configuracionComercial,
                          limiteCredito: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="diasCredito" className="text-sm font-medium">
                    Días de Crédito
                  </Label>
                  <Input
                    id="diasCredito"
                    type="number"
                    value={formData.configuracionComercial.diasCredito}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        configuracionComercial: {
                          ...formData.configuracionComercial,
                          diasCredito: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="30"
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="descuentoGeneral"
                    className="text-sm font-medium"
                  >
                    Descuento General (%)
                  </Label>
                  <Input
                    id="descuentoGeneral"
                    type="number"
                    step="0.01"
                    value={formData.configuracionComercial.descuentoGeneral}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        configuracionComercial: {
                          ...formData.configuracionComercial,
                          descuentoGeneral: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2 md:col-span-3">
                  <Label
                    htmlFor="observacionesComerciales"
                    className="text-sm font-medium"
                  >
                    Observaciones Comerciales
                  </Label>
                  <Textarea
                    id="observacionesComerciales"
                    value={
                      formData.configuracionComercial.observacionesComerciales
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        configuracionComercial: {
                          ...formData.configuracionComercial,
                          observacionesComerciales: e.target.value,
                        },
                      })
                    }
                    placeholder="Observaciones adicionales sobre el cliente..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Creando..." : "Crear Cliente"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SheetCrearCliente;
