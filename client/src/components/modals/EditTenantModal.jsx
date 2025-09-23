import { useState, useEffect } from "react";
import { useTenants } from "../../contexts/TenantsContext";
import { useProperties } from "../../contexts/PropertiesContext";
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
} from "lucide-react";
import { toast } from "sonner";

const EditTenantModal = ({ isOpen, tenant, onClose, onSuccess }) => {
  const { updateTenant, isLoading } = useTenants();
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

  // Cargar datos del inquilino cuando se abre el modal
  useEffect(() => {
    if (isOpen && tenant) {
      setFormData({
        nombre: tenant.nombre || "",
        apellido: tenant.apellido || "",
        email: tenant.email || "",
        telefono: tenant.telefono || "",
        fechaNacimiento: tenant.fechaNacimiento ? tenant.fechaNacimiento.split('T')[0] : "",
        numeroDocumento: tenant.numeroDocumento || "",
        tipoDocumento: tenant.tipoDocumento || "DNI",
        direccion: tenant.direccion || "",
        ciudad: tenant.ciudad || "",
        provincia: tenant.provincia || "",
        codigoPostal: tenant.codigoPostal || "",
        propiedad: tenant.propiedad?._id || tenant.propiedad || "",
        fechaInicioContrato: tenant.fechaInicioContrato ? tenant.fechaInicioContrato.split('T')[0] : "",
        fechaFinContrato: tenant.fechaFinContrato ? tenant.fechaFinContrato.split('T')[0] : "",
        montoAlquiler: tenant.montoAlquiler || "",
        montoDeposito: tenant.montoDeposito || "",
        diaVencimiento: tenant.diaVencimiento || "10",
        estado: tenant.estado || "activo",
        notas: tenant.notas || "",
        contactoEmergenciaNombre: tenant.contactoEmergenciaNombre || "",
        contactoEmergenciaTelefono: tenant.contactoEmergenciaTelefono || "",
        contactoEmergenciaRelacion: tenant.contactoEmergenciaRelacion || "",
        ocupacion: tenant.ocupacion || "",
        empleador: tenant.empleador || "",
        ingresosMensuales: tenant.ingresosMensuales || "",
        referenciaPersonalNombre: tenant.referenciaPersonalNombre || "",
        referenciaPersonalTelefono: tenant.referenciaPersonalTelefono || "",
        referenciaLaboralNombre: tenant.referenciaLaboralNombre || "",
        referenciaLaboralTelefono: tenant.referenciaLaboralTelefono || "",
      });
      getProperties();
    }
  }, [isOpen, tenant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
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
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
      const result = await updateTenant(tenant._id, formData);
      
      if (result.success) {
        toast.success("Inquilino actualizado exitosamente");
        onSuccess();
      } else {
        toast.error(result.error || "Error al actualizar inquilino");
      }
    } catch (error) {
      console.error("Error al actualizar inquilino:", error);
      toast.error("Error inesperado al actualizar inquilino");
    }
  };

  const resetForm = () => {
    setErrors({});
    setCurrentStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !tenant) return null;

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <User className="mr-2 h-5 w-5 text-blue-600" />
        Información Personal
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.nombre ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Nombre del inquilino"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.apellido ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Apellido del inquilino"
          />
          {errors.apellido && (
            <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="email@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.telefono ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="+54 11 1234-5678"
          />
          {errors.telefono && (
            <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Documento
          </label>
          <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DNI">DNI</option>
            <option value="CUIT">CUIT</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Documento *
          </label>
          <input
            type="text"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.numeroDocumento ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="12345678"
          />
          {errors.numeroDocumento && (
            <p className="mt-1 text-sm text-red-600">{errors.numeroDocumento}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <MapPin className="mr-2 h-5 w-5 text-blue-600" />
        Dirección
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección *
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.direccion ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Calle, número, piso, departamento"
          />
          {errors.direccion && (
            <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.ciudad ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Ciudad"
          />
          {errors.ciudad && (
            <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provincia *
          </label>
          <input
            type="text"
            name="provincia"
            value={formData.provincia}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.provincia ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Provincia"
          />
          {errors.provincia && (
            <p className="mt-1 text-sm text-red-600">{errors.provincia}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código Postal
          </label>
          <input
            type="text"
            name="codigoPostal"
            value={formData.codigoPostal}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="1234"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <Home className="mr-2 h-5 w-5 text-blue-600" />
        Información del Alquiler
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Propiedad *
          </label>
          <select
            name="propiedad"
            value={formData.propiedad}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.propiedad ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Seleccionar propiedad</option>
            {properties.map((property) => (
              <option key={property._id} value={property._id}>
                {property.direccion} - {property.tipo} ({property.precio ? `$${property.precio}` : 'Sin precio'})
              </option>
            ))}
          </select>
          {errors.propiedad && (
            <p className="mt-1 text-sm text-red-600">{errors.propiedad}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio Contrato *
          </label>
          <input
            type="date"
            name="fechaInicioContrato"
            value={formData.fechaInicioContrato}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.fechaInicioContrato ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.fechaInicioContrato && (
            <p className="mt-1 text-sm text-red-600">{errors.fechaInicioContrato}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Fin Contrato *
          </label>
          <input
            type="date"
            name="fechaFinContrato"
            value={formData.fechaFinContrato}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.fechaFinContrato ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.fechaFinContrato && (
            <p className="mt-1 text-sm text-red-600">{errors.fechaFinContrato}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto Alquiler *
          </label>
          <input
            type="number"
            name="montoAlquiler"
            value={formData.montoAlquiler}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.montoAlquiler ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="50000"
            min="0"
            step="0.01"
          />
          {errors.montoAlquiler && (
            <p className="mt-1 text-sm text-red-600">{errors.montoAlquiler}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto Depósito
          </label>
          <input
            type="number"
            name="montoDeposito"
            value={formData.montoDeposito}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="50000"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Día de Vencimiento
          </label>
          <select
            name="diaVencimiento"
            value={formData.diaVencimiento}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <FileText className="mr-2 h-5 w-5 text-blue-600" />
        Información Adicional
      </h3>
      
      {/* Contacto de emergencia */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Contacto de Emergencia</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="contactoEmergenciaNombre"
              value={formData.contactoEmergenciaNombre}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="contactoEmergenciaTelefono"
              value={formData.contactoEmergenciaTelefono}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+54 11 1234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relación
            </label>
            <input
              type="text"
              name="contactoEmergenciaRelacion"
              value={formData.contactoEmergenciaRelacion}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Padre, hermano, etc."
            />
          </div>
        </div>
      </div>

      {/* Información laboral */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Información Laboral</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ocupación
            </label>
            <input
              type="text"
              name="ocupacion"
              value={formData.ocupacion}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Profesión u ocupación"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empleador
            </label>
            <input
              type="text"
              name="empleador"
              value={formData.empleador}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Empresa o empleador"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingresos Mensuales
            </label>
            <input
              type="number"
              name="ingresosMensuales"
              value={formData.ingresosMensuales}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="100000"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Referencias */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Referencias</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referencia Personal - Nombre
            </label>
            <input
              type="text"
              name="referenciaPersonalNombre"
              value={formData.referenciaPersonalNombre}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referencia Personal - Teléfono
            </label>
            <input
              type="tel"
              name="referenciaPersonalTelefono"
              value={formData.referenciaPersonalTelefono}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+54 11 1234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referencia Laboral - Nombre
            </label>
            <input
              type="text"
              name="referenciaLaboralNombre"
              value={formData.referenciaLaboralNombre}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referencia Laboral - Teléfono
            </label>
            <input
              type="tel"
              name="referenciaLaboralTelefono"
              value={formData.referenciaLaboralTelefono}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+54 11 1234-5678"
            />
          </div>
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={handleInputChange}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Notas adicionales sobre el inquilino..."
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Editar Inquilino: {tenant.nombre} {tenant.apellido}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Indicador de pasos */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step === currentStep
                      ? "border-blue-600 bg-blue-600 text-white"
                      : step < currentStep
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      step < currentStep ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Personal</span>
            <span>Dirección</span>
            <span>Alquiler</span>
            <span>Adicional</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <span className="text-sm text-gray-500">
              Paso {currentStep} de {totalSteps}
            </span>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Actualizar Inquilino
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTenantModal;