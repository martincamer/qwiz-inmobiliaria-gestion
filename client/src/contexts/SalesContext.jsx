import { createContext, useContext, useReducer, useEffect } from "react";
import clientAxios from "../lib/axios";

// Estado inicial
const initialState = {
  sales: [],
  currentSale: null,
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
    property: "",
    prospect: "",
    owner: "",
    startDate: "",
    endDate: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  stats: {
    totalSales: 0,
    totalRevenue: 0,
    statusBreakdown: [],
    overdueSales: 0,
    recentSales: [],
  },
};

// Tipos de acciones
const SALES_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_SALES: "SET_SALES",
  SET_CURRENT_SALE: "SET_CURRENT_SALE",
  ADD_SALE: "ADD_SALE",
  UPDATE_SALE: "UPDATE_SALE",
  DELETE_SALE: "DELETE_SALE",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  SET_STATS: "SET_STATS",
  CLEAR_CURRENT_SALE: "CLEAR_CURRENT_SALE",
  UPDATE_SALE_STATUS: "UPDATE_SALE_STATUS",
  ADD_DOCUMENT: "ADD_DOCUMENT",
  REMOVE_DOCUMENT: "REMOVE_DOCUMENT",
};

// Reducer
const salesReducer = (state, action) => {
  switch (action.type) {
    case SALES_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case SALES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case SALES_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case SALES_ACTIONS.SET_SALES:
      return {
        ...state,
        sales: action.payload,
        isLoading: false,
        error: null,
      };

    case SALES_ACTIONS.SET_CURRENT_SALE:
      return {
        ...state,
        currentSale: action.payload,
        isLoading: false,
        error: null,
      };

    case SALES_ACTIONS.ADD_SALE:
      return {
        ...state,
        sales: [action.payload, ...state.sales],
        isLoading: false,
        error: null,
      };

    case SALES_ACTIONS.UPDATE_SALE:
      return {
        ...state,
        sales: state.sales.map((sale) =>
          sale._id === action.payload._id ? action.payload : sale
        ),
        currentSale:
          state.currentSale?._id === action.payload._id
            ? action.payload
            : state.currentSale,
        isLoading: false,
        error: null,
      };

    case SALES_ACTIONS.DELETE_SALE:
      return {
        ...state,
        sales: state.sales.filter((sale) => sale._id !== action.payload),
        currentSale:
          state.currentSale?._id === action.payload ? null : state.currentSale,
        isLoading: false,
        error: null,
      };

    case SALES_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case SALES_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case SALES_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload,
      };

    case SALES_ACTIONS.CLEAR_CURRENT_SALE:
      return {
        ...state,
        currentSale: null,
      };

    case SALES_ACTIONS.UPDATE_SALE_STATUS:
      return {
        ...state,
        sales: state.sales.map((sale) =>
          sale._id === action.payload.id
            ? { ...sale, status: action.payload.status }
            : sale
        ),
        currentSale:
          state.currentSale?._id === action.payload.id
            ? { ...state.currentSale, status: action.payload.status }
            : state.currentSale,
      };

    case SALES_ACTIONS.ADD_DOCUMENT:
      return {
        ...state,
        currentSale: state.currentSale
          ? {
              ...state.currentSale,
              documents: {
                ...state.currentSale.documents,
                [action.payload.category]: [
                  ...(state.currentSale.documents[action.payload.category] || []),
                  action.payload.document,
                ],
              },
            }
          : null,
      };

    case SALES_ACTIONS.REMOVE_DOCUMENT:
      return {
        ...state,
        currentSale: state.currentSale
          ? {
              ...state.currentSale,
              documents: {
                ...state.currentSale.documents,
                [action.payload.category]: state.currentSale.documents[
                  action.payload.category
                ].filter((doc) => doc._id !== action.payload.documentId),
              },
            }
          : null,
      };

    default:
      return state;
  }
};

// Crear contexto
const SalesContext = createContext();

// Hook personalizado para usar el contexto
export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("useSales debe ser usado dentro de un SalesProvider");
  }
  return context;
};

