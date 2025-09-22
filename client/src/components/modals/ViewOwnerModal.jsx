import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  Settings, 
  X, 
  Eye, 
  Mail, 
  Phone, 
  IdCard,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react';

const ViewOwnerModal = ({ open, onOpenChange, owner, onEdit }) => {
  if (!owner) return null;

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return 'No especificado';
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatear dirección completa
  const formatAddress = (direccion) => {
    if (!direccion) return 'No especificado';
    
    const parts = [];
    if (direccion.calle) parts.push(direccion.calle);
    if (direccion.numero) parts.push(direccion.numero);
    if (direccion.piso) parts.push(`Piso ${direccion.piso}`);
    if (direccion.departamento) parts.push(`Depto ${direccion.departamento}`);
    
    let address = parts.join(' ');
    
    const locationParts = [];
    if (direccion.ciudad) locationParts.push(direccion.ciudad);
    if (direccion.provincia) locationParts.push(direccion.provincia);
    if (direccion.codigoPostal) locationParts.push(`(${direccion.codigoPostal})`);
    
    if (locationParts.length > 0) {
      address += address ? `, ${locationParts.join(', ')}` : locationParts.join(', ');
    }
    
    return address || 'No especificado';
  };

  // Obtener badge de condición IVA
  const getIvaBadge = (condicion) => {
    const variants = {
      'CONSUMIDOR_FINAL': 'secondary',
      'RESPONSABLE_INSCRIPTO': 'default',
      'MONOTRIBUTISTA': 'outline',
      'EXENTO': 'destructive',
      'RESPONSABLE_NO_INSCRIPTO': 'secondary'
    };
    
    const labels = {
      'CONSUMIDOR_FINAL': 'Consumidor Final',
      'RESPONSABLE_INSCRIPTO': 'Responsable Inscripto',
      'MONOTRIBUTISTA': 'Monotributista',
      'EXENTO': 'Exento',
      'RESPONSABLE_NO_INSCRIPTO': 'Responsable No Inscripto'
    };
    
    return (
      <Badge variant={variants[condicion] || 'secondary'}>
        {labels[condicion] || condicion}
      </Badge>
    );
  };

  // Obtener badge de tipo de cuenta
  const getAccountTypeBadge = (tipo) => {
    const labels = {
      'CAJA_AHORRO': 'Caja de Ahorro',
      'CORRIENTE': 'Cuenta Corriente',
      'AHORRO': 'Ahorro'
    };
    
    return (
      <Badge variant="outline">
        {labels[tipo] || tipo}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Detalles del Propietario
          </DialogTitle>
          <DialogDescription>
            Información completa de {owner.nombre} {owner.apellido}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                  <CardTitle className="text-lg">Información Personal</CardTitle>
                  <CardDescription>Datos básicos del propietario</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                          <p className="text-lg font-semibold">{owner.nombre} {owner.apellido}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p className="text-base">{owner.email || 'No especificado'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                          <p className="text-base">{owner.telefono || 'No especificado'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <IdCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Identificación</p>
                          <p className="text-base">
                            {owner.tipoIdentificacion}: {owner.numeroIdentificacion || 'No especificado'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
                          <p className="text-base">{formatDate(owner.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
                          <p className="text-base">{formatDate(owner.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
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
                  <CardDescription>Información de domicilio del propietario</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Dirección Completa</p>
                      <p className="text-base">{formatAddress(owner.direccion)}</p>
                    </div>
                  </div>
                  
                  {owner.direccion && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Calle</p>
                        <p className="text-base">{owner.direccion.calle || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Número</p>
                        <p className="text-base">{owner.direccion.numero || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Piso</p>
                        <p className="text-base">{owner.direccion.piso || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Departamento</p>
                        <p className="text-base">{owner.direccion.departamento || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Ciudad</p>
                        <p className="text-base">{owner.direccion.ciudad || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Provincia</p>
                        <p className="text-base">{owner.direccion.provincia || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Código Postal</p>
                        <p className="text-base">{owner.direccion.codigoPostal || 'No especificado'}</p>
                      </div>
                    </div>
                  )}
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
                  <CardDescription>Datos bancarios para transferencias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {owner.informacionBancaria ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Banco</p>
                          <p className="text-base">{owner.informacionBancaria.banco || 'No especificado'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Tipo de Cuenta</p>
                          <div className="mt-1">
                            {getAccountTypeBadge(owner.informacionBancaria.tipoCuenta)}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Número de Cuenta</p>
                          <p className="text-base font-mono">{owner.informacionBancaria.numeroCuenta || 'No especificado'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">CBU</p>
                          <p className="text-base font-mono">{owner.informacionBancaria.cbu || 'No especificado'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Alias</p>
                          <p className="text-base font-mono">{owner.informacionBancaria.alias || 'No especificado'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay información bancaria registrada</p>
                  )}
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
                  <CardDescription>Datos fiscales y tributarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {owner.informacionFiscal ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Condición IVA</p>
                        <div className="mt-1">
                          {getIvaBadge(owner.informacionFiscal.condicionIva)}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Ingresos Brutos</p>
                        <p className="text-base font-mono">{owner.informacionFiscal.ingresosBrutos || 'No especificado'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay información fiscal registrada</p>
                  )}
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
                  <CardDescription>Preferencias y notas adicionales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Notas</p>
                      <div className="mt-1 p-3 bg-muted rounded-md">
                        <p className="text-base whitespace-pre-wrap">
                          {owner.notas || 'No hay notas adicionales'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Configuración de Notificaciones</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {owner.configuracionNotificaciones?.email ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-base">Notificaciones por Email</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {owner.configuracionNotificaciones?.sms ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-base">Notificaciones por SMS</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {owner.configuracionNotificaciones?.whatsapp ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-base">Notificaciones por WhatsApp</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botones de acción */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => onEdit(owner)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Propietario
            </Button>
            
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOwnerModal;