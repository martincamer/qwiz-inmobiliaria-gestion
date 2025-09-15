import { createContext, useContext, useReducer, useEffect } from "react";
import clientAxios from "../lib/axios";

// Estado inicial
const initialState = {
  cashBoxes: [],
  currentCashBox: null,
  movements: [],
  summary: null,
  generalSummary: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

// Tipos de acciones
const CASHBOX_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_CASHBOXES: "SET_CASHBOXES",
  SET_CURRENT_CASHBOX: "SET_CURRENT_CASHBOX",
  ADD_CASHBOX: "ADD_CASHBOX",
  UPDATE_CASHBOX: "UPDATE_CASHBOX",
  DELETE_CASHBOX: "DELETE_CASHBOX",
  SET_MOVEMENTS: "SET_MOVEMENTS",
  ADD_MOVEMENT: "ADD_MOVEMENT",
  SET_SUMMARY: "SET_SUMMARY",
  SET_GENERAL_SUMMARY: "SET_GENERAL_SUMMARY",
  SET_PAGINATION: "SET_PAGINATION",
};

// Reducer
const cashBoxReducer = (state, action) => {
  switch (action.type) {
    case CASHBOX_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case CASHBOX_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CASHBOX_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case CASHBOX_ACTIONS.SET_CASHBOXES:
      return {
        ...state,
        cashBoxes: action.payload.cashBoxes,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.SET_CURRENT_CASHBOX:
      return {
        ...state,
        currentCashBox: action.payload,
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.ADD_CASHBOX:
      return {
        ...state,
        cashBoxes: [action.payload, ...state.cashBoxes],
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.UPDATE_CASHBOX:
      return {
        ...state,
        cashBoxes: state.cashBoxes.map(cashBox =>
          cashBox._id === action.payload._id ? action.payload : cashBox
        ),
        currentCashBox: state.currentCashBox?._id === action.payload._id 
          ? action.payload 
          : state.currentCashBox,
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.DELETE_CASHBOX:
      return {
        ...state,
        cashBoxes: state.cashBoxes.filter(cashBox => cashBox._id !== action.payload),
        currentCashBox: state.currentCashBox?._id === action.payload 
          ? null 
          : state.currentCashBox,
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.SET_MOVEMENTS:
      return {
        ...state,
        movements: action.payload.movements,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalMovements,
          hasNextPage: action.payload.hasNextPage,
          hasPrevPage: action.payload.hasPrevPage,
        },
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.ADD_MOVEMENT:
      return {
        ...state,
        movements: [action.payload.movement, ...state.movements],
        currentCashBox: state.currentCashBox ? {
          ...state.currentCashBox,
          currentBalance: action.payload.currentBalance,
          previousBalance: action.payload.previousBalance,
        } : null,
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.SET_SUMMARY:
      return {
        ...state,
        summary: action.payload,
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.SET_GENERAL_SUMMARY:
      return {
        ...state,
        generalSummary: action.payload,
        isLoading: false,
        error: null,
      };

    case CASHBOX_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    default:
      return state;
  }
};

// Crear contexto
const CashBoxContext = createContext();

// Hook personalizado para usar el contexto
export const useCashBox = () => {
  const context = useContext(CashBoxContext);
  if (!context) {
    throw new Error("useCashBox debe ser usado dentro de un CashBoxProvider");
  }
  return context;
};

// Provider del contexto
export const CashBoxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cashBoxReducer, initialState);

  // Función para manejar errores
  const handleError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
    dispatch({ type: CASHBOX_ACTIONS.SET_ERROR, payload: errorMessage });
    return errorMessage;
  };

  // Función para obtener todas las cajas
  const getCashBoxes = async (params = {}) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
      if (params.search) queryParams.append('search', params.search);

      const response = await clientAxios.get(`/cashboxes?${queryParams.toString()}`);
      
      dispatch({
        type: CASHBOX_ACTIONS.SET_CASHBOXES,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener una caja por ID
  const getCashBoxById = async (id) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.get(`/cashboxes/${id}`);
      
      dispatch({
        type: CASHBOX_ACTIONS.SET_CURRENT_CASHBOX,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para crear una nueva caja
  const createCashBox = async (cashBoxData) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.post('/cashboxes', cashBoxData);
      
      dispatch({
        type: CASHBOX_ACTIONS.ADD_CASHBOX,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar una caja
  const updateCashBox = async (id, cashBoxData) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.put(`/cashboxes/${id}`, cashBoxData);
      
      dispatch({
        type: CASHBOX_ACTIONS.UPDATE_CASHBOX,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar (desactivar) una caja
  const deleteCashBox = async (id) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.delete(`/cashboxes/${id}`);
      
      dispatch({
        type: CASHBOX_ACTIONS.DELETE_CASHBOX,
        payload: id,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para agregar un movimiento
  const addMovement = async (cashBoxId, movementData) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.post(`/cashboxes/${cashBoxId}/movements`, movementData);
      
      dispatch({
        type: CASHBOX_ACTIONS.ADD_MOVEMENT,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener movimientos de una caja
  const getMovements = async (cashBoxId, params = {}) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params.category) queryParams.append('category', params.category);

      const response = await clientAxios.get(`/cashboxes/${cashBoxId}/movements?${queryParams.toString()}`);
      
      dispatch({
        type: CASHBOX_ACTIONS.SET_MOVEMENTS,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener resumen de una caja
  const getCashBoxSummary = async (cashBoxId, params = {}) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);

      const response = await clientAxios.get(`/cashboxes/${cashBoxId}/summary?${queryParams.toString()}`);
      
      dispatch({
        type: CASHBOX_ACTIONS.SET_SUMMARY,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener resumen general
  const getGeneralSummary = async (params = {}) => {
    try {
      dispatch({ type: CASHBOX_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);

      const response = await clientAxios.get(`/cashboxes/summary?${queryParams.toString()}`);
      
      dispatch({
        type: CASHBOX_ACTIONS.SET_GENERAL_SUMMARY,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: CASHBOX_ACTIONS.CLEAR_ERROR });
  };

  // Función para limpiar estado
  const clearState = () => {
    dispatch({ type: CASHBOX_ACTIONS.SET_CASHBOXES, payload: { cashBoxes: [], pagination: initialState.pagination } });
    dispatch({ type: CASHBOX_ACTIONS.SET_CURRENT_CASHBOX, payload: null });
    dispatch({ type: CASHBOX_ACTIONS.SET_MOVEMENTS, payload: { movements: [], ...initialState.pagination } });
    dispatch({ type: CASHBOX_ACTIONS.SET_SUMMARY, payload: null });
    dispatch({ type: CASHBOX_ACTIONS.SET_GENERAL_SUMMARY, payload: null });
  };

  // Función para establecer caja actual
  const setCurrentCashBox = (cashBox) => {
    dispatch({ type: CASHBOX_ACTIONS.SET_CURRENT_CASHBOX, payload: cashBox });
  };

  // Valor del contexto
  const value = {
    // Estado
    cashBoxes: state.cashBoxes,
    currentCashBox: state.currentCashBox,
    movements: state.movements,
    summary: state.summary,
    generalSummary: state.generalSummary,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,

    // Funciones
    getCashBoxes,
    getCashBoxById,
    createCashBox,
    updateCashBox,
    deleteCashBox,
    addMovement,
    getMovements,
    getCashBoxSummary,
    getGeneralSummary,
    clearError,
    clearState,
    setCurrentCashBox,
  };

  return (
    <CashBoxContext.Provider value={value}>
      {children}
    </CashBoxContext.Provider>
  );
};

export default CashBoxContext;