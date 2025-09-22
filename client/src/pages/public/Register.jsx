import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Building2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import logo from "@/assets/logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    slug: "",
    companyType: "",
    realEstateType: "residential",
    agentCount: 1,
    licenseNumber: "",
    userType: "owner",
    cuit: "",
    businessName: "",
    taxCategory: "",
    startDate: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { register, isLoading: authLoading } = useAuth();

  const companyTypes = [
    { value: "individual", label: "Agente individual" },
    { value: "small", label: "Inmobiliaria pequeña (2-10 agentes)" },
    { value: "medium", label: "Inmobiliaria mediana (11-25 agentes)" },
    { value: "large", label: "Inmobiliaria grande (26-50 agentes)" },
    { value: "enterprise", label: "Red inmobiliaria (50+ agentes)" },
    { value: "franchise", label: "Franquicia inmobiliaria" },
  ];

  const realEstateTypes = [
    { value: "residential", label: "Residencial" },
    { value: "commercial", label: "Comercial" },
    { value: "industrial", label: "Industrial" },
    { value: "mixed", label: "Mixto" },
    { value: "luxury", label: "Lujo" },
    { value: "rural", label: "Rural" },
  ];

  const userTypes = [
    { value: "owner", label: "Propietario" },
    { value: "manager", label: "Gerente" },
    { value: "agent", label: "Agente" },
    { value: "assistant", label: "Asistente" },
    { value: "accountant", label: "Contador" },
    { value: "collaborator", label: "Colaborador" },
  ];

  const taxCategories = [
    { value: "Monotributista", label: "Monotributista" },
    { value: "Responsable Inscripto", label: "Responsable Inscripto" },
    { value: "Exento", label: "Exento" },
    { value: "Consumidor Final", label: "Consumidor Final" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar mensajes cuando el usuario empiece a escribir
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (companyName) => {
    return companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleCompanyNameChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      company: value,
      slug: generateSlug(value),
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      return "Por favor, completa tu nombre y apellido";
    }

    if (!formData.email || !formData.email.includes("@")) {
      return "Por favor, ingresa un email válido";
    }

    if (!formData.company) {
      return "Por favor, ingresa el nombre de tu inmobiliaria";
    }

    if (!formData.companyType) {
      return "Por favor, selecciona el tipo de inmobiliaria";
    }

    if (!formData.realEstateType) {
      return "Por favor, selecciona el tipo de negocio inmobiliario";
    }

    if (!formData.userType) {
      return "Por favor, selecciona tu rol en la inmobiliaria";
    }

    if (formData.agentCount < 1) {
      return "El número de agentes debe ser al menos 1";
    }

    if (!formData.password || formData.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden";
    }

    if (!formData.acceptTerms) {
      return "Debes aceptar los términos y condiciones";
    }

    // Los campos de AFIP son completamente opcionales

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        slug: formData.slug,
        companyType: formData.companyType,
        realEstateType: formData.realEstateType,
        agentCount: formData.agentCount,
        licenseNumber: formData.licenseNumber,
        userType: formData.userType,
        password: formData.password,
        acceptTerms: formData.acceptTerms,
        acceptMarketing: formData.acceptMarketing,
        // Datos AFIP opcionales
        cuit: formData.cuit,
        businessName: formData.businessName,
        taxCategory: formData.taxCategory,
        startDate: formData.startDate,
      });

      setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login...");

      // Redireccionar al login después de un momento
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Cuenta creada exitosamente. Puedes iniciar sesión ahora.",
            email: formData.email,
          },
        });
      }, 2000);
    } catch (err) {
      setError(
        err.message ||
          "Error al crear la cuenta. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 relative overflow-hidden">
      {/* Background pattern with lines */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
          linear-gradient(45deg, transparent 49%, rgba(156, 163, 175, 0.3) 49%, rgba(156, 163, 175, 0.3) 51%, transparent 51%),
          linear-gradient(-45deg, transparent 49%, rgba(156, 163, 175, 0.2) 49%, rgba(156, 163, 175, 0.2) 51%, transparent 51%)
        `,
          backgroundSize: "20px 20px",
        }}
      >
        {/* Diagonal lines */}
        <div className="absolute inset-0 transform rotate-45">
          <div className="w-full h-0.5 bg-gray-300 absolute top-1/4"></div>
          <div className="w-full h-0.5 bg-gray-300 absolute top-2/4"></div>
          <div className="w-full h-0.5 bg-gray-300 absolute top-3/4"></div>
        </div>

        {/* Vertical lines */}
        <div className="absolute inset-0">
          <div className="h-full w-0.5 bg-gray-200 absolute left-1/4"></div>
          <div className="h-full w-0.5 bg-gray-200 absolute left-1/3"></div>
          <div className="h-full w-0.5 bg-gray-200 absolute left-2/3"></div>
          <div className="h-full w-0.5 bg-gray-200 absolute left-3/4"></div>
        </div>

        {/* Horizontal lines */}
        <div className="absolute inset-0">
          <div className="w-full h-0.5 bg-gray-200 absolute top-1/4"></div>
          <div className="w-full h-0.5 bg-gray-200 absolute top-1/3"></div>
          <div className="w-full h-0.5 bg-gray-200 absolute top-2/3"></div>
          <div className="w-full h-0.5 bg-gray-200 absolute top-3/4"></div>
        </div>
      </div>
      <div className="w-full max-w-2xl space-y-8 relative z-10">
        {/* Logo y título */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <img src={logo} alt="logo" className="h-10 w-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Crear Cuenta</h1>
          <p className="text-muted-foreground mt-2">
            Únete al CRM inmobiliario líder y potencia tu negocio
          </p>
        </div>

        {/* Formulario de registro */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Registro Gratuito - CRM Inmobiliario
            </CardTitle>
            <CardDescription className="text-center">
              Completa la información para crear tu cuenta y comenzar a
              gestionar propiedades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Información personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Apellido */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Tu apellido"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@inmobiliaria.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de la empresa */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Información de la Inmobiliaria
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Empresa */}
                  <div className="space-y-2">
                    <Label htmlFor="company">Nombre de la Inmobiliaria *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Inmobiliaria Premium S.A."
                        value={formData.company}
                        onChange={handleCompanyNameChange}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL de la Inmobiliaria</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="slug"
                        name="slug"
                        type="text"
                        placeholder="inmobiliaria-premium"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Se generará automáticamente basado en el nombre
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo de inmobiliaria */}
                  <div className="space-y-2">
                    <Label htmlFor="companyType">Tipo de Inmobiliaria *</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("companyType", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo de negocio inmobiliario */}
                  <div className="space-y-2">
                    <Label htmlFor="realEstateType">Tipo de Negocio *</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("realEstateType", value)}
                      disabled={isLoading}
                      defaultValue="residential"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de negocio" />
                      </SelectTrigger>
                      <SelectContent>
                        {realEstateTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Número de agentes */}
                  <div className="space-y-2">
                    <Label htmlFor="agentCount">Número de Agentes *</Label>
                    <Input
                      id="agentCount"
                      name="agentCount"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.agentCount}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Número de licencia */}
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Número de Licencia</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      placeholder="LIC-12345"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Rol del usuario */}
                  <div className="space-y-2">
                    <Label htmlFor="userType">Tu Rol *</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("userType", value)}
                      disabled={isLoading}
                      defaultValue="owner"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contraseñas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Seguridad
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Contraseña *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("acceptTerms", checked)
                    }
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm leading-5 cursor-pointer"
                  >
                    Acepto los{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Términos y Condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      Política de Privacidad
                    </Link>{" "}
                    *
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("acceptMarketing", checked)
                    }
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="acceptMarketing"
                    className="text-sm leading-5 cursor-pointer"
                  >
                    Quiero recibir actualizaciones sobre productos, ofertas
                    especiales y consejos empresariales
                  </Label>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || authLoading}
                size="lg"
              >
                {isLoading || authLoading
                  ? "Creando cuenta..."
                  : "Crear Cuenta Gratuita"}
              </Button>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
