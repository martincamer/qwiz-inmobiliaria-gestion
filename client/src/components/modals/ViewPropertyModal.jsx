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
import {
  Home,
  MapPin,
  Ruler,
  DollarSign,
  Wifi,
  Star,
  Settings,
  X,
  Eye,
  User,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Heart,
  EyeIcon,
  Image as ImageIcon,
} from "lucide-react";

const ViewPropertyModal = ({ open, onOpenChange, property, onEdit }) => {
  if (!property) return null;

  console.log("property", property);

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return "No especificado";
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Formatear dirección completa
  const formatAddress = (location) => {
    if (!location) return "No especificado";

    const parts = [];
    if (location.address) parts.push(location.address);

    const locationParts = [];
    if (location.neighborhood) locationParts.push(location.neighborhood);
    if (location.city) locationParts.push(location.city);
    if (location.province) locationParts.push(location.province);
    if (location.postalCode) locationParts.push(`(${location.postalCode})`);

    if (locationParts.length > 0) {
      parts.push(locationParts.join(", "));
    }

    return parts.join(", ") || "No especificado";
  };

  // Formatear precio
  const formatPrice = (price, currency = "ARS") => {
    if (!price) return "No especificado";

    const currencySymbols = {
      ARS: "$",
      USD: "US$",
      EUR: "€",
    };

    return `${currencySymbols[currency] || "$"} ${Number(price).toLocaleString(
      "es-AR"
    )}`;
  };

  // Obtener badge de tipo de propiedad
  const getPropertyTypeBadge = (type) => {
    const variants = {
      CASA: "default",
      DEPARTAMENTO: "secondary",
      PH: "outline",
      OFICINA: "destructive",
      LOCAL: "secondary",
      TERRENO: "outline",
      GALPON: "secondary",
      QUINTA: "default",
      OTRO: "outline",
    };

    const labels = {
      CASA: "Casa",
      DEPARTAMENTO: "Departamento",
      PH: "PH",
      OFICINA: "Oficina",
      LOCAL: "Local",
      TERRENO: "Terreno",
      GALPON: "Galpón",
      QUINTA: "Quinta",
      OTRO: "Otro",
    };

    return (
      <Badge variant={variants[type] || "secondary"}>
        {labels[type] || type}
      </Badge>
    );
  };

  // Obtener badge de estado
  const getStatusBadge = (status) => {
    const variants = {
      DISPONIBLE: "default",
      RESERVADA: "secondary",
      VENDIDA: "destructive",
      ALQUILADA: "outline",
      MANTENIMIENTO: "secondary",
      INACTIVA: "outline",
    };

    const labels = {
      DISPONIBLE: "Disponible",
      RESERVADA: "Reservada",
      VENDIDA: "Vendida",
      ALQUILADA: "Alquilada",
      MANTENIMIENTO: "En Mantenimiento",
      INACTIVA: "Inactiva",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Detalles de la Propiedad
          </DialogTitle>
          <DialogDescription>
            Información completa de "{property.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs defaultValue="basica" className="w-full">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="basica">Básica</TabsTrigger>
              <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
              <TabsTrigger value="caracteristicas">Características</TabsTrigger>
              <TabsTrigger value="precios">Precios</TabsTrigger>
              <TabsTrigger value="servicios">Servicios</TabsTrigger>
              <TabsTrigger value="amenities">Ambientes</TabsTrigger>
              <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Título
                          </p>
                          <p className="text-lg font-semibold">
                            {property.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Tipo de Propiedad
                          </p>
                          <div className="mt-1">
                            {getPropertyTypeBadge(property.type)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Estado
                          </p>
                          <div className="mt-1">
                            {getStatusBadge(property.status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Propietario
                          </p>
                          <p className="text-base">
                            {property.owner?.nombre && property.owner?.apellido
                              ? `${property.owner.nombre} ${property.owner.apellido}`
                              : property.owner?.nombreCompleto ||
                                "No especificado"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Fecha de Registro
                          </p>
                          <p className="text-base">
                            {formatDate(property.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Última Actualización
                          </p>
                          <p className="text-base">
                            {formatDate(property.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {property.description && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Descripción
                        </p>
                        <div className="p-3 bg-muted rounded-md h-[10vh] overflow-y-scroll">
                          <p className="text-base whitespace-pre-wrap">
                            {property.description}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Vistas
                        </p>
                        <p className="text-base font-semibold">
                          {property.views || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Favoritos
                        </p>
                        <p className="text-base font-semibold">
                          {property.favorites || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Destacada
                        </p>
                        <div className="mt-1">
                          {property.featured ? (
                            <Badge variant="default">Sí</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Publicada
                        </p>
                        <div className="mt-1">
                          {property.published ? (
                            <Badge variant="default">Sí</Badge>
                          ) : (
                            <Badge variant="destructive">No</Badge>
                          )}
                        </div>
                      </div>
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
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Dirección Completa
                      </p>
                      <p className="text-base">
                        {formatAddress(property.location)}
                      </p>
                    </div>
                  </div>

                  {property.location && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Dirección
                        </p>
                        <p className="text-base">
                          {property.location.address || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Barrio
                        </p>
                        <p className="text-base">
                          {property.location.neighborhood || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Ciudad
                        </p>
                        <p className="text-base">
                          {property.location.city || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Provincia
                        </p>
                        <p className="text-base">
                          {property.location.province || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Código Postal
                        </p>
                        <p className="text-base">
                          {property.location.postalCode || "No especificado"}
                        </p>
                      </div>
                    </div>
                  )}

                  {property.location?.coordinates?.lat &&
                    property.location?.coordinates?.lng && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Latitud
                            </p>
                            <p className="text-base">
                              {property.location.coordinates.lat}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Longitud
                            </p>
                            <p className="text-base">
                              {property.location.coordinates.lng}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
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
                  {property.characteristics ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Dormitorios
                          </p>
                          <p className="text-lg font-semibold">
                            {property.characteristics.bedrooms ||
                              "No especificado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Baños
                          </p>
                          <p className="text-lg font-semibold">
                            {property.characteristics.bathrooms ||
                              "No especificado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Cocheras
                          </p>
                          <p className="text-lg font-semibold">
                            {property.characteristics.garages ||
                              "No especificado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Pisos
                          </p>
                          <p className="text-lg font-semibold">
                            {property.characteristics.floors ||
                              "No especificado"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Superficie Total
                          </p>
                          <p className="text-lg font-semibold">
                            {property.characteristics.totalArea
                              ? `${property.characteristics.totalArea} m²`
                              : "No especificado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Superficie Cubierta
                          </p>
                          <p className="text-lg font-semibold">
                            {property.characteristics.coveredArea
                              ? `${property.characteristics.coveredArea} m²`
                              : "No especificado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Superficie Lote
                          </p>
                          <p className="text-lg font-semibold">
                            {property.characteristics.lotArea
                              ? `${property.characteristics.lotArea} m²`
                              : "No especificado"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Antigüedad
                        </p>
                        <p className="text-lg font-semibold">
                          {property.characteristics.antiquity
                            ? `${property.characteristics.antiquity} años`
                            : "No especificado"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      No hay características especificadas
                    </p>
                  )}
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
                  {property.pricing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Precio de Venta
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatPrice(
                              property.pricing.salePrice,
                              property.pricing.currency
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Precio de Alquiler
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(
                              property.pricing.rentPrice,
                              property.pricing.currency
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Moneda
                          </p>
                          <Badge variant="outline">
                            {property.pricing.currency || "ARS"}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Expensas
                          </p>
                          <p className="text-lg font-semibold">
                            {formatPrice(
                              property.pricing.expenses,
                              property.pricing.currency
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No hay información de precios disponible
                    </p>
                  )}
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
                  {property.services ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.services.water
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Agua</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.services.electricity
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Electricidad</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.services.gas
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Gas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.services.internet
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Internet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.services.cable
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Cable</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.services.phone
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Teléfono</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.services.security
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Seguridad</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.services.maintenance
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Mantenimiento</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No hay información de servicios disponible
                    </p>
                  )}
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
                  {property.amenities ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.pool
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Pileta</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.gym
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Gimnasio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.garden
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Jardín</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.terrace
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Terraza</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.balcony
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Balcón</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.garage
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Garaje</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.storage
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Depósito</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.laundry
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Lavadero</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.airConditioning
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Aire Acondicionado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.heating
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Calefacción</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.fireplace
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Chimenea</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            property.amenities.elevator
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>Ascensor</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No hay información de amenities disponible
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Imágenes */}
            <TabsContent value="imagenes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Imágenes de la Propiedad
                  </CardTitle>
                  <CardDescription>
                    Galería de fotos de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {property.images && property.images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-lg border"
                        >
                          <img
                            src={image.url}
                            alt={image.name || `Imagen ${index + 1}`}
                            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => window.open(image.url, "_blank")}
                              >
                                Ver completa
                              </Button>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                            <p className="text-white text-xs truncate">
                              {image.name || `Imagen ${index + 1}`}
                            </p>
                            <p className="text-white text-xs opacity-75">
                              {image.size
                                ? `${(image.size / 1024).toFixed(1)} KB`
                                : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No hay imágenes disponibles para esta propiedad
                      </p>
                    </div>
                  )}
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
                    Configuración y notas adicionales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {property.notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Notas
                      </p>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-base whitespace-pre-wrap">
                          {property.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        ID de la Propiedad
                      </p>
                      <p className="text-base font-mono">
                        {property._id || property.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Propietario ID
                      </p>
                      <p className="text-base font-mono">
                        {property.owner?._id ||
                          property.owner?.id ||
                          "No especificado"}
                      </p>
                    </div>
                  </div>

                  {property.contractHistory &&
                    property.contractHistory.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Historial de Contratos
                          </p>
                          <div className="space-y-2">
                            {property.contractHistory.map((contract, index) => (
                              <div
                                key={index}
                                className="p-3 bg-muted rounded-md"
                              >
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      Inquilino:
                                    </span>{" "}
                                    {contract.tenant || "No especificado"}
                                  </div>
                                  <div>
                                    <span className="font-medium">Estado:</span>{" "}
                                    <Badge
                                      variant={
                                        contract.active ? "default" : "outline"
                                      }
                                    >
                                      {contract.active ? "Activo" : "Inactivo"}
                                    </Badge>
                                  </div>
                                  <div>
                                    <span className="font-medium">Inicio:</span>{" "}
                                    {formatDate(contract.startDate)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Fin:</span>{" "}
                                    {formatDate(contract.endDate)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onOpenChange}>
              Cerrar
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(property)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPropertyModal;
