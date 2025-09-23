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
import { useSales } from "@/contexts/SalesContext";
import { useProperties } from "@/contexts/PropertiesContext";
import { useOwners } from "@/contexts/OwnersContext";
import { useProspects } from "@/contexts/ProspectsContext";
import { toast } from "sonner";
import {
  ShoppingCart,
  Building,
  User,
  DollarSign,
  Calendar,
  FileText,
  Save,
  X,
  AlertCircle,
  Clock,
  Target,
} from "lucide-react";

const CreateSaleModal = ({ open, onOpenChange, onSuccess }) => {
  const { createSale, isLoading } = useSales();
  const { properties, getProperties } = useProperties();
  const { owners, getOwners } = useOwners();
  const { prospects, getProspects } = useProspects();

  const [formData, setFormData] = useState({
    // Información básica
    property: "",
    prospect: "",
    owner: "",

    // Detalles de la venta
    price: "",
    currency: "ARS",
    commission: "",
    commissionType: "percentage", // percentage o fixed

    // Fechas
    startDate: new Date().toISOString().split("T")[0],
    expectedCloseDate: "",
    actualCloseDate: "",

    // Estado y prioridad
    status: "Pendiente",
    priority: "Media",

    // Información adicional
    description: "",
    notes: "",

    // Términos y condiciones
    terms: {
      paymentMethod: "",
      financingDetails: "",
      contingencies: "",
      inspectionDate: "",
      closingCosts: "",
    },

    // Documentos requeridos
    requiredDocuments: {
      propertyTitle: false,
      taxClearance: false,
      utilityBills: false,
      inspection: false,
      appraisal: false,
      insurance: false,
      financing: false,
      contract: false,
    },

    // Seguimiento
    followUp: {
      nextContactDate: "",
      contactMethod: "",
      reminderNotes: "",
    },
  });

  const [errors, setErrors] = useState({});

  // Cargar datos necesarios al abrir el modal
  useEffect(() => {
    if (open) {
      if (properties.length === 0) getProperties();
      if (owners.length === 0) getOwners();
      if (prospects.length === 0) getProspects();
    }
  }, [open, properties.length, owners.length, prospects.length]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones obligatorias
    if (!formData.property) newErrors.property = "La propiedad es obligatoria";
    if (!formData.prospect) newErrors.prospect = "El prospecto es obligatorio";
    if (!formData.owner) newErrors.owner = "El propietario es obligatorio";
    if (!formData.price) newErrors.price = "El precio es obligatorio";
    if (!formData.expectedCloseDate)
      newErrors.expectedCloseDate =
        "La fecha esperada de cierre es obligatoria";

    // Validar precio
    if (formData.price && isNaN(formData.price)) {
      newErrors.price = "El precio debe ser un número";
    }

    // Validar comisión
    if (formData.commission && isNaN(formData.commission)) {
      newErrors.commission = "La comisión debe ser un número";
    }

    // Validar fechas
    if (formData.expectedCloseDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const expectedDate = new Date(formData.expectedCloseDate);
      if (expectedDate <= startDate) {
        newErrors.expectedCloseDate =
          "La fecha esperada debe ser posterior a la fecha de inicio";
      }
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

  // Manejar cambios en documentos requeridos
  const handleDocumentChange = (document, checked) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: {
        ...prev.requiredDocuments,
        [document]: checked,
      },
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      // Convertir valores numéricos
      const processedData = {
        ...formData,
        price: parseFloat(formData.price),
        commission: formData.commission
          ? parseFloat(formData.commission)
          : undefined,
      };

      console.log("🚀 Enviando datos de venta:", processedData);

      const result = await createSale(processedData);

      if (result.success) {
        toast.success("Venta creada exitosamente");
        onSuccess();
        resetForm();
      } else {
        console.error("❌ Error al crear venta:", result);
        toast.error(result.error || "Error al crear venta");
      }
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      toast.error("Error inesperado al crear venta");
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      property: "",
      prospect: "",
      owner: "",
      price: "",
      currency: "ARS",
      commission: "",
      commissionType: "percentage",
      startDate: new Date().toISOString().split("T")[0],
      expectedCloseDate: "",
      actualCloseDate: "",
      status: "Pendiente",
      priority: "Media",
      description: "",
      notes: "",
      terms: {
        paymentMethod: "",
        financingDetails: "",
        contingencies: "",
        inspectionDate: "",
        closingCosts: "",
      },
      requiredDocuments: {
        propertyTitle: false,
        taxClearance: false,
        utilityBills: false,
        inspection: false,
        appraisal: false,
        insurance: false,
        financing: false,
        contract: false,
      },
      followUp: {
        nextContactDate: "",
        contactMethod: "",
        reminderNotes: "",
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
      <DialogContent className="min-w-6xl max-h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Nueva Venta
          </DialogTitle>
          <DialogDescription>
            Crea una nueva venta completando la información requerida
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Detalles
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

            {/* Tab: Información Básica */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Información Básica
                  </CardTitle>
                  <CardDescription>
                    Selecciona la propiedad, prospecto y propietario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Propiedad */}
                    <div className="space-y-2">
                      <Label htmlFor="property">
                        Propiedad <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.property}
                        onValueChange={(value) =>
                          handleInputChange("property", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.property ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Selecciona una propiedad" />
                        </SelectTrigger>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property._id} value={property._id}>
                              {property.title} - {property.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.property && (
                        <p className="text-sm text-red-500">
                          {errors.property}
                        </p>
                      )}
                    </div>

                    {/* Prospecto */}
                    <div className="space-y-2">
                      <Label htmlFor="prospect">
                        Prospecto <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.prospect}
                        onValueChange={(value) =>
                          handleInputChange("prospect", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.prospect ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Selecciona un prospecto" />
                        </SelectTrigger>
                        <SelectContent>
                          {prospects.map((prospect) => (
                            <SelectItem key={prospect._id} value={prospect._id}>
                              {prospect.nombre} {prospect.apellido} -{" "}
                              {prospect.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.prospect && (
                        <p className="text-sm text-red-500">
                          {errors.prospect}
                        </p>
                      )}
                    </div>

                    {/* Propietario */}
                    <div className="space-y-2">
                      <Label htmlFor="owner">
                        Propietario <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.owner}
                        onValueChange={(value) =>
                          handleInputChange("owner", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.owner ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Selecciona un propietario" />
                        </SelectTrigger>
                        <SelectContent>
                          {owners.map((owner) => (
                            <SelectItem key={owner._id} value={owner._id}>
                              {owner.nombre} {owner.apellido} - {owner.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.owner && (
                        <p className="text-sm text-red-500">{errors.owner}</p>
                      )}
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="En Proceso">En Proceso</SelectItem>
                          <SelectItem value="Completada">Completada</SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                          <SelectItem value="Pausada">Pausada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Prioridad */}
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridad</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          handleInputChange("priority", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Media">Media</SelectItem>
                          <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe los detalles de la venta..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Detalles Financieros */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Detalles Financieros
                  </CardTitle>
                  <CardDescription>
                    Configura el precio, comisión y fechas importantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Precio */}
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Precio <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        className={errors.price ? "border-red-500" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500">{errors.price}</p>
                      )}
                    </div>

                    {/* Moneda */}
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moneda</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) =>
                          handleInputChange("currency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ARS">
                            ARS - Peso Argentino
                          </SelectItem>
                          <SelectItem value="USD">
                            USD - Dólar Americano
                          </SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Comisión */}
                    <div className="space-y-2">
                      <Label htmlFor="commission">Comisión</Label>
                      <Input
                        id="commission"
                        type="number"
                        placeholder="0"
                        value={formData.commission}
                        onChange={(e) =>
                          handleInputChange("commission", e.target.value)
                        }
                        className={errors.commission ? "border-red-500" : ""}
                      />
                      {errors.commission && (
                        <p className="text-sm text-red-500">
                          {errors.commission}
                        </p>
                      )}
                    </div>

                    {/* Tipo de Comisión */}
                    <div className="space-y-2">
                      <Label htmlFor="commissionType">Tipo de Comisión</Label>
                      <Select
                        value={formData.commissionType}
                        onValueChange={(value) =>
                          handleInputChange("commissionType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Porcentaje (%)
                          </SelectItem>
                          <SelectItem value="fixed">Monto Fijo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Fecha de Inicio */}
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Fecha de Inicio</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                      />
                    </div>

                    {/* Fecha Esperada de Cierre */}
                    <div className="space-y-2">
                      <Label htmlFor="expectedCloseDate">
                        Fecha Esperada de Cierre{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="expectedCloseDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={(e) =>
                          handleInputChange("expectedCloseDate", e.target.value)
                        }
                        className={
                          errors.expectedCloseDate ? "border-red-500" : ""
                        }
                      />
                      {errors.expectedCloseDate && (
                        <p className="text-sm text-red-500">
                          {errors.expectedCloseDate}
                        </p>
                      )}
                    </div>

                    {/* Fecha Real de Cierre */}
                    <div className="space-y-2">
                      <Label htmlFor="actualCloseDate">
                        Fecha Real de Cierre
                      </Label>
                      <Input
                        id="actualCloseDate"
                        type="date"
                        value={formData.actualCloseDate}
                        onChange={(e) =>
                          handleInputChange("actualCloseDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Términos y Condiciones */}
            <TabsContent value="terms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Términos y Condiciones
                  </CardTitle>
                  <CardDescription>
                    Define los términos de la venta y documentos requeridos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Método de Pago */}
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Método de Pago</Label>
                      <Input
                        id="paymentMethod"
                        placeholder="Efectivo, financiamiento, etc."
                        value={formData.terms.paymentMethod}
                        onChange={(e) =>
                          handleInputChange(
                            "paymentMethod",
                            e.target.value,
                            "terms"
                          )
                        }
                      />
                    </div>

                    {/* Fecha de Inspección */}
                    <div className="space-y-2">
                      <Label htmlFor="inspectionDate">
                        Fecha de Inspección
                      </Label>
                      <Input
                        id="inspectionDate"
                        type="date"
                        value={formData.terms.inspectionDate}
                        onChange={(e) =>
                          handleInputChange(
                            "inspectionDate",
                            e.target.value,
                            "terms"
                          )
                        }
                      />
                    </div>

                    {/* Costos de Cierre */}
                    <div className="space-y-2">
                      <Label htmlFor="closingCosts">Costos de Cierre</Label>
                      <Input
                        id="closingCosts"
                        placeholder="Descripción de costos"
                        value={formData.terms.closingCosts}
                        onChange={(e) =>
                          handleInputChange(
                            "closingCosts",
                            e.target.value,
                            "terms"
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Detalles de Financiamiento */}
                  <div className="space-y-2">
                    <Label htmlFor="financingDetails">
                      Detalles de Financiamiento
                    </Label>
                    <Textarea
                      id="financingDetails"
                      placeholder="Describe los detalles del financiamiento..."
                      value={formData.terms.financingDetails}
                      onChange={(e) =>
                        handleInputChange(
                          "financingDetails",
                          e.target.value,
                          "terms"
                        )
                      }
                      rows={3}
                    />
                  </div>

                  {/* Contingencias */}
                  <div className="space-y-2">
                    <Label htmlFor="contingencies">Contingencias</Label>
                    <Textarea
                      id="contingencies"
                      placeholder="Describe las contingencias..."
                      value={formData.terms.contingencies}
                      onChange={(e) =>
                        handleInputChange(
                          "contingencies",
                          e.target.value,
                          "terms"
                        )
                      }
                      rows={3}
                    />
                  </div>

                  <Separator />

                  {/* Documentos Requeridos */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Documentos Requeridos
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={formData.requiredDocuments[key]}
                            onChange={(e) =>
                              handleDocumentChange(key, e.target.checked)
                            }
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={key} className="text-sm">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Seguimiento */}
            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Seguimiento
                  </CardTitle>
                  <CardDescription>
                    Configura recordatorios y notas de seguimiento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Próxima Fecha de Contacto */}
                    <div className="space-y-2">
                      <Label htmlFor="nextContactDate">
                        Próxima Fecha de Contacto
                      </Label>
                      <Input
                        id="nextContactDate"
                        type="date"
                        value={formData.followUp.nextContactDate}
                        onChange={(e) =>
                          handleInputChange(
                            "nextContactDate",
                            e.target.value,
                            "followUp"
                          )
                        }
                      />
                    </div>

                    {/* Método de Contacto */}
                    <div className="space-y-2">
                      <Label htmlFor="contactMethod">Método de Contacto</Label>
                      <Select
                        value={formData.followUp.contactMethod}
                        onValueChange={(value) =>
                          handleInputChange("contactMethod", value, "followUp")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Teléfono</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="meeting">Reunión</SelectItem>
                          <SelectItem value="visit">Visita</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Notas de Recordatorio */}
                  <div className="space-y-2">
                    <Label htmlFor="reminderNotes">Notas de Recordatorio</Label>
                    <Textarea
                      id="reminderNotes"
                      placeholder="Notas para el próximo contacto..."
                      value={formData.followUp.reminderNotes}
                      onChange={(e) =>
                        handleInputChange(
                          "reminderNotes",
                          e.target.value,
                          "followUp"
                        )
                      }
                      rows={3}
                    />
                  </div>

                  {/* Notas Generales */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Generales</Label>
                    <Textarea
                      id="notes"
                      placeholder="Notas adicionales sobre la venta..."
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Venta
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSaleModal;
