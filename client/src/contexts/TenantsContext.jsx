import { createContext, useContext, useReducer, useEffect } from "react";
import clientAxios from "../lib/axios";

// Estado inicial
const initialState = {
  tenants: [],
  currentTenant: null,
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
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

// Tipos de acciones
const TENANTS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_TENANTS: "SET_TENANTS",
  SET_CURRENT_TENANT: "SET_CURRENT_TENANT",
  ADD_TENANT: "ADD_TENANT",
  UPDATE_TENANT: "UPDATE_TENANT",
  DELETE_TENANT: "DELETE_TENANT",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_CURRENT_TENANT: "CLEAR_CURRENT_TENANT",
};

// Reducer
const tenantsReducer = (state, action) => {
  switch (action.type) {
    case TENANTS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case TENANTS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case TENANTS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case TENANTS_ACTIONS.SET_TENANTS:
      return {
        ...state,
        tenants: action.payload,
        isLoading: false,
        error: null,
      };

    case TENANTS_ACTIONS.SET_CURRENT_TENANT:
      return {
        ...state,
        currentTenant: action.payload,
        isLoading: false,
        error: null,
      };

    case TENANTS_ACTIONS.ADD_TENANT:
      return {
        ...state,
        tenants: [action.payload, ...state.tenants],
        isLoading: false,
        error: null,
      };

    case TENANTS_ACTIONS.UPDATE_TENANT:
      return {
        ...state,
        tenants: state.tenants.map((tenant) =>
          tenant._id === action.payload._id ? action.payload : tenant
        ),
        currentTenant:
          state.currentTenant?._id === action.payload._id
            ? action.payload
            : state.currentTenant,
        isLoading: false,
        error: null,
      };

    case TENANTS_ACTIONS.DELETE_TENANT:
      return {
        ...state,
        tenants: state.tenants.filter((tenant) => tenant._id !== action.payload),
        currentTenant:
          state.currentTenant?._id === action.payload
            ? null
            : state.currentTenant,
        isLoading: false,
        error: null,
      };

    case TENANTS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case TENANTS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case TENANTS_ACTIONS.CLEAR_CURRENT_TENANT:
      return {
        ...state,
        currentTenant: null,
      };

    default:
      return state;
  }
};

// Crear contexto
const TenantsContext = createContext();

// Hook personalizado para usar el contexto
export const useTenants = () => {
  const context = useContext(TenantsContext);
  if (!context) {
    throw new Error("useTenants debe ser usado dentro de un TenantsProvider");
  }
  return context;
};

