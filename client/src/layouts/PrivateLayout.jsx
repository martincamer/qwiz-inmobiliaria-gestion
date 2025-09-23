import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
  Home,
  UserCheck,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const PrivateLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Propietarios", href: "/dashboard/propietarios", icon: Users },
    { name: "Propiedades", href: "/dashboard/propiedades", icon: Home },
    { name: "Inquilinos", href: "/dashboard/inquilinos", icon: UserPlus },
    { name: "Prospectos", href: "/dashboard/prospectos", icon: UserCheck },
    { name: "Ventas", href: "/dashboard/ventas", icon: ShoppingCart },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 bg-card border-r transform transition-all duration-300 ease-in-out
        lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${isSidebarCollapsed ? "lg:w-16" : "lg:w-64"}
        w-64
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={`flex items-center h-16 border-b ${
              isSidebarCollapsed
                ? "justify-center px-2"
                : "justify-between px-6"
            }`}
          >
            {!isSidebarCollapsed && (
              <Link
                to="/dashboard"
                className="flex items-center justify-center space-x-2"
              >
                <img src={logo} alt="logo" className="h-8 w-auto" />
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <button
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
              {/* Toggle button for desktop */}
              <button
                className="hidden lg:block hover:bg-muted p-1 rounded"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className={`flex-1 py-6 space-y-2 ${
              isSidebarCollapsed ? "px-2" : "px-4"
            }`}
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center rounded-lg text-sm font-medium transition-colors
                    ${
                      isSidebarCollapsed
                        ? "justify-center px-3 py-3"
                        : "space-x-3 px-3 py-2"
                    }
                    ${
                      isActive
                        ? "bg-secondary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                  title={isSidebarCollapsed ? item.name : ""}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div
            className={`py-4 border-t ${isSidebarCollapsed ? "px-2" : "px-6"}`}
          >
            {!isSidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "usuario@ejemplo.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        {/* Top bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            {/* Aquí puedes agregar notificaciones, búsqueda, etc. */}
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
