import { createContext, useContext, useReducer, useEffect } from "react";
import clientAxios from "../lib/axios";

// Estado inicial
const initialState = {
  properties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {
    search: "",
    status: "",
    type: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

// Tipos de acciones
const PROPERTIES_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_PROPERTIES: "SET_PROPERTIES",
  SET_CURRENT_PROPERTY: "SET_CURRENT_PROPERTY",
  ADD_PROPERTY: "ADD_PROPERTY",
  UPDATE_PROPERTY: "UPDATE_PROPERTY",
  DELETE_PROPERTY: "DELETE_PROPERTY",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_CURRENT_PROPERTY: "CLEAR_CURRENT_PROPERTY",
};

// Reducer
const propertiesReducer = (state, action) => {
  switch (action.type) {
    case PROPERTIES_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case PROPERTIES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case PROPERTIES_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case PROPERTIES_ACTIONS.SET_PROPERTIES:
      return {
        ...state,
        properties: action.payload,
        isLoading: false,
        error: null,
      };

    case PROPERTIES_ACTIONS.SET_CURRENT_PROPERTY:
      return {
        ...state,
        currentProperty: action.payload,
        isLoading: false,
        error: null,
      };

    case PROPERTIES_ACTIONS.ADD_PROPERTY:
      return {
        ...state,
        properties: [action.payload, ...state.properties],
        isLoading: false,
        error: null,
      };

    case PROPERTIES_ACTIONS.UPDATE_PROPERTY:
      return {
        ...state,
        properties: state.properties.map((property) =>
          property._id === action.payload._id ? action.payload : property
        ),
        currentProperty:
          state.currentProperty?._id === action.payload._id
            ? action.payload
            : state.currentProperty,
        isLoading: false,
        error: null,
      };

    case PROPERTIES_ACTIONS.DELETE_PROPERTY:
      return {
        ...state,
        properties: state.properties.filter(
          (property) => property._id !== action.payload
        ),
        currentProperty:
          state.currentProperty?._id === action.payload
            ? null
            : state.currentProperty,
        isLoading: false,
        error: null,
      };

    case PROPERTIES_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case PROPERTIES_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case PROPERTIES_ACTIONS.CLEAR_CURRENT_PROPERTY:
      return {
        ...state,
        currentProperty: null,
      };

    default:
      return state;
  }
};

// Crear contexto
const PropertiesContext = createContext();

// Hook personalizado para usar el contexto
export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error(
      "useProperties debe ser usado dentro de un PropertiesProvider"
    );
  }
  return context;
};