// Provider del contexto
export const SalesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(salesReducer, initialState);

  // Función para obtener todas las ventas
  const getSales = async (filters = {}) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

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

      const response = await clientAxios.get(`/ventas?${params.toString()}`);

      dispatch({
        type: SALES_ACTIONS.SET_SALES,
        payload: response.data.data,
      });
      dispatch({
        type: SALES_ACTIONS.SET_PAGINATION,
        payload: response.data.pagination,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener ventas";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener una venta por ID
  const getSaleById = async (id) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get(`/ventas/${id}`);

      dispatch({
        type: SALES_ACTIONS.SET_CURRENT_SALE,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener venta";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para crear una nueva venta
  const createSale = async (saleData) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      console.log("🚀 Enviando datos de venta al servidor:", saleData);
      const response = await clientAxios.post("/ventas", saleData);

      dispatch({
        type: SALES_ACTIONS.ADD_SALE,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error("❌ Error en createSale:", error);

      let errorMessage = "Error al crear venta";
      let errorDetails = null;

      if (error.response?.data) {
        const serverError = error.response.data;

        if (serverError.message) {
          errorMessage = serverError.message;
        }

        if (serverError.errors && Array.isArray(serverError.errors)) {
          errorDetails = serverError.errors;
          errorMessage = "Errores de validación encontrados";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión con el servidor";
      } else {
        errorMessage = error.message || "Error inesperado";
      }

      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });

      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
        statusCode: error.response?.status,
      };
    }
  };

  // Función para actualizar una venta
  const updateSale = async (id, saleData) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.put(`/ventas/${id}`, saleData);

      dispatch({
        type: SALES_ACTIONS.UPDATE_SALE,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar venta";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar el estado de una venta
  const updateSaleStatus = async (id, status, reason = "") => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.patch(`/ventas/${id}/estado`, {
        status,
        reason,
      });

      dispatch({
        type: SALES_ACTIONS.UPDATE_SALE_STATUS,
        payload: { id, status },
      });

      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar estado de venta";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar una venta
  const deleteSale = async (id) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      await clientAxios.delete(`/ventas/${id}`);

      dispatch({ type: SALES_ACTIONS.DELETE_SALE, payload: id });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar venta";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para agregar documento a una venta
  const addDocument = async (saleId, category, documentData) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(`/ventas/${saleId}/documentos`, {
        category,
        ...documentData,
      });

      dispatch({
        type: SALES_ACTIONS.ADD_DOCUMENT,
        payload: {
          category,
          document: response.data.data.document,
        },
      });

      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al agregar documento";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar documento de una venta
  const removeDocument = async (saleId, category, documentId) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      await clientAxios.delete(
        `/ventas/${saleId}/documentos/${category}/${documentId}`
      );

      dispatch({
        type: SALES_ACTIONS.REMOVE_DOCUMENT,
        payload: { category, documentId },
      });

      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: false });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar documento";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener estadísticas de ventas
  const getSalesStats = async (startDate = null, endDate = null) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await clientAxios.get(
        `/ventas/estadisticas?${params.toString()}`
      );

      dispatch({
        type: SALES_ACTIONS.SET_STATS,
        payload: response.data.data,
      });

      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener estadísticas";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener ventas vencidas
  const getOverdueSales = async () => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get("/ventas/vencidas");

      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener ventas vencidas";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para buscar ventas similares
  const findSimilarSales = async (filters) => {
    try {
      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: true });

      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await clientAxios.get(
        `/ventas/similares?${params.toString()}`
      );

      dispatch({ type: SALES_ACTIONS.SET_LOADING, payload: false });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al buscar ventas similares";
      dispatch({ type: SALES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar filtros
  const updateFilters = (newFilters) => {
    dispatch({ type: SALES_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Función para actualizar paginación
  const updatePagination = (newPagination) => {
    dispatch({
      type: SALES_ACTIONS.SET_PAGINATION,
      payload: newPagination,
    });
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: SALES_ACTIONS.CLEAR_ERROR });
  };

  // Función para limpiar venta actual
  const clearCurrentSale = () => {
    dispatch({ type: SALES_ACTIONS.CLEAR_CURRENT_SALE });
  };

  // Cargar ventas al montar el componente
  useEffect(() => {
    getSales();
  }, []);

  // Valor del contexto
  const value = {
    // Estado
    sales: state.sales,
    currentSale: state.currentSale,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    stats: state.stats,

    // Funciones
    getSales,
    getSaleById,
    createSale,
    updateSale,
    updateSaleStatus,
    deleteSale,
    addDocument,
    removeDocument,
    getSalesStats,
    getOverdueSales,
    findSimilarSales,
    updateFilters,
    updatePagination,
    clearError,
    clearCurrentSale,
  };

  return (
    <SalesContext.Provider value={value}>{children}</SalesContext.Provider>
  );
};

export default SalesContext;