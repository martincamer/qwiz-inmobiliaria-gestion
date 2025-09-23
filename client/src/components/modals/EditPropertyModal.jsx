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
import { useProperties } from "@/contexts/PropertiesContext";
import { useOwners } from "@/contexts/OwnersContext";
import { toast } from "sonner";
import {
  Home,
  MapPin,
  Ruler,
  DollarSign,
  Wifi,
  Star,
  Settings,
  Save,
  X,
  Edit,
} from "lucide-react";

const EditPropertyModal = ({ open, onOpenChange, property, onSuccess }) => {
  const { updateProperty, isLoading } = useProperties();
  const { owners, getOwners } = useOwners();

  const [formData, setFormData] = useState({
    // Información básica
    titulo: "",
    descripcion: "",
    tipo: "CASA",
    estado: "DISPONIBLE",
    propietario: "",

    // Ubicación
    ubicacion: {
      direccion: "",
      barrio: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      coordenadas: {
        latitud: "",
        longitud: "",
      },
    },

    // Características
    caracteristicas: {
      dormitorios: "",
      banos: "",
      cocheras: "",
      superficieTotal: "",
      superficieCubierta: "",
      superficieLote: "",
      pisos: "",
      antiguedad: "",
    },

    // Precios
    precios: {
      venta: "",
      alquiler: "",
      moneda: "ARS",
      expensas: "",
    },

    // Servicios
    servicios: [],

    // Amenities
    amenities: [],

    // Configuración
    destacada: false,
    publicada: true,
    notas: "",
  });

  const [errors, setErrors] = useState({});

  // Opciones para los selects
  const tiposPropiedad = [
    { value: "CASA", label: "Casa" },
    { value: "DEPARTAMENTO", label: "Departamento" },
    { value: "PH", label: "PH" },
    { value: "OFICINA", label: "Oficina" },
    { value: "LOCAL", label: "Local" },
    { value: "TERRENO", label: "Terreno" },
    { value: "GALPON", label: "Galpón" },
    { value: "QUINTA", label: "Quinta" },
    { value: "OTRO", label: "Otro" },
  ];

  const estadosPropiedad = [
    { value: "DISPONIBLE", label: "Disponible" },
    { value: "RESERVADA", label: "Reservada" },
    { value: "VENDIDA", label: "Vendida" },
    { value: "ALQUILADA", label: "Alquilada" },
    { value: "MANTENIMIENTO", label: "En Mantenimiento" },
    { value: "INACTIVA", label: "Inactiva" },
  ];

  const serviciosDisponibles = [
    "Agua",
    "Luz",
    "Gas",
    "Internet",
    "Cable",
    "Teléfono",
    "Cloacas",
    "Pavimento",
    "Transporte Público",
  ];

  const amenitiesDisponibles = [
    "Piscina",
    "Gimnasio",
    "Parrilla",
    "Jardín",
    "Terraza",
    "Balcón",
    "Garage",
    "Portero",
    "Seguridad 24hs",
    "Ascensor",
    "Aire Acondicionado",
    "Calefacción",
    "Laundry",
  ];

  // Cargar propietarios al abrir el modal
  useEffect(() => {
    if (open) {
      getOwners();
    }
  }, [open, getOwners]);

  // Cargar datos de la propiedad cuando se abre el modal
  useEffect(() => {
    if (property && open) {
      setFormData({
        titulo: property.titulo || "",
        descripcion: property.descripcion || "",
        tipo: property.tipo || "CASA",
        estado: property.estado || "DISPONIBLE",
        propietario: property.propietario?._id || property.propietario || "",
        ubicacion: {
          direccion: property.ubicacion?.direccion || "",
          barrio: property.ubicacion?.barrio || "",
          ciudad: property.ubicacion?.ciudad || "",
          provincia: property.ubicacion?.provincia || "",
          codigoPostal: property.ubicacion?.codigoPostal || "",
          coordenadas: {
            latitud: property.ubicacion?.coordenadas?.latitud || "",
            longitud: property.ubicacion?.coordenadas?.longitud || "",
          },
        },
        caracteristicas: {
          dormitorios: property.caracteristicas?.dormitorios || "",
          banos: property.caracteristicas?.banos || "",
          cocheras: property.caracteristicas?.cocheras || "",
          superficieTotal: property.caracteristicas?.superficieTotal || "",
          superficieCubierta:
            property.caracteristicas?.superficieCubierta || "",
          superficieLote: property.caracteristicas?.superficieLote || "",
          pisos: property.caracteristicas?.pisos || "",
          antiguedad: property.caracteristicas?.antiguedad || "",
        },
        precios: {
          venta: property.precios?.venta || "",
          alquiler: property.precios?.alquiler || "",
          moneda: property.precios?.moneda || "ARS",
          expensas: property.precios?.expensas || "",
        },
        servicios: property.servicios || [],
        amenities: property.amenities || [],
        destacada: property.destacada || false,
        publicada: property.publicada !== false,
        notas: property.notas || "",
      });
      setErrors({});
    }
  }, [property, open]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones obligatorias
    if (!formData.titulo.trim()) newErrors.titulo = "El título es obligatorio";
    if (!formData.tipo) newErrors.tipo = "El tipo de propiedad es obligatorio";
    if (!formData.propietario)
      newErrors.propietario = "El propietario es obligatorio";
    if (!formData.ubicacion.direccion.trim())
      newErrors.direccion = "La dirección es obligatoria";

    // Validar números
    if (
      formData.caracteristicas.dormitorios &&
      isNaN(formData.caracteristicas.dormitorios)
    ) {
      newErrors.dormitorios = "Debe ser un número válido";
    }
    if (
      formData.caracteristicas.banos &&
      isNaN(formData.caracteristicas.banos)
    ) {
      newErrors.banos = "Debe ser un número válido";
    }
    if (formData.precios.venta && isNaN(formData.precios.venta)) {
      newErrors.venta = "Debe ser un número válido";
    }
    if (formData.precios.alquiler && isNaN(formData.precios.alquiler)) {
      newErrors.alquiler = "Debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value, section = null) => {
    if (section) {
      if (section === "ubicacion" && field === "coordenadas") {
        setFormData((prev) => ({
          ...prev,
          ubicacion: {
            ...prev.ubicacion,
            coordenadas: {
              ...prev.ubicacion.coordenadas,
              ...value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        }));
      }
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

  // Manejar cambios en arrays (servicios y amenities)
  const handleArrayChange = (field, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    if (!property?._id) {
      toast.error("Error: No se encontró el ID de la propiedad");
      return;
    }

    try {
      const result = await updateProperty(property._id, formData);

      if (result.success) {
        toast.success("Propiedad actualizada exitosamente");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Error al actualizar propiedad");
      }
    } catch (error) {
      toast.error("Error al actualizar propiedad");
    }
  };

  // Manejar cierre del modal
  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl max-h-auto h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Propiedad
          </DialogTitle>
          <DialogDescription>
            Modifique la información de la propiedad "{property.titulo}". Los
            campos marcados con * son obligatorios.
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
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="configuracion">Config</TabsTrigger>
            </TabsList>

            {/* Información Básica */}
            <TabsContent value="basica" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Información Básica
                  </CardTitle>
                  <CardDescription>
                    Datos principales de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) =>
                        handleInputChange("titulo", e.target.value)
                      }
                      placeholder="Casa en venta en Palermo"
                      className={errors.titulo ? "border-red-500" : ""}
                    />
                    {errors.titulo && (
                      <p className="text-sm text-red-500">{errors.titulo}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) =>
                        handleInputChange("descripcion", e.target.value)
                      }
                      placeholder="Descripción detallada de la propiedad..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de Propiedad *</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) =>
                          handleInputChange("tipo", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.tipo ? "border-red-500" : ""}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposPropiedad.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.tipo && (
                        <p className="text-sm text-red-500">{errors.tipo}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select
                        value={formData.estado}
                        onValueChange={(value) =>
                          handleInputChange("estado", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosPropiedad.map((estado) => (
                            <SelectItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propietario">Propietario *</Label>
                      <Select
                        value={formData.propietario}
                        onValueChange={(value) =>
                          handleInputChange("propietario", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.propietario ? "border-red-500" : ""}
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
                      {errors.propietario && (
                        <p className="text-sm text-red-500">
                          {errors.propietario}
                        </p>
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
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ubicación
                  </CardTitle>
                  <CardDescription>
                    Información de la ubicación de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      value={formData.ubicacion.direccion}
                      onChange={(e) =>
                        handleInputChange(
                          "direccion",
                          e.target.value,
                          "ubicacion"
                        )
                      }
                      placeholder="Av. Corrientes 1234"
                      className={errors.direccion ? "border-red-500" : ""}
                    />
                    {errors.direccion && (
                      <p className="text-sm text-red-500">{errors.direccion}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="barrio">Barrio</Label>
                      <Input
                        id="barrio"
                        value={formData.ubicacion.barrio}
                        onChange={(e) =>
                          handleInputChange(
                            "barrio",
                            e.target.value,
                            "ubicacion"
                          )
                        }
                        placeholder="Palermo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        value={formData.ubicacion.ciudad}
                        onChange={(e) =>
                          handleInputChange(
                            "ciudad",
                            e.target.value,
                            "ubicacion"
                          )
                        }
                        placeholder="Buenos Aires"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provincia">Provincia</Label>
                      <Input
                        id="provincia"
                        value={formData.ubicacion.provincia}
                        onChange={(e) =>
                          handleInputChange(
                            "provincia",
                            e.target.value,
                            "ubicacion"
                          )
                        }
                        placeholder="Buenos Aires"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        value={formData.ubicacion.codigoPostal}
                        onChange={(e) =>
                          handleInputChange(
                            "codigoPostal",
                            e.target.value,
                            "ubicacion"
                          )
                        }
                        placeholder="1414"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitud">Latitud</Label>
                      <Input
                        id="latitud"
                        value={formData.ubicacion.coordenadas.latitud}
                        onChange={(e) =>
                          handleInputChange(
                            "coordenadas",
                            { latitud: e.target.value },
                            "ubicacion"
                          )
                        }
                        placeholder="-34.6037"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitud">Longitud</Label>
                      <Input
                        id="longitud"
                        value={formData.ubicacion.coordenadas.longitud}
                        onChange={(e) =>
                          handleInputChange(
                            "coordenadas",
                            { longitud: e.target.value },
                            "ubicacion"
                          )
                        }
                        placeholder="-58.3816"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Características */}
            <TabsContent value="caracteristicas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Características
                  </CardTitle>
                  <CardDescription>
                    Detalles técnicos de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dormitorios">Dormitorios</Label>
                      <Input
                        id="dormitorios"
                        type="number"
                        value={formData.caracteristicas.dormitorios}
                        onChange={(e) =>
                          handleInputChange(
                            "dormitorios",
                            e.target.value,
                            "caracteristicas"
                          )
                        }
                        placeholder="3"
                        className={errors.dormitorios ? "border-red-500" : ""}
                      />
                      {errors.dormitorios && (
                        <p className="text-sm text-red-500">
                          {errors.dormitorios}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="banos">Baños</Label>
                      <Input
                        id="banos"
                        type="number"
                        value={formData.caracteristicas.banos}
                        onChange={(e) =>
                          handleInputChange(
                            "banos",
                            e.target.value,
                            "caracteristicas"
                          )
                        }
                        placeholder="2"
                        className={errors.banos ? "border-red-500" : ""}
                      />
                      {errors.banos && (
                        <p className="text-sm text-red-500">{errors.banos}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cocheras">Cocheras</Label>
                      <Input
                        id="cocheras"
                        type="number"
                        value={formData.caracteristicas.cocheras}
                        onChange={(e) =>
                          handleInputChange(
                            "cocheras",
                            e.target.value,
                            "caracteristicas"
                          )
                        }
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pisos">Pisos</Label>
                      <Input
                        id="pisos"
                        type="number"
                        value={formData.caracteristicas.pisos}
                        onChange={(e) =>
                          handleInputChange(
                            "pisos",
                            e.target.value,
                            "caracteristicas"
                          )
                        }
                        placeholder="2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="superficieTotal">
                        Superficie Total (m²)
                      </Label>
                      <Input
                        id="superficieTotal"
                        type="number"
                        value={formData.caracteristicas.superficieTotal}
                        onChange={(e) =>
                          handleInputChange(
                            "superficieTotal",
                            e.target.value,
                            "caracteristicas"
                          )
                        }
                        placeholder="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="superficieCubierta">
                        Superficie Cubierta (m²)
                      </Label>
                      <Input
                        id="superficieCubierta"
                        type="number"
                        value={formData.caracteristicas.superficieCubierta}
                        onChange={(e) =>
                          handleInputChange(
                            "superficieCubierta",
                            e.target.value,
                            "caracteristicas"
                          )
                        }
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="superficieLote">
                        Superficie Lote (m²)
                      </Label>
                      <Input
                        id="superficieLote"
                        type="number"
                        value={formData.caracteristicas.superficieLote}
                        onChange={(e) =>
                          handleInputChange(
                            "superficieLote",
                            e.target.value,
                            "caracteristicas"
                          )
                        }
                        placeholder="200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="antiguedad">Antigüedad (años)</Label>
                    <Input
                      id="antiguedad"
                      type="number"
                      value={formData.caracteristicas.antiguedad}
                      onChange={(e) =>
                        handleInputChange(
                          "antiguedad",
                          e.target.value,
                          "caracteristicas"
                        )
                      }
                      placeholder="5"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Precios */}
            <TabsContent value="precios" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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
                      <Label htmlFor="venta">Precio de Venta</Label>
                      <Input
                        id="venta"
                        type="number"
                        value={formData.precios.venta}
                        onChange={(e) =>
                          handleInputChange("venta", e.target.value, "precios")
                        }
                        placeholder="250000"
                        className={errors.venta ? "border-red-500" : ""}
                      />
                      {errors.venta && (
                        <p className="text-sm text-red-500">{errors.venta}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alquiler">Precio de Alquiler</Label>
                      <Input
                        id="alquiler"
                        type="number"
                        value={formData.precios.alquiler}
                        onChange={(e) =>
                          handleInputChange(
                            "alquiler",
                            e.target.value,
                            "precios"
                          )
                        }
                        placeholder="50000"
                        className={errors.alquiler ? "border-red-500" : ""}
                      />
                      {errors.alquiler && (
                        <p className="text-sm text-red-500">
                          {errors.alquiler}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moneda">Moneda</Label>
                      <Select
                        value={formData.precios.moneda}
                        onValueChange={(value) =>
                          handleInputChange("moneda", value, "precios")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ARS">
                            Pesos Argentinos (ARS)
                          </SelectItem>
                          <SelectItem value="USD">Dólares (USD)</SelectItem>
                          <SelectItem value="EUR">Euros (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expensas">Expensas</Label>
                    <Input
                      id="expensas"
                      type="number"
                      value={formData.precios.expensas}
                      onChange={(e) =>
                        handleInputChange("expensas", e.target.value, "precios")
                      }
                      placeholder="15000"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Servicios */}
            <TabsContent value="servicios" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Servicios
                  </CardTitle>
                  <CardDescription>
                    Servicios disponibles en la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {serviciosDisponibles.map((servicio) => (
                      <div
                        key={servicio}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`servicio-${servicio}`}
                          checked={formData.servicios.includes(servicio)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("servicios", servicio, checked)
                          }
                        />
                        <Label htmlFor={`servicio-${servicio}`}>
                          {servicio}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Amenities */}
            <TabsContent value="amenities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Amenities
                  </CardTitle>
                  <CardDescription>
                    Comodidades y características especiales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesDisponibles.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("amenities", amenity, checked)
                          }
                        />
                        <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración */}
            <TabsContent value="configuracion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración
                  </CardTitle>
                  <CardDescription>
                    Configuraciones adicionales de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="destacada"
                        checked={formData.destacada}
                        onCheckedChange={(checked) =>
                          handleInputChange("destacada", checked)
                        }
                      />
                      <Label htmlFor="destacada">Propiedad destacada</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="publicada"
                        checked={formData.publicada}
                        onCheckedChange={(checked) =>
                          handleInputChange("publicada", checked)
                        }
                      />
                      <Label htmlFor="publicada">Propiedad publicada</Label>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      value={formData.notas}
                      onChange={(e) =>
                        handleInputChange("notas", e.target.value)
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
              {isLoading ? "Actualizando..." : "Actualizar Propiedad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