// Provider del contexto
export const TenantsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tenantsReducer, initialState);

  // Función para obtener todos los inquilinos
  const getTenants = async (filters = {}) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

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

      const response = await clientAxios.get(`/inquilinos?${params.toString()}`);

      dispatch({
        type: TENANTS_ACTIONS.SET_TENANTS,
        payload: response.data.datos.inquilinos,
      });
      dispatch({
        type: TENANTS_ACTIONS.SET_PAGINATION,
        payload: {
          currentPage: response.data.datos.paginacion.paginaActual,
          totalPages: response.data.datos.paginacion.totalPaginas,
          totalItems: response.data.datos.paginacion.totalInquilinos,
          itemsPerPage: response.data.datos.paginacion.limite,
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al obtener inquilinos";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener un inquilino por ID
  const getTenantById = async (id) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get(`/inquilinos/${id}`);

      dispatch({
        type: TENANTS_ACTIONS.SET_CURRENT_TENANT,
        payload: response.data.datos.inquilino,
      });

      return { success: true, data: response.data.datos };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al obtener inquilino";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para crear un nuevo inquilino
  const createTenant = async (tenantData) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      console.log("🚀 Enviando datos del inquilino al servidor:", tenantData);
      const response = await clientAxios.post("/inquilinos", tenantData);

      dispatch({ 
        type: TENANTS_ACTIONS.ADD_TENANT, 
        payload: response.data.datos.inquilino 
      });

      return { success: true, data: response.data.datos.inquilino };
    } catch (error) {
      console.error("❌ Error en createTenant:", error);

      let errorMessage = "Error al crear inquilino";
      let errorDetails = null;

      if (error.response?.data) {
        const serverError = error.response.data;

        if (serverError.mensaje) {
          errorMessage = serverError.mensaje;
        }

        if (serverError.errors && Array.isArray(serverError.errors)) {
          errorDetails = serverError.errors;
          errorMessage = "Errores de validación encontrados";
        }

        if (serverError.duplicateField) {
          if (serverError.duplicateField === "email") {
            errorMessage = "Ya existe un inquilino con este email";
          } else if (serverError.duplicateField === "idNumber") {
            errorMessage = "Ya existe un inquilino con este número de documento";
          }
        }
      } else if (error.request) {
        errorMessage = "Error de conexión con el servidor";
      } else {
        errorMessage = error.message || "Error inesperado";
      }

      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });

      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
        statusCode: error.response?.status,
      };
    }
  };

  // Función para actualizar un inquilino
  const updateTenant = async (id, tenantData) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.put(`/inquilinos/${id}`, tenantData);

      dispatch({
        type: TENANTS_ACTIONS.UPDATE_TENANT,
        payload: response.data.datos.inquilino,
      });

      return { success: true, data: response.data.datos.inquilino };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al actualizar inquilino";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar un inquilino
  const deleteTenant = async (id) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      await clientAxios.delete(`/inquilinos/${id}`);

      dispatch({ type: TENANTS_ACTIONS.DELETE_TENANT, payload: id });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al eliminar inquilino";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para agregar pago a un inquilino
  const addPayment = async (tenantId, paymentData) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(
        `/inquilinos/${tenantId}/pagos`,
        paymentData
      );

      // Actualizar el inquilino en el estado
      const updatedTenant = state.tenants.find(t => t._id === tenantId);
      if (updatedTenant) {
        updatedTenant.paymentHistory = response.data.datos.historialPagos;
        dispatch({
          type: TENANTS_ACTIONS.UPDATE_TENANT,
          payload: updatedTenant,
        });
      }

      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.datos };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al agregar pago";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para marcar pago como pagado
  const markPaymentAsPaid = async (tenantId, paymentId, paymentData = {}) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.put(
        `/inquilinos/${tenantId}/pagos/${paymentId}/pagar`,
        paymentData
      );

      // Actualizar el inquilino en el estado
      const updatedTenant = state.tenants.find(t => t._id === tenantId);
      if (updatedTenant) {
        const paymentIndex = updatedTenant.paymentHistory.findIndex(
          p => p._id === paymentId
        );
        if (paymentIndex !== -1) {
          updatedTenant.paymentHistory[paymentIndex] = response.data.datos.pago;
        }
        dispatch({
          type: TENANTS_ACTIONS.UPDATE_TENANT,
          payload: updatedTenant,
        });
      }

      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.datos };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al marcar pago como pagado";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener historial de pagos
  const getPaymentHistory = async (tenantId, filters = {}) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

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
        `/inquilinos/${tenantId}/pagos?${params.toString()}`
      );

      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.datos };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al obtener historial de pagos";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para generar pagos mensuales
  const generateMonthlyPayments = async (tenantId, months = 12) => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(
        `/inquilinos/${tenantId}/generar-pagos`,
        { meses: months }
      );

      // Actualizar el inquilino en el estado
      const updatedTenant = state.tenants.find(t => t._id === tenantId);
      if (updatedTenant) {
        // Recargar el inquilino para obtener los nuevos pagos
        await getTenantById(tenantId);
      }

      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.datos };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al generar pagos mensuales";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener inquilinos con pagos vencidos
  const getTenantsWithOverduePayments = async () => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get("/inquilinos/pagos-vencidos");

      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.datos };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al obtener inquilinos con pagos vencidos";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener estadísticas de inquilinos
  const getTenantsStats = async () => {
    try {
      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get("/inquilinos/estadisticas");

      dispatch({ type: TENANTS_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.datos };
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensaje || "Error al obtener estadísticas";
      dispatch({ type: TENANTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar filtros
  const updateFilters = (newFilters) => {
    dispatch({ type: TENANTS_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Función para actualizar paginación
  const updatePagination = (newPagination) => {
    dispatch({ type: TENANTS_ACTIONS.SET_PAGINATION, payload: newPagination });
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: TENANTS_ACTIONS.CLEAR_ERROR });
  };

  // Función para limpiar inquilino actual
  const clearCurrentTenant = () => {
    dispatch({ type: TENANTS_ACTIONS.CLEAR_CURRENT_TENANT });
  };

  // Cargar inquilinos al montar el componente
  useEffect(() => {
    getTenants();
  }, []);

  // Valor del contexto
  const value = {
    // Estado
    tenants: state.tenants,
    currentTenant: state.currentTenant,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Funciones
    getTenants,
    getTenantById,
    createTenant,
    updateTenant,
    deleteTenant,
    addPayment,
    markPaymentAsPaid,
    getPaymentHistory,
    generateMonthlyPayments,
    getTenantsWithOverduePayments,
    getTenantsStats,
    updateFilters,
    updatePagination,
    clearError,
    clearCurrentTenant,
  };

  return (
    <TenantsContext.Provider value={value}>{children}</TenantsContext.Provider>
  );
};

export default TenantsContext;