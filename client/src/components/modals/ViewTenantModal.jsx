import { useState } from "react";
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
  Edit,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  CreditCard,
  Users,
  Briefcase,
} from "lucide-react";

const ViewTenantModal = ({ isOpen, tenant, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState("personal");

  if (!isOpen || !tenant) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "No especificado";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "activo":
        return "bg-green-100 text-green-800";
      case "inactivo":
        return "bg-gray-100 text-gray-800";
      case "suspendido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "activo":
        return <CheckCircle className="h-4 w-4" />;
      case "inactivo":
        return <Clock className="h-4 w-4" />;
      case "suspendido":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "direccion", label: "Dirección", icon: MapPin },
    { id: "alquiler", label: "Alquiler", icon: Home },
    { id: "adicional", label: "Adicional", icon: FileText },
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Nombre Completo
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {tenant.nombre} {tenant.apellido}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Email
            </label>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{tenant.email || "No especificado"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Teléfono
            </label>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{tenant.telefono || "No especificado"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Estado
            </label>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                tenant.estado
              )}`}
            >
              {getStatusIcon(tenant.estado)}
              <span className="ml-1 capitalize">{tenant.estado || "activo"}</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Tipo de Documento
            </label>
            <p className="text-gray-900">{tenant.tipoDocumento || "No especificado"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Número de Documento
            </label>
            <p className="text-gray-900">{tenant.numeroDocumento || "No especificado"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Fecha de Nacimiento
            </label>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{formatDate(tenant.fechaNacimiento)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Fecha de Registro
            </label>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{formatDate(tenant.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDireccionInfo = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 text-blue-600 mr-2" />
          Dirección del Inquilino
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Dirección
            </label>
            <p className="text-gray-900">{tenant.direccion || "No especificado"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Ciudad
            </label>
            <p className="text-gray-900">{tenant.ciudad || "No especificado"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Provincia
            </label>
            <p className="text-gray-900">{tenant.provincia || "No especificado"}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Código Postal
            </label>
            <p className="text-gray-900">{tenant.codigoPostal || "No especificado"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlquilerInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 text-blue-600 mr-2" />
          Información de la Propiedad
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Propiedad
            </label>
            <p className="text-gray-900">
              {tenant.propiedad?.direccion || "No especificado"}
              {tenant.propiedad?.tipo && (
                <span className="text-gray-500 ml-2">({tenant.propiedad.tipo})</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 text-green-600 mr-2" />
          Información del Contrato
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Fecha Inicio
            </label>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{formatDate(tenant.fechaInicioContrato)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Fecha Fin
            </label>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{formatDate(tenant.fechaFinContrato)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Monto Alquiler
            </label>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(tenant.montoAlquiler)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Monto Depósito
            </label>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{formatCurrency(tenant.montoDeposito)}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Día de Vencimiento
            </label>
            <p className="text-gray-900">
              Día {tenant.diaVencimiento || "10"} de cada mes
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdicionalInfo = () => (
    <div className="space-y-6">
      {/* Contacto de emergencia */}
      {(tenant.contactoEmergenciaNombre || tenant.contactoEmergenciaTelefono) && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            Contacto de Emergencia
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Nombre
              </label>
              <p className="text-gray-900">{tenant.contactoEmergenciaNombre || "No especificado"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Teléfono
              </label>
              <p className="text-gray-900">{tenant.contactoEmergenciaTelefono || "No especificado"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Relación
              </label>
              <p className="text-gray-900">{tenant.contactoEmergenciaRelacion || "No especificado"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Información laboral */}
      {(tenant.ocupacion || tenant.empleador || tenant.ingresosMensuales) && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
            Información Laboral
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Ocupación
              </label>
              <p className="text-gray-900">{tenant.ocupacion || "No especificado"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Empleador
              </label>
              <p className="text-gray-900">{tenant.empleador || "No especificado"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Ingresos Mensuales
              </label>
              <p className="text-gray-900">{formatCurrency(tenant.ingresosMensuales)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Referencias */}
      {(tenant.referenciaPersonalNombre || tenant.referenciaLaboralNombre) && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-yellow-600 mr-2" />
            Referencias
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-md font-medium text-gray-800 mb-2">Referencia Personal</h5>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nombre
                  </label>
                  <p className="text-gray-900">{tenant.referenciaPersonalNombre || "No especificado"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Teléfono
                  </label>
                  <p className="text-gray-900">{tenant.referenciaPersonalTelefono || "No especificado"}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-md font-medium text-gray-800 mb-2">Referencia Laboral</h5>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nombre
                  </label>
                  <p className="text-gray-900">{tenant.referenciaLaboralNombre || "No especificado"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Teléfono
                  </label>
                  <p className="text-gray-900">{tenant.referenciaLaboralTelefono || "No especificado"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notas */}
      {tenant.notas && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 text-gray-600 mr-2" />
            Notas
          </h4>
          <p className="text-gray-900 whitespace-pre-wrap">{tenant.notas}</p>
        </div>
      )}

      {/* Información de auditoría */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Información del Sistema
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Creado
            </label>
            <p className="text-gray-900">{formatDate(tenant.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Última Actualización
            </label>
            <p className="text-gray-900">{formatDate(tenant.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {tenant.nombre} {tenant.apellido}
            </h2>
            <p className="text-gray-600">Detalles del inquilino</p>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(tenant)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "personal" && renderPersonalInfo()}
          {activeTab === "direccion" && renderDireccionInfo()}
          {activeTab === "alquiler" && renderAlquilerInfo()}
          {activeTab === "adicional" && renderAdicionalInfo()}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTenantModal;