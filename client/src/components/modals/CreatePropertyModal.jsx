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
import { FileUploader } from "@/components/ui/file-uploader";
import { useProperties } from "@/contexts/PropertiesContext";
import { useOwners } from "@/contexts/OwnersContext";
import { toast } from "sonner";
import {
  Home,
  MapPin,
  DollarSign,
  Settings,
  FileText,
  Save,
  X,
  Building,
  Wifi,
  Car,
  Waves,
  Shield,
  Zap,
  TreePine,
  Dumbbell,
  Camera,
} from "lucide-react";

const CreatePropertyModal = ({ open, onOpenChange, onSuccess }) => {
  const { createProperty, isLoading } = useProperties();
  const { owners, getOwners } = useOwners();

  const [formData, setFormData] = useState({
    // Información básica
    title: "",
    description: "",
    type: "CASA",
    status: "DISPONIBLE",
    owner: "",

    // Ubicación
    location: {
      address: "",
      neighborhood: "",
      city: "",
      province: "",
      postalCode: "",
      coordinates: {
        lat: "",
        lng: "",
      },
    },

    // Características
    characteristics: {
      bedrooms: "",
      bathrooms: "",
      garages: "",
      totalArea: "",
      coveredArea: "",
      lotArea: "",
      floors: "",
      antiquity: "",
    },

    // Precios
    pricing: {
      salePrice: "",
      rentPrice: "",
      currency: "ARS",
      expenses: "",
    },

    // Servicios
    services: {
      water: false,
      electricity: false,
      gas: false,
      internet: false,
      cable: false,
      phone: false,
      security: false,
      maintenance: false,
    },

    // Amenities
    amenities: {
      pool: false,
      gym: false,
      garden: false,
      terrace: false,
      balcony: false,
      garage: false,
      storage: false,
      laundry: false,
      airConditioning: false,
      heating: false,
      fireplace: false,
      elevator: false,
    },

    // Configuración
    featured: false,
    published: true,
    notes: "",
  });

  // Estado para archivos subidos
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [errors, setErrors] = useState({});

  // Cargar propietarios al abrir el modal
  useEffect(() => {
    if (open && owners.length === 0) {
      getOwners();
    }
  }, [open, owners.length, getOwners]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones obligatorias
    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (!formData.description.trim())
      newErrors.description = "La descripción es obligatoria";
    if (!formData.owner) newErrors.owner = "El propietario es obligatorio";
    if (!formData.location.address.trim())
      newErrors.address = "La dirección es obligatoria";
    if (!formData.location.city.trim())
      newErrors.city = "La ciudad es obligatoria";

    // Validar precios
    if (formData.pricing.salePrice && isNaN(formData.pricing.salePrice)) {
      newErrors.salePrice = "El precio de venta debe ser un número";
    }
    if (formData.pricing.rentPrice && isNaN(formData.pricing.rentPrice)) {
      newErrors.rentPrice = "El precio de alquiler debe ser un número";
    }

    // Validar características numéricas
    const numericFields = [
      "bedrooms",
      "bathrooms",
      "garages",
      "totalArea",
      "coveredArea",
      "lotArea",
      "floors",
      "antiquity",
    ];
    numericFields.forEach((field) => {
      if (
        formData.characteristics[field] &&
        isNaN(formData.characteristics[field])
      ) {
        newErrors[field] = `${field} debe ser un número`;
      }
    });

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

  // Manejar cambios en coordenadas
  const handleCoordinateChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          [field]: value,
        },
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
        characteristics: {
          ...formData.characteristics,
          bedrooms: formData.characteristics.bedrooms
            ? parseInt(formData.characteristics.bedrooms)
            : undefined,
          bathrooms: formData.characteristics.bathrooms
            ? parseInt(formData.characteristics.bathrooms)
            : undefined,
          garages: formData.characteristics.garages
            ? parseInt(formData.characteristics.garages)
            : undefined,
          totalArea: formData.characteristics.totalArea
            ? parseFloat(formData.characteristics.totalArea)
            : undefined,
          coveredArea: formData.characteristics.coveredArea
            ? parseFloat(formData.characteristics.coveredArea)
            : undefined,
          lotArea: formData.characteristics.lotArea
            ? parseFloat(formData.characteristics.lotArea)
            : undefined,
          floors: formData.characteristics.floors
            ? parseInt(formData.characteristics.floors)
            : undefined,
          antiquity: formData.characteristics.antiquity
            ? parseInt(formData.characteristics.antiquity)
            : undefined,
        },
        pricing: {
          ...formData.pricing,
          salePrice: formData.pricing.salePrice
            ? parseFloat(formData.pricing.salePrice)
            : undefined,
          rentPrice: formData.pricing.rentPrice
            ? parseFloat(formData.pricing.rentPrice)
            : undefined,
          expenses: formData.pricing.expenses
            ? parseFloat(formData.pricing.expenses)
            : undefined,
        },
        location: {
          ...formData.location,
          coordinates: {
            lat: formData.location.coordinates.lat
              ? parseFloat(formData.location.coordinates.lat)
              : undefined,
            lng: formData.location.coordinates.lng
              ? parseFloat(formData.location.coordinates.lng)
              : undefined,
          },
        },
        // Incluir archivos subidos
        images: images.map(img => ({
          url: img.url,
          name: img.name,
          type: img.type,
          size: img.size
        })),
        documents: documents.map(doc => ({
          url: doc.url,
          name: doc.name,
          type: doc.type,
          size: doc.size
        }))
      };

      const result = await createProperty(processedData);

      if (result.success) {
        toast.success("Propiedad creada exitosamente");
        onSuccess();
        resetForm();
      } else {
        if (result.details && Array.isArray(result.details)) {
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
          toast.error(result.error);
        } else {
          toast.error("Error al crear propiedad");
        }
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error("Error de conexión: " + error.message);
      } else {
        toast.error("Error inesperado al crear propiedad");
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "CASA",
      status: "DISPONIBLE",
      owner: "",
      location: {
        address: "",
        neighborhood: "",
        city: "",
        province: "",
        postalCode: "",
        coordinates: {
          lat: "",
          lng: "",
        },
      },
      characteristics: {
        bedrooms: "",
        bathrooms: "",
        garages: "",
        totalArea: "",
        coveredArea: "",
        lotArea: "",
        floors: "",
        antiquity: "",
      },
      pricing: {
        salePrice: "",
        rentPrice: "",
        currency: "ARS",
        expenses: "",
      },
      services: {
        water: false,
        electricity: false,
        gas: false,
        internet: false,
        cable: false,
        phone: false,
        security: false,
        maintenance: false,
      },
      amenities: {
        pool: false,
        gym: false,
        garden: false,
        terrace: false,
        balcony: false,
        garage: false,
        storage: false,
        laundry: false,
        airConditioning: false,
        heating: false,
        fireplace: false,
        elevator: false,
      },
      featured: false,
      published: true,
      notes: "",
    });
    setImages([]);
    setDocuments([]);
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
            <Home className="h-5 w-5" />
            Crear Nueva Propiedad
          </DialogTitle>
          <DialogDescription>
            Complete la información de la nueva propiedad. Los campos marcados
            con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basica" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="basica">Básica</TabsTrigger>
              <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
              <TabsTrigger value="caracteristicas">Características</TabsTrigger>
              <TabsTrigger value="precios">Precios</TabsTrigger>
              <TabsTrigger value="servicios">Servicios</TabsTrigger>
              <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
              <TabsTrigger value="configuracion">Config</TabsTrigger>
            </TabsList>

            {/* Información Básica */}
            <TabsContent value="basica" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Básica</CardTitle>
                  <CardDescription>
                    Datos principales de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Casa en venta en Palermo"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Descripción detallada de la propiedad..."
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Propiedad</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          handleInputChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASA">Casa</SelectItem>
                          <SelectItem value="DEPARTAMENTO">
                            Departamento
                          </SelectItem>
                          <SelectItem value="PH">PH</SelectItem>
                          <SelectItem value="OFICINA">Oficina</SelectItem>
                          <SelectItem value="LOCAL">Local</SelectItem>
                          <SelectItem value="TERRENO">Terreno</SelectItem>
                          <SelectItem value="GALPON">Galpón</SelectItem>
                          <SelectItem value="QUINTA">Quinta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado</Label>
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
                          <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                          <SelectItem value="RESERVADO">Reservado</SelectItem>
                          <SelectItem value="VENDIDO">Vendido</SelectItem>
                          <SelectItem value="ALQUILADO">Alquilado</SelectItem>
                          <SelectItem value="MANTENIMIENTO">
                            Mantenimiento
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Propietario *</Label>
                      <Select
                        value={formData.owner}
                        onValueChange={(value) =>
                          handleInputChange("owner", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.owner ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Seleccionar propietario" />
                        </SelectTrigger>
                        <SelectContent>
                          {owners.map((owner) => (
                            <SelectItem key={owner._id} value={owner._id}>
                              {owner.nombre} {owner.apellido}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.owner && (
                        <p className="text-sm text-red-500">{errors.owner}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ubicación */}
            <TabsContent value="ubicacion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ubicación
                  </CardTitle>
                  <CardDescription>
                    Información de ubicación de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      value={formData.location.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value, "location")
                      }
                      placeholder="Av. Corrientes 1234"
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Barrio</Label>
                      <Input
                        id="neighborhood"
                        value={formData.location.neighborhood}
                        onChange={(e) =>
                          handleInputChange(
                            "neighborhood",
                            e.target.value,
                            "location"
                          )
                        }
                        placeholder="Palermo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        value={formData.location.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value, "location")
                        }
                        placeholder="Buenos Aires"
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Provincia</Label>
                      <Input
                        id="province"
                        value={formData.location.province}
                        onChange={(e) =>
                          handleInputChange(
                            "province",
                            e.target.value,
                            "location"
                          )
                        }
                        placeholder="Buenos Aires"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        value={formData.location.postalCode}
                        onChange={(e) =>
                          handleInputChange(
                            "postalCode",
                            e.target.value,
                            "location"
                          )
                        }
                        placeholder="1414"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Coordenadas</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lat">Latitud</Label>
                        <Input
                          id="lat"
                          value={formData.location.coordinates.lat}
                          onChange={(e) =>
                            handleCoordinateChange("lat", e.target.value)
                          }
                          placeholder="-34.6037"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lng">Longitud</Label>
                        <Input
                          id="lng"
                          value={formData.location.coordinates.lng}
                          onChange={(e) =>
                            handleCoordinateChange("lng", e.target.value)
                          }
                          placeholder="-58.3816"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Características */}
            <TabsContent value="caracteristicas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Características
                  </CardTitle>
                  <CardDescription>
                    Detalles técnicos de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Dormitorios</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.characteristics.bedrooms}
                        onChange={(e) =>
                          handleInputChange(
                            "bedrooms",
                            e.target.value,
                            "characteristics"
                          )
                        }
                        placeholder="3"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Baños</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.characteristics.bathrooms}
                        onChange={(e) =>
                          handleInputChange(
                            "bathrooms",
                            e.target.value,
                            "characteristics"
                          )
                        }
                        placeholder="2"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="garages">Cocheras</Label>
                      <Input
                        id="garages"
                        type="number"
                        value={formData.characteristics.garages}
                        onChange={(e) =>
                          handleInputChange(
                            "garages",
                            e.target.value,
                            "characteristics"
                          )
                        }
                        placeholder="1"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="floors">Pisos</Label>
                      <Input
                        id="floors"
                        type="number"
                        value={formData.characteristics.floors}
                        onChange={(e) =>
                          handleInputChange(
                            "floors",
                            e.target.value,
                            "characteristics"
                          )
                        }
                        placeholder="2"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalArea">Superficie Total (m²)</Label>
                      <Input
                        id="totalArea"
                        type="number"
                        value={formData.characteristics.totalArea}
                        onChange={(e) =>
                          handleInputChange(
                            "totalArea",
                            e.target.value,
                            "characteristics"
                          )
                        }
                        placeholder="120"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coveredArea">
                        Superficie Cubierta (m²)
                      </Label>
                      <Input
                        id="coveredArea"
                        type="number"
                        value={formData.characteristics.coveredArea}
                        onChange={(e) =>
                          handleInputChange(
                            "coveredArea",
                            e.target.value,
                            "characteristics"
                          )
                        }
                        placeholder="100"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lotArea">Superficie Lote (m²)</Label>
                      <Input
                        id="lotArea"
                        type="number"
                        value={formData.characteristics.lotArea}
                        onChange={(e) =>
                          handleInputChange(
                            "lotArea",
                            e.target.value,
                            "characteristics"
                          )
                        }
                        placeholder="200"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="antiquity">Antigüedad (años)</Label>
                    <Input
                      id="antiquity"
                      type="number"
                      value={formData.characteristics.antiquity}
                      onChange={(e) =>
                        handleInputChange(
                          "antiquity",
                          e.target.value,
                          "characteristics"
                        )
                      }
                      placeholder="10"
                      min="0"
                      className="md:w-1/3"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Precios */}
            <TabsContent value="precios" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Precios
                  </CardTitle>
                  <CardDescription>
                    Información de precios y costos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salePrice">Precio de Venta</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        value={formData.pricing.salePrice}
                        onChange={(e) =>
                          handleInputChange(
                            "salePrice",
                            e.target.value,
                            "pricing"
                          )
                        }
                        placeholder="250000"
                        min="0"
                        step="0.01"
                        className={errors.salePrice ? "border-red-500" : ""}
                      />
                      {errors.salePrice && (
                        <p className="text-sm text-red-500">
                          {errors.salePrice}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rentPrice">Precio de Alquiler</Label>
                      <Input
                        id="rentPrice"
                        type="number"
                        value={formData.pricing.rentPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "rentPrice",
                            e.target.value,
                            "pricing"
                          )
                        }
                        placeholder="50000"
                        min="0"
                        step="0.01"
                        className={errors.rentPrice ? "border-red-500" : ""}
                      />
                      {errors.rentPrice && (
                        <p className="text-sm text-red-500">
                          {errors.rentPrice}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Moneda</Label>
                      <Select
                        value={formData.pricing.currency}
                        onValueChange={(value) =>
                          handleInputChange("currency", value, "pricing")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ARS">ARS (Pesos)</SelectItem>
                          <SelectItem value="USD">USD (Dólares)</SelectItem>
                          <SelectItem value="EUR">EUR (Euros)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenses">Expensas</Label>
                    <Input
                      id="expenses"
                      type="number"
                      value={formData.pricing.expenses}
                      onChange={(e) =>
                        handleInputChange("expenses", e.target.value, "pricing")
                      }
                      placeholder="15000"
                      min="0"
                      step="0.01"
                      className="md:w-1/3"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Servicios y Amenities */}
            <TabsContent value="servicios" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Servicios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Servicios
                    </CardTitle>
                    <CardDescription>
                      Servicios disponibles en la propiedad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries({
                      water: "Agua",
                      electricity: "Electricidad",
                      gas: "Gas",
                      internet: "Internet",
                      cable: "Cable",
                      phone: "Teléfono",
                      security: "Seguridad",
                      maintenance: "Mantenimiento",
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${key}`}
                          checked={formData.services[key]}
                          onCheckedChange={(checked) =>
                            handleInputChange(key, checked, "services")
                          }
                        />
                        <Label htmlFor={`service-${key}`}>{label}</Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Waves className="h-5 w-5" />
                      Amenities
                    </CardTitle>
                    <CardDescription>
                      Comodidades y características especiales
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries({
                      pool: "Piscina",
                      gym: "Gimnasio",
                      garden: "Jardín",
                      terrace: "Terraza",
                      balcony: "Balcón",
                      garage: "Garage",
                      storage: "Depósito",
                      laundry: "Lavadero",
                      airConditioning: "Aire Acondicionado",
                      heating: "Calefacción",
                      fireplace: "Chimenea",
                      elevator: "Ascensor",
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${key}`}
                          checked={formData.amenities[key]}
                          onCheckedChange={(checked) =>
                            handleInputChange(key, checked, "amenities")
                          }
                        />
                        <Label htmlFor={`amenity-${key}`}>{label}</Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Imágenes */}
            <TabsContent value="imagenes" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Imágenes de la propiedad */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Imágenes de la Propiedad
                    </CardTitle>
                    <CardDescription>
                      Sube imágenes de la propiedad para mostrar a los clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUploader
                      onFileSelect={setImages}
                      currentFiles={images}
                      acceptedTypes="image"
                      multiple={true}
                    />
                  </CardContent>
                </Card>

                {/* Documentos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentos
                    </CardTitle>
                    <CardDescription>
                      Sube documentos relacionados con la propiedad (PDFs)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUploader
                      onFileSelect={setDocuments}
                      currentFiles={documents}
                      acceptedTypes="pdf"
                      multiple={true}
                    />
                  </CardContent>
                </Card>
              </div>
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
                    Configuraciones adicionales y notas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          handleInputChange("featured", checked)
                        }
                      />
                      <Label htmlFor="featured">Propiedad Destacada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) =>
                          handleInputChange("published", checked)
                        }
                      />
                      <Label htmlFor="published">Publicar Propiedad</Label>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Notas adicionales sobre la propiedad..."
                      rows={4}
                    />
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
              {isLoading ? "Creando..." : "Crear Propiedad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyModal;
