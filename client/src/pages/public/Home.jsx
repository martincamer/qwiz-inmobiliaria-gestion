import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Building2,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Building2,
      title: "Gestión de Propiedades",
      description:
        "Control completo de tu cartera de propiedades, seguimiento de estados y disponibilidad.",
    },
    {
      icon: Users,
      title: "Gestión de Clientes",
      description:
        "Base de datos completa de propietarios e inquilinos con historial de operaciones.",
    },
    {
      icon: CreditCard,
      title: "Cuentas Corrientes",
      description:
        "Manejo de alquileres, expensas, pagos y estados de cuenta detallados.",
    },
    {
      icon: ShoppingCart,
      title: "Gestión de Contratos",
      description:
        "Administración de contratos de alquiler, venta y seguimiento de vencimientos.",
    },
    {
      icon: BarChart3,
      title: "Reportes y Analytics",
      description:
        "Dashboards intuitivos con métricas clave para tomar mejores decisiones.",
    },
    {
      icon: Shield,
      title: "Seguridad Avanzada",
      description:
        "Protección de datos sensibles con encriptación y backups automáticos.",
    },
  ];

  const benefits = [
    "Reduce tiempo en tareas administrativas hasta un 70%",
    "Control total de propiedades y contratos en un solo lugar",
    "Seguimiento eficiente de pagos y morosidad",
    "Gestión automatizada de vencimientos de contratos",
    "Comunicación efectiva con propietarios e inquilinos",
    "Reportes detallados de rendimiento y ocupación",
  ];

  const plans = [
    {
      name: "Mensual",
      price: "$30.000,00",
      period: "/mes",
      description: "Pago mensual sin compromiso",
      features: [
        "Propiedades ilimitadas",
        "Contratos ilimitados",
        "Reportes completos",
        "Soporte prioritario",
        "Portal de inquilinos",
        "Múltiples usuarios",
      ],
    },
    {
      name: "Anual",
      price: "$200.000,00",
      period: "/año",
      description: "Pago anual con descuento",
      features: [
        "Propiedades ilimitadas",
        "Contratos ilimitados",
        "Reportes completos",
        "Soporte prioritario",
        "Portal de inquilinos",
        "Múltiples usuarios",
        "Ahorro de $160.000 al año",
      ],
      popular: true,
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-40 text-center overflow-hidden">
        {/* Background blur effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Tu inmobiliaria
            <span className="text-primary block mt-2">al siguiente nivel</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            La plataforma integral que revoluciona la gestión inmobiliaria.
            Simplifica tus operaciones y potencia tu crecimiento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/register">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-primary hover:bg-primary/90"
              >
                Prueba Gratuita 30 días
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 border-2 hover:bg-primary/5"
            >
              Ver Demo
            </Button>
          </div>
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">+1000</div>
              <div className="text-sm text-gray-600">Inmobiliarias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">+5000</div>
              <div className="text-sm text-gray-600">Propiedades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-gray-600">Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-gray-600">Soporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="container mx-auto px-4 py-24 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="text-center mb-16">
          <span className="text-primary font-semibold">CARACTERÍSTICAS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Herramientas poderosas diseñadas para optimizar cada aspecto de tu
            negocio inmobiliario
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border border-blue-100 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold">BENEFICIOS</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Optimiza tu gestión inmobiliaria
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Descubre por qué cientos de inmobiliarias confían en nuestra
                plataforma
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm"
                  >
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <Building2 className="h-8 w-8 text-primary mb-3" />
                    <div className="text-3xl font-bold text-primary">+1000</div>
                    <div className="text-sm text-gray-600">Propiedades</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <Users className="h-8 w-8 text-primary mb-3" />
                    <div className="text-3xl font-bold text-primary">+500</div>
                    <div className="text-sm text-gray-600">Inmobiliarias</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <ShoppingCart className="h-8 w-8 text-primary mb-3" />
                    <div className="text-3xl font-bold text-primary">+2000</div>
                    <div className="text-sm text-gray-600">Contratos</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <CreditCard className="h-8 w-8 text-primary mb-3" />
                    <div className="text-3xl font-bold text-primary">98%</div>
                    <div className="text-sm text-gray-600">Cobros</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold">PLANES</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Elige el plan ideal para tu negocio
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Precios transparentes con todas las funcionalidades incluidas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden ${
                plan.popular
                  ? "border-2 border-primary shadow-xl"
                  : "border border-blue-100"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    Más Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pt-10">
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button
                    className={`w-full py-6 text-lg font-semibold ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-blue-50 text-primary hover:bg-blue-100"
                    }`}
                  >
                    Comenzar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="bg-gradient-to-br from-primary to-blue-600 py-24"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Listo para transformar tu inmobiliaria?
            </h2>
            <p className="text-xl text-white/90">
              Unite a los líderes del mercado inmobiliario que ya optimizaron su
              gestión
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 bg-white text-primary hover:bg-blue-50"
                >
                  Comenzar Prueba Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 text-white border-2 border-white/30 hover:bg-white/10"
              >
                Agendar Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
