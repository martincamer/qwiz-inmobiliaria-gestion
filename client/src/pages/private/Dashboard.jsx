import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  // Datos simulados para el dashboard
  const stats = [
    {
      title: 'Ventas del Mes',
      value: '$45,231',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs mes anterior'
    },
    {
      title: 'Productos en Stock',
      value: '1,234',
      change: '-5.2%',
      trend: 'down',
      icon: Package,
      description: 'productos disponibles'
    },
    {
      title: 'Clientes Activos',
      value: '856',
      change: '+8.1%',
      trend: 'up',
      icon: Users,
      description: 'clientes este mes'
    },
    {
      title: 'Cuentas por Cobrar',
      value: '$12,450',
      change: '+3.2%',
      trend: 'up',
      icon: CreditCard,
      description: 'pendientes de pago'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'sale',
      description: 'Nueva venta registrada - Cliente: María García',
      amount: '$1,250',
      time: 'Hace 5 minutos',
      status: 'completed'
    },
    {
      id: 2,
      type: 'inventory',
      description: 'Stock bajo - Producto: Laptop Dell XPS',
      amount: '3 unidades',
      time: 'Hace 15 minutos',
      status: 'warning'
    },
    {
      id: 3,
      type: 'payment',
      description: 'Pago recibido - Cliente: Empresa ABC S.A.',
      amount: '$3,500',
      time: 'Hace 1 hora',
      status: 'completed'
    },
    {
      id: 4,
      type: 'purchase',
      description: 'Nueva orden de compra - Proveedor: TechSupply',
      amount: '$8,900',
      time: 'Hace 2 horas',
      status: 'pending'
    }
  ];

  const lowStockProducts = [
    { name: 'Laptop Dell XPS 13', current: 3, minimum: 10, status: 'critical' },
    { name: 'Mouse Logitech MX', current: 8, minimum: 15, status: 'warning' },
    { name: 'Teclado Mecánico', current: 12, minimum: 20, status: 'warning' },
    { name: 'Monitor 24"', current: 5, minimum: 8, status: 'warning' }
  ];

  const pendingPayments = [
    { client: 'Empresa XYZ', amount: '$4,500', dueDate: '2024-01-15', overdue: true },
    { client: 'Comercial ABC', amount: '$2,300', dueDate: '2024-01-20', overdue: false },
    { client: 'Distribuidora 123', amount: '$1,800', dueDate: '2024-01-25', overdue: false },
    { client: 'Servicios DEF', amount: '$3,200', dueDate: '2024-01-30', overdue: false }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return DollarSign;
      case 'inventory': return Package;
      case 'payment': return CreditCard;
      case 'purchase': return ShoppingCart;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'pending': return 'text-blue-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen general de tu empresa - {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Reportes
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>
                Últimas transacciones y eventos en tu sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className={`p-2 rounded-full bg-muted ${getStatusColor(activity.status)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {activity.amount}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" className="w-full">
                  Ver todas las actividades
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Stock Bajo
              </CardTitle>
              <CardDescription>
                Productos que requieren reposición
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.current} / {product.minimum} unidades
                      </p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${getStatusColor(product.status)}`}>
                      {product.status === 'critical' ? 'Crítico' : 'Bajo'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Gestionar Inventario
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagos Pendientes
              </CardTitle>
              <CardDescription>
                Cuentas por cobrar próximas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPayments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {payment.client}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vence: {payment.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{payment.amount}</p>
                      {payment.overdue && (
                        <p className="text-xs text-red-600">Vencido</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Cuentas Corrientes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ventas Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$3,240</div>
            <p className="text-xs text-muted-foreground">12 transacciones</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Productos Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground">unidades hoy</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nuevos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground">esta semana</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;