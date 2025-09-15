import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mapeo de rutas a títulos
const routeTitles = {
  "/": "Inicio - Qwiz Inmobliairia",
  "/login": "Iniciar Sesión - Qwiz Inmobliairia",
  "/register": "Registrarse - Qwiz Inmobliairia",
};

// Hook personalizado para manejar el título del documento
export const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    // Obtener el título basado en la ruta actual
    const title = routeTitles[location.pathname] || "Qwiz Gestión";

    // Actualizar el título del documento
    document.title = title;
  }, [location.pathname]);
};

export default useDocumentTitle;
