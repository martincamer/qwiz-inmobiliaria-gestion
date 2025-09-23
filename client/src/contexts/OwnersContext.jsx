import { createContext, useContext, useReducer, useEffect } from "react";
import clientAxios from "../lib/axios";

// Estado inicial
const initialState = {
  owners: [],
  currentOwner: null,
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
    activo: "",
    tipoIdentificacion: "",
    sortBy: "fechaRegistro",
    sortOrder: "desc",
  },
};

// Tipos de acciones
const OWNERS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_OWNERS: "SET_OWNERS",
  SET_CURRENT_OWNER: "SET_CURRENT_OWNER",
  ADD_OWNER: "ADD_OWNER",
  UPDATE_OWNER: "UPDATE_OWNER",
  DELETE_OWNER: "DELETE_OWNER",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_CURRENT_OWNER: "CLEAR_CURRENT_OWNER",
};

// Reducer
const ownersReducer = (state, action) => {
  switch (action.type) {
    case OWNERS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case OWNERS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case OWNERS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case OWNERS_ACTIONS.SET_OWNERS:
      return {
        ...state,
        owners: action.payload,
        isLoading: false,
        error: null,
      };

    case OWNERS_ACTIONS.SET_CURRENT_OWNER:
      return {
        ...state,
        currentOwner: action.payload,
        isLoading: false,
        error: null,
      };

    case OWNERS_ACTIONS.ADD_OWNER:
      return {
        ...state,
        owners: [action.payload, ...state.owners],
        isLoading: false,
        error: null,
      };

    case OWNERS_ACTIONS.UPDATE_OWNER:
      return {
        ...state,
        owners: state.owners.map((owner) =>
          owner._id === action.payload._id ? action.payload : owner
        ),
        currentOwner:
          state.currentOwner?._id === action.payload._id
            ? action.payload
            : state.currentOwner,
        isLoading: false,
        error: null,
      };

    case OWNERS_ACTIONS.DELETE_OWNER:
      return {
        ...state,
        owners: state.owners.filter((owner) => owner._id !== action.payload),
        currentOwner:
          state.currentOwner?._id === action.payload
            ? null
            : state.currentOwner,
        isLoading: false,
        error: null,
      };

    case OWNERS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case OWNERS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case OWNERS_ACTIONS.CLEAR_CURRENT_OWNER:
      return {
        ...state,
        currentOwner: null,
      };

    default:
      return state;
  }
};

// Crear contexto
const OwnersContext = createContext();

// Hook personalizado para usar el contexto
export const useOwners = () => {
  const context = useContext(OwnersContext);
  if (!context) {
    throw new Error("useOwners debe ser usado dentro de un OwnersProvider");
  }
  return context;
};

// Provider del contexto
export const OwnersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ownersReducer, initialState);

  // Función para obtener todos los propietarios
  const getOwners = async () => {
    try {
      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get("/propietarios");

      dispatch({
        type: OWNERS_ACTIONS.SET_OWNERS,
        payload: response.data.data,
      });
      dispatch({
        type: OWNERS_ACTIONS.SET_PAGINATION,
        payload: response.data.pagination,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener propietarios";
      dispatch({ type: OWNERS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener un propietario por ID
  const getOwnerById = async (id) => {
    try {
      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get(`/propietarios/${id}`);

      dispatch({
        type: OWNERS_ACTIONS.SET_CURRENT_OWNER,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener propietario";
      dispatch({ type: OWNERS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para crear un nuevo propietario
  const createOwner = async (ownerData) => {
    try {
      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: true });

      console.log("🚀 Enviando datos al servidor:", ownerData);
      const response = await clientAxios.post("/propietarios", ownerData);

      dispatch({ type: OWNERS_ACTIONS.ADD_OWNER, payload: response.data.data });

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error("❌ Error en createOwner:", error);

      let errorMessage = "Error al crear propietario";
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

        // Si hay información sobre campo duplicado
        if (serverError.duplicateField) {
          if (serverError.duplicateField === "email") {
            errorMessage = "Ya existe un propietario con este email";
          } else if (serverError.duplicateField === "numeroIdentificacion") {
            errorMessage =
              "Ya existe un propietario con este número de identificación";
          }
        }
      } else if (error.request) {
        errorMessage = "Error de conexión con el servidor";
      } else {
        errorMessage = error.message || "Error inesperado";
      }

      dispatch({ type: OWNERS_ACTIONS.SET_ERROR, payload: errorMessage });

      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
        statusCode: error.response?.status,
      };
    }
  };

  // Función para actualizar un propietario
  const updateOwner = async (id, ownerData) => {
    try {
      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.put(`/propietarios/${id}`, ownerData);

      dispatch({
        type: OWNERS_ACTIONS.UPDATE_OWNER,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar propietario";
      dispatch({ type: OWNERS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar un propietario
  const deleteOwner = async (id) => {
    try {
      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: true });

      await clientAxios.delete(`/propietarios/${id}`);

      dispatch({ type: OWNERS_ACTIONS.DELETE_OWNER, payload: id });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar propietario";
      dispatch({ type: OWNERS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener inquilinos de un propietario
  const getOwnerTenants = async (id, filters = {}) => {
    try {
      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: true });

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
        `/propietarios/${id}/inquilinos?${params.toString()}`
      );

      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener inquilinos";
      dispatch({ type: OWNERS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener estadísticas de un propietario
  const getOwnerStats = async (id) => {
    try {
      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get(
        `/propietarios/${id}/estadisticas`
      );

      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener estadísticas";
      dispatch({ type: OWNERS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para cambiar contraseña
  const changeOwnerPassword = async (id, passwordData) => {
    try {
      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.put(
        `/propietarios/${id}/cambiar-password`,
        passwordData
      );

      dispatch({ type: OWNERS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al cambiar contraseña";
      dispatch({ type: OWNERS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar filtros
  const updateFilters = (newFilters) => {
    dispatch({ type: OWNERS_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Función para actualizar paginación
  const updatePagination = (newPagination) => {
    dispatch({ type: OWNERS_ACTIONS.SET_PAGINATION, payload: newPagination });
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: OWNERS_ACTIONS.CLEAR_ERROR });
  };

  // Función para limpiar propietario actual
  const clearCurrentOwner = () => {
    dispatch({ type: OWNERS_ACTIONS.CLEAR_CURRENT_OWNER });
  };

  // Cargar propietarios al montar el componente
  useEffect(() => {
    getOwners();
  }, []);

  // Valor del contexto
  const value = {
    // Estado
    owners: state.owners,
    currentOwner: state.currentOwner,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Funciones
    getOwners,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner,
    getOwnerTenants,
    getOwnerStats,
    changeOwnerPassword,
    updateFilters,
    updatePagination,
    clearError,
    clearCurrentOwner,
  };

  return (
    <OwnersContext.Provider value={value}>{children}</OwnersContext.Provider>
  );
};

export default OwnersContext;
