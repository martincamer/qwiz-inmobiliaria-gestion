import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { OwnersProvider } from "./contexts/OwnersContext";
import { PropertiesProvider } from "./contexts/PropertiesContext";
import { ProspectsProvider } from "./contexts/ProspectsContext";
import { SalesProvider } from "./contexts/SalesContext";
import { TenantsProvider } from "./contexts/TenantsContext";

// Hooks
import useDocumentTitle from "./hooks/useDocumentTitle";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

// Pages
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Dashboard from "./pages/private/Dashboard";
import Owners from "./pages/private/Owners";
import Properties from "./pages/private/Properties";
import Prospects from "./pages/private/Prospects";
import Sales from "./pages/private/Sales";
import Tenants from "./pages/private/Tenants";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 border-t-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Componente principal de rutas
const AppRoutes = () => {
  useDocumentTitle();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <PublicLayout />
          </PublicRoute>
        }
      >
        <Route index element={<Home />} />
      </Route>

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Private Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PrivateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="propietarios" element={<Owners />} />
        <Route path="propiedades" element={<Properties />} />
        <Route path="prospectos" element={<Prospects />} />
        <Route path="ventas" element={<Sales />} />
        <Route path="inquilinos" element={<Tenants />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Componente principal de la aplicación
function App() {
  return (
    <AuthProvider>
      <OwnersProvider>
        <PropertiesProvider>
          <ProspectsProvider>
            <SalesProvider>
              <TenantsProvider>
                <Router>
                  <div className="App">
                    <AppRoutes />
                    <Toaster
                      position="top-right"
                      richColors
                      closeButton
                      duration={4000}
                    />
                  </div>
                </Router>
              </TenantsProvider>
            </SalesProvider>
          </ProspectsProvider>
        </PropertiesProvider>
      </OwnersProvider>
    </AuthProvider>
  );
}

export default App;
