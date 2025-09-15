import { useState } from "react";
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
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Receipt,
} from "lucide-react";
import { useCliente } from "../../contexts/ClienteContext";

const InformacionPersonal = ({ cliente, onUpdate }) => {
  const { updateCliente, isLoading, error } = useCliente();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipoPersona: cliente?.tipoPersona || "fisica",
    nombreCompleto: cliente?.nombreCompleto || "",
    razonSocial: cliente?.razonSocial || "",
    dni: cliente?.dni || "",
    fechaNacimiento: cliente?.fechaNacimiento ? cliente.fechaNacimiento.split('T')[0] : "",
    nacionalidad: cliente?.nacionalidad || "Argentina",
    estadoCivil: cliente?.estadoCivil || "soltero",
    profesion: cliente?.profesion || "",
    datosFiscales: {
      condicionIva: cliente?.datosFiscales?.condicionIva || "consumidor_final",
      cuit: cliente?.datosFiscales?.cuit || "",
      categoriaMonotributo: cliente?.datosFiscales?.categoriaMonotributo || "",
      actividadPrincipal: {
        codigo: cliente?.datosFiscales?.actividadPrincipal?.codigo || "",
        descripcion: cliente?.datosFiscales?.actividadPrincipal?.descripcion || "",
      },
    },
    contacto: {
      telefono: cliente?.contacto?.telefono || "",
      celular: cliente?.contacto?.celular || "",
      email: cliente?.contacto?.email || "",
      sitioWeb: cliente?.contacto?.sitioWeb || "",
    },
    direccionFiscal: {
      calle: cliente?.direccionFiscal?.calle || "",
      numero: cliente?.direccionFiscal?.numero || "",
      piso: cliente?.direccionFiscal?.piso || "",
      departamento: cliente?.direccionFiscal?.departamento || "",
      localidad: cliente?.direccionFiscal?.localidad || "",
      provincia: cliente?.direccionFiscal?.provincia || "",
      codigoPostal: cliente?.direccionFiscal?.codigoPostal || "",
      pais: cliente?.direccionFiscal?.pais || "Argentina",
    },
    configuracionComercial: {
      limiteCredito: cliente?.configuracionComercial?.limiteCredito || 0,
      diasCredito: cliente?.configuracionComercial?.diasCredito || 0,
      descuentoGeneral: cliente?.configuracionComercial?.descuentoGeneral || 0,
      observacionesComerciales: cliente?.configuracionComercial?.observacionesComerciales || "",
    },
  });

  const handleEdit = async () => {
    try {
      const result = await updateCliente(cliente._id, formData);
      if (result.success) {
        setIsEditDialogOpen(false);
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating cliente:", error);
    }
  };

  const openEditDialog = () => {
    setFormData({
      tipoPersona: cliente?.tipoPersona || "fisica",
      nombreCompleto: cliente?.nombreCompleto || "",
      razonSocial: cliente?.razonSocial || "",
      dni: cliente?.dni || "",
      fechaNacimiento: cliente?.fechaNacimiento ? cliente.fechaNacimiento.split('T')[0] : "",
      nacionalidad: cliente?.nacionalidad || "Argentina",
      estadoCivil: cliente?.estadoCivil || "soltero",
      profesion: cliente?.profesion || "",
      datosFiscales: {
        condicionIva: cliente?.datosFiscales?.condicionIva || "consumidor_final",
        cuit: cliente?.datosFiscales?.cuit || "",
        categoriaMonotributo: cliente?.datosFiscales?.categoriaMonotributo || "",
        actividadPrincipal: {
          codigo: cliente?.datosFiscales?.actividadPrincipal?.codigo || "",
          descripcion: cliente?.datosFiscales?.actividadPrincipal?.descripcion || "",
        },
      },
      contacto: {
        telefono: cliente?.contacto?.telefono || "",
        celular: cliente?.contacto?.celular || "",
        email: cliente?.contacto?.email || "",
        sitioWeb: cliente?.contacto?.sitioWeb || "",
      },
      direccionFiscal: {
        calle: cliente?.direccionFiscal?.calle || "",
        numero: cliente?.direccionFiscal?.numero || "",
        piso: cliente?.direccionFiscal?.piso || "",
        departamento: cliente?.direccionFiscal?.departamento || "",
        localidad: cliente?.direccionFiscal?.localidad || "",
        provincia: cliente?.direccionFiscal?.provincia || "",
        codigoPostal: cliente?.direccionFiscal?.codigoPostal || "",
        pais: cliente?.direccionFiscal?.pais || "Argentina",
      },
      configuracionComercial: {
        limiteCredito: cliente?.configuracionComercial?.limiteCredito || 0,
        diasCredito: cliente?.configuracionComercial?.diasCredito || 0,
        descuentoGeneral: cliente?.configuracionComercial?.descuentoGeneral || 0,
        observacionesComerciales: cliente?.configuracionComercial?.observacionesComerciales || "",
      },
    });
    setIsEditDialogOpen(true);
  };

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-AR');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  if (!cliente) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se pudo cargar la información del cliente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {cliente.tipoPersona === 'fisica' ? (
              <User className="h-6 w-6" />
            ) : (
              <Building2 className="h-6 w-6" />
            )}
            Información Personal
          </h2>
          <p className="text-muted-foreground">
            Datos personales y comerciales del cliente
          </p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openEditDialog}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Información
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Información Personal
              </DialogTitle>
              <DialogDescription>
                Modifica los datos personales y comerciales del cliente
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Datos Básicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos Básicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tipoPersona" className="text-sm font-medium">
                      Tipo de Persona *
                    </Label>
                    <Select 
                      value={formData.tipoPersona} 
                      onValueChange={(value) => setFormData({...formData, tipoPersona: value})}
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
                  
                  <div className="grid gap-2">
                    <Label htmlFor="nombreCompleto" className="text-sm font-medium">
                      {formData.tipoPersona === 'fisica' ? 'Nombre Completo' : 'Nombre de Fantasía'} *
                    </Label>
                    <Input
                      id="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
                      placeholder={formData.tipoPersona === 'fisica' ? 'Juan Pérez' : 'Mi Empresa SRL'}
                    />
                  </div>
                  
                  {formData.tipoPersona === 'juridica' && (
                    <div className="grid gap-2">
                      <Label htmlFor="razonSocial" className="text-sm font-medium">
                        Razón Social *
                      </Label>
                      <Input
                        id="razonSocial"
                        value={formData.razonSocial}
                        onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                        placeholder="Mi Empresa Sociedad de Responsabilidad Limitada"
                      />
                    </div>
                  )}
                  
                  {formData.tipoPersona === 'fisica' && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="dni" className="text-sm font-medium">
                          DNI *
                        </Label>
                        <Input
                          id="dni"
                          value={formData.dni}
                          onChange={(e) => setFormData({...formData, dni: e.target.value})}
                          placeholder="12345678"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="fechaNacimiento" className="text-sm font-medium">
                          Fecha de Nacimiento
                        </Label>
                        <Input
                          id="fechaNacimiento"
                          type="date"
                          value={formData.fechaNacimiento}
                          onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="estadoCivil" className="text-sm font-medium">
                          Estado Civil
                        </Label>
                        <Select 
                          value={formData.estadoCivil} 
                          onValueChange={(value) => setFormData({...formData, estadoCivil: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado civil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="soltero">Soltero/a</SelectItem>
                            <SelectItem value="casado">Casado/a</SelectItem>
                            <SelectItem value="divorciado">Divorciado/a</SelectItem>
                            <SelectItem value="viudo">Viudo/a</SelectItem>
                            <SelectItem value="union_convivencial">Unión Convivencial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="profesion" className="text-sm font-medium">
                          Profesión
                        </Label>
                        <Input
                          id="profesion"
                          value={formData.profesion}
                          onChange={(e) => setFormData({...formData, profesion: e.target.value})}
                          placeholder="Contador, Médico, etc."
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="nacionalidad" className="text-sm font-medium">
                      Nacionalidad
                    </Label>
                    <Input
                      id="nacionalidad"
                      value={formData.nacionalidad}
                      onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
                      placeholder="Argentina"
                    />
                  </div>
                </div>
              </div>

              {/* Datos Fiscales */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos Fiscales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="condicionIva" className="text-sm font-medium">
                      Condición IVA *
                    </Label>
                    <Select 
                      value={formData.datosFiscales.condicionIva} 
                      onValueChange={(value) => setFormData({
                        ...formData, 
                        datosFiscales: {...formData.datosFiscales, condicionIva: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar condición" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="responsable_inscripto">Responsable Inscripto</SelectItem>
                        <SelectItem value="monotributista">Monotributista</SelectItem>
                        <SelectItem value="exento">Exento</SelectItem>
                        <SelectItem value="consumidor_final">Consumidor Final</SelectItem>
                        <SelectItem value="no_responsable">No Responsable</SelectItem>
                        <SelectItem value="responsable_no_inscripto">Responsable No Inscripto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(formData.datosFiscales.condicionIva === 'responsable_inscripto' || 
                    formData.datosFiscales.condicionIva === 'monotributista') && (
                    <div className="grid gap-2">
                      <Label htmlFor="cuit" className="text-sm font-medium">
                        CUIT *
                      </Label>
                      <Input
                        id="cuit"
                        value={formData.datosFiscales.cuit}
                        onChange={(e) => setFormData({
                          ...formData, 
                          datosFiscales: {...formData.datosFiscales, cuit: e.target.value}
                        })}
                        placeholder="20-12345678-9"
                      />
                    </div>
                  )}
                  
                  {formData.datosFiscales.condicionIva === 'monotributista' && (
                    <div className="grid gap-2">
                      <Label htmlFor="categoriaMonotributo" className="text-sm font-medium">
                        Categoría Monotributo
                      </Label>
                      <Input
                        id="categoriaMonotributo"
                        value={formData.datosFiscales.categoriaMonotributo}
                        onChange={(e) => setFormData({
                          ...formData, 
                          datosFiscales: {...formData.datosFiscales, categoriaMonotributo: e.target.value}
                        })}
                        placeholder="A, B, C, etc."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="telefono" className="text-sm font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      value={formData.contacto.telefono}
                      onChange={(e) => setFormData({
                        ...formData, 
                        contacto: {...formData.contacto, telefono: e.target.value}
                      })}
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
                      onChange={(e) => setFormData({
                        ...formData, 
                        contacto: {...formData.contacto, celular: e.target.value}
                      })}
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
                      onChange={(e) => setFormData({
                        ...formData, 
                        contacto: {...formData.contacto, email: e.target.value}
                      })}
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
                      onChange={(e) => setFormData({
                        ...formData, 
                        contacto: {...formData.contacto, sitioWeb: e.target.value}
                      })}
                      placeholder="https://www.ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dirección Fiscal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="calle" className="text-sm font-medium">
                      Calle
                    </Label>
                    <Input
                      id="calle"
                      value={formData.direccionFiscal.calle}
                      onChange={(e) => setFormData({
                        ...formData, 
                        direccionFiscal: {...formData.direccionFiscal, calle: e.target.value}
                      })}
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
                      onChange={(e) => setFormData({
                        ...formData, 
                        direccionFiscal: {...formData.direccionFiscal, numero: e.target.value}
                      })}
                      placeholder="1234"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="localidad" className="text-sm font-medium">
                      Localidad
                    </Label>
                    <Input
                      id="localidad"
                      value={formData.direccionFiscal.localidad}
                      onChange={(e) => setFormData({
                        ...formData, 
                        direccionFiscal: {...formData.direccionFiscal, localidad: e.target.value}
                      })}
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
                      onChange={(e) => setFormData({
                        ...formData, 
                        direccionFiscal: {...formData.direccionFiscal, provincia: e.target.value}
                      })}
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
                      onChange={(e) => setFormData({
                        ...formData, 
                        direccionFiscal: {...formData.direccionFiscal, codigoPostal: e.target.value}
                      })}
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>

              {/* Configuración Comercial */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuración Comercial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="limiteCredito" className="text-sm font-medium">
                      Límite de Crédito
                    </Label>
                    <Input
                      id="limiteCredito"
                      type="number"
                      value={formData.configuracionComercial.limiteCredito}
                      onChange={(e) => setFormData({
                        ...formData, 
                        configuracionComercial: {
                          ...formData.configuracionComercial, 
                          limiteCredito: parseFloat(e.target.value) || 0
                        }
                      })}
                      placeholder="0"
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
                      onChange={(e) => setFormData({
                        ...formData, 
                        configuracionComercial: {
                          ...formData.configuracionComercial, 
                          diasCredito: parseInt(e.target.value) || 0
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="descuentoGeneral" className="text-sm font-medium">
                      Descuento General (%)
                    </Label>
                    <Input
                      id="descuentoGeneral"
                      type="number"
                      step="0.01"
                      value={formData.configuracionComercial.descuentoGeneral}
                      onChange={(e) => setFormData({
                        ...formData, 
                        configuracionComercial: {
                          ...formData.configuracionComercial, 
                          descuentoGeneral: parseFloat(e.target.value) || 0
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="observacionesComerciales" className="text-sm font-medium">
                      Observaciones Comerciales
                    </Label>
                    <Textarea
                      id="observacionesComerciales"
                      value={formData.configuracionComercial.observacionesComerciales}
                      onChange={(e) => setFormData({
                        ...formData, 
                        configuracionComercial: {
                          ...formData.configuracionComercial, 
                          observacionesComerciales: e.target.value
                        }
                      })}
                      placeholder="Observaciones adicionales sobre el cliente..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleEdit}
                disabled={isLoading || !formData.nombreCompleto}
              >
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Información Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Datos Personales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {cliente.tipoPersona === 'fisica' ? (
                <User className="h-5 w-5" />
              ) : (
                <Building2 className="h-5 w-5" />
              )}
              Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
                <Badge variant="outline">
                  {cliente.tipoPersona === 'fisica' ? 'Persona Física' : 'Persona Jurídica'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                <span className="text-sm font-medium">{cliente.nombreCompleto}</span>
              </div>
              
              {cliente.tipoPersona === 'juridica' && cliente.razonSocial && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Razón Social:</span>
                  <span className="text-sm">{cliente.razonSocial}</span>
                </div>
              )}
              
              {cliente.tipoPersona === 'fisica' && (
                <>
                  {cliente.dni && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">DNI:</span>
                      <span className="text-sm">{cliente.dni}</span>
                    </div>
                  )}
                  
                  {cliente.fechaNacimiento && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento:</span>
                      <span className="text-sm">{formatDate(cliente.fechaNacimiento)}</span>
                    </div>
                  )}
                  
                  {cliente.estadoCivil && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Estado Civil:</span>
                      <span className="text-sm capitalize">{cliente.estadoCivil.replace('_', ' ')}</span>
                    </div>
                  )}
                  
                  {cliente.profesion && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Profesión:</span>
                      <span className="text-sm">{cliente.profesion}</span>
                    </div>
                  )}
                </>
              )}
              
              {cliente.nacionalidad && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Nacionalidad:</span>
                  <span className="text-sm">{cliente.nacionalidad}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Datos Fiscales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Datos Fiscales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Condición IVA:</span>
                <Badge variant="outline">
                  {cliente.datosFiscales?.condicionIva?.replace('_', ' ') || 'No especificada'}
                </Badge>
              </div>
              
              {cliente.datosFiscales?.cuit && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">CUIT:</span>
                  <span className="text-sm font-mono">{cliente.datosFiscales.cuit}</span>
                </div>
              )}
              
              {cliente.datosFiscales?.categoriaMonotributo && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Categoría Monotributo:</span>
                  <span className="text-sm">{cliente.datosFiscales.categoriaMonotributo}</span>
                </div>
              )}
              
              {cliente.datosFiscales?.actividadPrincipal?.descripcion && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Actividad Principal:</span>
                  <span className="text-sm">{cliente.datosFiscales.actividadPrincipal.descripcion}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {cliente.contacto?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.contacto.email}</span>
                </div>
              )}
              
              {cliente.contacto?.celular && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.contacto.celular}</span>
                </div>
              )}
              
              {cliente.contacto?.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.contacto.telefono}</span>
                </div>
              )}
              
              {cliente.contacto?.sitioWeb && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={cliente.contacto.sitioWeb} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {cliente.contacto.sitioWeb}
                  </a>
                </div>
              )}
              
              {!cliente.contacto?.email && !cliente.contacto?.celular && 
               !cliente.contacto?.telefono && !cliente.contacto?.sitioWeb && (
                <p className="text-sm text-muted-foreground">No hay información de contacto disponible</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dirección */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dirección Fiscal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cliente.direccionFiscal && (
              <div className="text-sm space-y-1">
                <div>
                  {cliente.direccionFiscal.calle} {cliente.direccionFiscal.numero}
                  {cliente.direccionFiscal.piso && `, Piso ${cliente.direccionFiscal.piso}`}
                  {cliente.direccionFiscal.departamento && `, Depto ${cliente.direccionFiscal.departamento}`}
                </div>
                <div>
                  {cliente.direccionFiscal.localidad}, {cliente.direccionFiscal.provincia}
                  {cliente.direccionFiscal.codigoPostal && ` (${cliente.direccionFiscal.codigoPostal})`}
                </div>
                <div className="text-muted-foreground">
                  {cliente.direccionFiscal.pais}
                </div>
              </div>
            ) || (
              <p className="text-sm text-muted-foreground">No hay dirección registrada</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuración Comercial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Configuración Comercial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(cliente.configuracionComercial?.limiteCredito || 0)}
              </div>
              <p className="text-sm text-muted-foreground">Límite de Crédito</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {cliente.configuracionComercial?.diasCredito || 0}
              </div>
              <p className="text-sm text-muted-foreground">Días de Crédito</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {cliente.configuracionComercial?.descuentoGeneral || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Descuento General</p>
            </div>
          </div>
          
          {cliente.configuracionComercial?.observacionesComerciales && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-2">Observaciones Comerciales</h4>
              <p className="text-sm text-muted-foreground">
                {cliente.configuracionComercial.observacionesComerciales}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InformacionPersonal;