// Provider del contexto
export const PropertiesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(propertiesReducer, initialState);

  // Función para obtener todas las propiedades
  const getProperties = async (filters = {}) => {
    try {
      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: true });

      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== "" &&
          filters[key] !== null &&
          filters[key] !== undefined
        ) {
          params.append(key, filters[key]);
        }
      });

      const response = await clientAxios.get(
        `/propiedades?${params.toString()}`
      );

      dispatch({
        type: PROPERTIES_ACTIONS.SET_PROPERTIES,
        payload: response.data.data,
      });
      dispatch({
        type: PROPERTIES_ACTIONS.SET_PAGINATION,
        payload: response.data.pagination,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener propiedades";
      dispatch({ type: PROPERTIES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener una propiedad por ID
  const getPropertyById = async (id) => {
    try {
      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get(`/propiedades/${id}`);

      dispatch({
        type: PROPERTIES_ACTIONS.SET_CURRENT_PROPERTY,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener propiedad";
      dispatch({ type: PROPERTIES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para crear una nueva propiedad
  const createProperty = async (propertyData) => {
    try {
      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: true });

      console.log("🚀 Enviando datos al servidor:", propertyData);
      const response = await clientAxios.post("/propiedades", propertyData);

      dispatch({
        type: PROPERTIES_ACTIONS.ADD_PROPERTY,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error("❌ Error en createProperty:", error);

      let errorMessage = "Error al crear propiedad";
      let errorDetails = null;

      // Extraer información detallada del error
      if (error.response?.data) {
        const serverError = error.response.data;

        // Si hay un mensaje específico del servidor
        if (serverError.message) {
          errorMessage = serverError.message;
        }

        // Si hay errores de validación específicos
        if (serverError.errors && Array.isArray(serverError.errors)) {
          errorDetails = serverError.errors;
          errorMessage = "Errores de validación encontrados";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión con el servidor";
      } else {
        errorMessage = error.message || "Error inesperado";
      }

      dispatch({ type: PROPERTIES_ACTIONS.SET_ERROR, payload: errorMessage });

      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
        statusCode: error.response?.status,
      };
    }
  };

  // Función para actualizar una propiedad
  const updateProperty = async (id, propertyData) => {
    try {
      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.put(
        `/propiedades/${id}`,
        propertyData
      );

      dispatch({
        type: PROPERTIES_ACTIONS.UPDATE_PROPERTY,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar propiedad";
      dispatch({ type: PROPERTIES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar una propiedad
  const deleteProperty = async (id) => {
    try {
      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: true });

      await clientAxios.delete(`/propiedades/${id}`);

      dispatch({ type: PROPERTIES_ACTIONS.DELETE_PROPERTY, payload: id });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar propiedad";
      dispatch({ type: PROPERTIES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener propiedades similares
  const getSimilarProperties = async (id, limit = 5) => {
    try {
      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get(
        `/propiedades/${id}/similares?limit=${limit}`
      );

      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error al obtener propiedades similares";
      dispatch({ type: PROPERTIES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener estadísticas de propiedades
  const getPropertiesStats = async () => {
    try {
      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get("/propiedades/estadisticas");

      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener estadísticas";
      dispatch({ type: PROPERTIES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para incrementar vistas de una propiedad
  const incrementPropertyViews = async (id) => {
    try {
      const response = await clientAxios.patch(`/propiedades/${id}/vistas`);
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al incrementar vistas";
      return { success: false, error: errorMessage };
    }
  };

  // Función para alternar favorito de una propiedad
  const togglePropertyFavorite = async (id, increment = true) => {
    try {
      const response = await clientAxios.patch(`/propiedades/${id}/favorito`, {
        increment,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al alternar favorito";
      return { success: false, error: errorMessage };
    }
  };

  // Función para búsqueda avanzada
  const advancedSearch = async (searchFilters) => {
    try {
      dispatch({ type: PROPERTIES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(
        "/propiedades/busqueda-avanzada",
        searchFilters
      );

      dispatch({
        type: PROPERTIES_ACTIONS.SET_PROPERTIES,
        payload: response.data.data,
      });
      dispatch({
        type: PROPERTIES_ACTIONS.SET_PAGINATION,
        payload: response.data.pagination,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error en búsqueda avanzada";
      dispatch({ type: PROPERTIES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar filtros
  const updateFilters = (newFilters) => {
    dispatch({ type: PROPERTIES_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Función para actualizar paginación
  const updatePagination = (newPagination) => {
    dispatch({
      type: PROPERTIES_ACTIONS.SET_PAGINATION,
      payload: newPagination,
    });
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: PROPERTIES_ACTIONS.CLEAR_ERROR });
  };

  // Función para limpiar propiedad actual
  const clearCurrentProperty = () => {
    dispatch({ type: PROPERTIES_ACTIONS.CLEAR_CURRENT_PROPERTY });
  };

  // Cargar propiedades al montar el componente
  useEffect(() => {
    getProperties();
  }, []);

  // Valor del contexto
  const value = {
    // Estado
    properties: state.properties,
    currentProperty: state.currentProperty,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Funciones
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getSimilarProperties,
    getPropertiesStats,
    incrementPropertyViews,
    togglePropertyFavorite,
    advancedSearch,
    updateFilters,
    updatePagination,
    clearError,
    clearCurrentProperty,
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
};

export default PropertiesContext;
