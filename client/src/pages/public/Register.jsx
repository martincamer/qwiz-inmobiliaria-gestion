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
    companySize: "",
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

  const companySizes = [
    { value: "1-5", label: "1-5 empleados" },
    { value: "6-20", label: "6-20 empleados" },
    { value: "21-50", label: "21-50 empleados" },
    { value: "51-100", label: "51-100 empleados" },
    { value: "100+", label: "Más de 100 empleados" },
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

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      companySize: value,
    }));
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
      return "Por favor, ingresa el nombre de tu empresa";
    }

    if (!formData.companySize) {
      return "Por favor, selecciona el tamaño de tu empresa";
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

    // Los campos de AFIP son opcionales por ahora

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
        companySize: formData.companySize,
        password: formData.password,
        acceptTerms: formData.acceptTerms,
        acceptMarketing: formData.acceptMarketing,
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
      {/* Background blur effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/6 left-1/6 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/5 right-1/6 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/5 left-1/5 w-72 h-72 bg-rose-500/25 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/6 right-1/5 w-64 h-64 bg-rose-400/20 rounded-full blur-3xl"></div>
      </div>
      <div className="w-full max-w-2xl space-y-8 relative z-10">
        {/* Logo y título */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <img src={logo} alt="logo" className="h-10 w-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Crear Cuenta</h1>
          <p className="text-muted-foreground mt-2">
            Comienza a gestionar tu empresa de manera inteligente
          </p>
        </div>

        {/* Formulario de registro */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Registro Gratuito
            </CardTitle>
            <CardDescription className="text-center">
              Completa la información para crear tu cuenta
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
                        placeholder="tu@empresa.com"
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
                  Información de la Empresa
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Empresa */}
                  <div className="space-y-2">
                    <Label htmlFor="company">Nombre de la Empresa *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Mi Empresa S.A."
                        value={formData.company}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Tamaño de empresa */}
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Tamaño de la Empresa *</Label>
                    <Select
                      onValueChange={handleSelectChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tamaño" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Datos de AFIP */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Datos de AFIP (Opcional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CUIT */}
                  <div className="space-y-2">
                    <Label htmlFor="cuit">CUIT</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cuit"
                        name="cuit"
                        type="text"
                        placeholder="XX-XXXXXXXX-X"
                        value={formData.cuit}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Razón Social */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Razón Social</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessName"
                        name="businessName"
                        type="text"
                        placeholder="Razón social de la empresa"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Categoría Fiscal */}
                  <div className="space-y-2">
                    <Label htmlFor="taxCategory">Categoría Fiscal</Label>
                    <Select
                      onValueChange={(value) => setFormData(prev => ({ ...prev, taxCategory: value }))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {taxCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fecha de Inicio de Actividades */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio de Actividades</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
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
