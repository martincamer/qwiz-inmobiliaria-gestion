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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Geometric lines */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Diagonal lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gray-300/60 transform -rotate-12"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gray-300/50 transform rotate-12"></div>
          <div className="absolute top-0 left-2/3 w-px h-full bg-gray-200/40 transform -rotate-6"></div>

          {/* Horizontal accent lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gray-300/40"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200/30"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gray-300/35"></div>

          {/* Vertical accent lines */}
          <div className="absolute top-0 left-1/6 w-px h-full bg-gray-200/25"></div>
          <div className="absolute top-0 right-1/6 w-px h-full bg-gray-200/25"></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/5 left-1/8 w-3 h-3 bg-gray-400/40 rounded-full"></div>
          <div className="absolute top-1/3 right-1/6 w-2 h-2 bg-gray-300/50 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2.5 h-2.5 bg-gray-400/35 rounded-full"></div>
          <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-gray-300/45 rounded-full"></div>
          <div className="absolute bottom-1/5 right-1/3 w-2 h-2 bg-gray-400/30 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Plataforma líder en gestión inmobiliaria
            </div>

            {/* Main heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="text-gray-900 block leading-none">
                  Tu inmobiliaria
                </span>
                <span className="text-yellow-500 text-shadow-amber-600 block mt-2 leading-none">
                  al siguiente nivel
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                La plataforma integral que revoluciona la gestión inmobiliaria.
                <br className="hidden md:block" />
                Simplifica tus operaciones y potencia tu crecimiento.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/register">
                <Button
                  size="lg"
                  className="text-lg px-12 py-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  Prueba Gratuita 30 días
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-12 py-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="pt-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                    +1000
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                    Inmobiliarias
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                    +5000
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                    Propiedades
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                    98%
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                    Satisfacción
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                    24/7
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                    Soporte
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24 bg-white">
        <div className="text-center mb-16">
          <span className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
            CARACTERÍSTICAS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="border border-gray-200 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-1 bg-white group"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-yellow-500 rounded-lg flex items-center justify-center mb-4 transition-all duration-300">
                    <Icon className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
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
      <section className="relative bg-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        {/* Creative Geometric Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Central vertical line */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-gray-300 opacity-40 transform -translate-x-1/2"></div>
          
          {/* Central horizontal line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 opacity-35 transform -translate-y-1/2"></div>
          
          {/* Diagonal cross lines from center */}
          <div className="absolute top-1/2 left-1/2 w-px h-64 bg-gray-200 opacity-30 transform -translate-x-1/2 -translate-y-1/2 rotate-45 origin-center"></div>
          <div className="absolute top-1/2 left-1/2 w-px h-64 bg-gray-200 opacity-30 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-center"></div>
          
          {/* Corner accent lines */}
          <div className="absolute top-10 left-10 w-16 h-px bg-yellow-400 opacity-60"></div>
          <div className="absolute top-10 left-10 w-px h-16 bg-yellow-400 opacity-60"></div>
          <div className="absolute bottom-10 right-10 w-16 h-px bg-yellow-400 opacity-60"></div>
          <div className="absolute bottom-10 right-10 w-px h-16 bg-yellow-400 opacity-60"></div>
          
          {/* Curved accent lines */}
          <div className="absolute top-1/4 left-1/4 w-32 h-px bg-gray-200 opacity-25 transform rotate-12 origin-left"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-px bg-gray-200 opacity-25 transform -rotate-12 origin-right"></div>
          
          {/* Dotted lines */}
          <div 
            className="absolute top-1/3 left-0 w-full h-px opacity-20"
            style={{
              background: 'repeating-linear-gradient(to right, #9CA3AF 0px, #9CA3AF 8px, transparent 8px, transparent 16px)'
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-0 w-full h-px opacity-20"
            style={{
              background: 'repeating-linear-gradient(to right, #9CA3AF 0px, #9CA3AF 8px, transparent 8px, transparent 16px)'
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
                BENEFICIOS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
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
                    className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
                  >
                    <CheckCircle className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 hover:bg-yellow-50 rounded-xl p-6 transition-all duration-300 group">
                    <Building2 className="h-8 w-8 text-gray-700 group-hover:text-yellow-500 mb-3 transition-colors duration-300" />
                    <div className="text-3xl font-bold text-gray-900">
                      +1000
                    </div>
                    <div className="text-sm text-gray-600">Propiedades</div>
                  </div>
                  <div className="bg-gray-50 hover:bg-yellow-50 rounded-xl p-6 transition-all duration-300 group">
                    <Users className="h-8 w-8 text-gray-700 group-hover:text-yellow-500 mb-3 transition-colors duration-300" />
                    <div className="text-3xl font-bold text-gray-900">+500</div>
                    <div className="text-sm text-gray-600">Inmobiliarias</div>
                  </div>
                  <div className="bg-gray-50 hover:bg-yellow-50 rounded-xl p-6 transition-all duration-300 group">
                    <ShoppingCart className="h-8 w-8 text-gray-700 group-hover:text-yellow-500 mb-3 transition-colors duration-300" />
                    <div className="text-3xl font-bold text-gray-900">
                      +2000
                    </div>
                    <div className="text-sm text-gray-600">Contratos</div>
                  </div>
                  <div className="bg-gray-50 hover:bg-yellow-50 rounded-xl p-6 transition-all duration-300 group">
                    <CreditCard className="h-8 w-8 text-gray-700 group-hover:text-yellow-500 mb-3 transition-colors duration-300" />
                    <div className="text-3xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600">Cobros</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative bg-white py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
              PLANES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
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
                className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular
                    ? "border-2 border-yellow-500 shadow-xl shadow-yellow-500/20 bg-gradient-to-b from-yellow-50 to-white"
                    : "border border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-500 text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-lg">
                      Más Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-10">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-6">
                    <span
                      className={`text-4xl font-bold ${
                        plan.popular ? "text-yellow-600" : "text-gray-900"
                      }`}
                    >
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
                        <CheckCircle
                          className={`h-5 w-5 flex-shrink-0 ${
                            plan.popular ? "text-yellow-500" : "text-gray-400"
                          }`}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block mt-6">
                    <Button
                      className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-yellow-500/30"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Comenzar Ahora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="relative bg-gray-50 py-24"
      >
        {/* Blur gradient overlay at top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/80 via-white/40 to-transparent backdrop-blur-sm pointer-events-none"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              ¿Listo para transformar tu inmobiliaria?
            </h2>
            <p className="text-xl text-gray-600">
              Unite a los líderes del mercado inmobiliario que ya optimizaron su
              gestión
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300"
                >
                  Comenzar Prueba Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 text-gray-700 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300"
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
