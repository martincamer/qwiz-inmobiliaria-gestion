import { createContext, useContext, useReducer, useEffect } from "react";
import clientAxios from "../lib/axios";

// Estado inicial
const initialState = {
  chequeras: [],
  currentChequera: null,
  cheques: [],
  resumen: null,
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
const CHEQUERA_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_CHEQUERAS: "SET_CHEQUERAS",
  SET_CURRENT_CHEQUERA: "SET_CURRENT_CHEQUERA",
  ADD_CHEQUERA: "ADD_CHEQUERA",
  UPDATE_CHEQUERA: "UPDATE_CHEQUERA",
  DELETE_CHEQUERA: "DELETE_CHEQUERA",
  SET_CHEQUES: "SET_CHEQUES",
  ADD_CHEQUE: "ADD_CHEQUE",
  UPDATE_CHEQUE: "UPDATE_CHEQUE",
  SET_RESUMEN: "SET_RESUMEN",
  SET_PAGINATION: "SET_PAGINATION",
};

// Reducer
const chequeraReducer = (state, action) => {
  switch (action.type) {
    case CHEQUERA_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case CHEQUERA_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CHEQUERA_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case CHEQUERA_ACTIONS.SET_CHEQUERAS:
      return {
        ...state,
        chequeras: action.payload.chequeras,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.SET_CURRENT_CHEQUERA:
      return {
        ...state,
        currentChequera: action.payload,
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.ADD_CHEQUERA:
      return {
        ...state,
        chequeras: [action.payload, ...state.chequeras],
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.UPDATE_CHEQUERA:
      return {
        ...state,
        chequeras: state.chequeras.map(chequera =>
          chequera._id === action.payload._id ? action.payload : chequera
        ),
        currentChequera: state.currentChequera?._id === action.payload._id 
          ? action.payload 
          : state.currentChequera,
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.DELETE_CHEQUERA:
      return {
        ...state,
        chequeras: state.chequeras.filter(chequera => chequera._id !== action.payload),
        currentChequera: state.currentChequera?._id === action.payload 
          ? null 
          : state.currentChequera,
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.SET_CHEQUES:
      return {
        ...state,
        cheques: action.payload.cheques,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          hasNextPage: action.payload.hasNextPage,
          hasPrevPage: action.payload.hasPrevPage,
        },
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.ADD_CHEQUE:
      return {
        ...state,
        cheques: [action.payload, ...state.cheques],
        currentChequera: state.currentChequera ? {
          ...state.currentChequera,
          proximoCheque: action.payload.proximoCheque,
          chequesDisponibles: action.payload.chequesDisponibles,
        } : null,
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.UPDATE_CHEQUE:
      return {
        ...state,
        cheques: state.cheques.map(cheque =>
          cheque._id === action.payload._id ? action.payload : cheque
        ),
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.SET_RESUMEN:
      return {
        ...state,
        resumen: action.payload,
        isLoading: false,
        error: null,
      };

    case CHEQUERA_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    default:
      return state;
  }
};

// Crear contexto
const ChequeraContext = createContext();

// Hook personalizado para usar el contexto
export const useChequera = () => {
  const context = useContext(ChequeraContext);
  if (!context) {
    throw new Error("useChequera debe ser usado dentro de un ChequeraProvider");
  }
  return context;
};

// Provider del contexto
export const ChequeraProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chequeraReducer, initialState);

  // Función para manejar errores
  const handleError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
    dispatch({ type: CHEQUERA_ACTIONS.SET_ERROR, payload: errorMessage });
    return errorMessage;
  };

  // Función para obtener todas las chequeras
  const getChequeras = async (params = {}) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
      if (params.search) queryParams.append('search', params.search);
      if (params.tipo) queryParams.append('tipo', params.tipo);

      const response = await clientAxios.get(`/chequeras?${queryParams.toString()}`);
      
      dispatch({
        type: CHEQUERA_ACTIONS.SET_CHEQUERAS,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener una chequera por ID
  const getChequeraById = async (id) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.get(`/chequeras/${id}`);
      
      dispatch({
        type: CHEQUERA_ACTIONS.SET_CURRENT_CHEQUERA,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para crear una nueva chequera
  const createChequera = async (chequeraData) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.post('/chequeras', chequeraData);
      
      dispatch({
        type: CHEQUERA_ACTIONS.ADD_CHEQUERA,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar una chequera
  const updateChequera = async (id, chequeraData) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.put(`/chequeras/${id}`, chequeraData);
      
      dispatch({
        type: CHEQUERA_ACTIONS.UPDATE_CHEQUERA,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar (desactivar) una chequera
  const deleteChequera = async (id) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.delete(`/chequeras/${id}`);
      
      dispatch({
        type: CHEQUERA_ACTIONS.DELETE_CHEQUERA,
        payload: id,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para emitir un cheque
  const emitirCheque = async (chequeraId, chequeData) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      // Estructurar los datos según la nueva API
      const requestData = {
        monto: chequeData.monto,
        fechaEmision: chequeData.fechaEmision || new Date().toISOString().split('T')[0],
        fechaVencimiento: chequeData.fechaVencimiento,
        concepto: chequeData.concepto || '',
        observaciones: chequeData.observaciones || '',
        cliente: {
          nombre: chequeData.beneficiario,
          cuit: chequeData.clienteCuit || '',
          telefono: chequeData.clienteTelefono || '',
          email: chequeData.clienteEmail || '',
          direccion: chequeData.clienteDireccion || ''
        }
      };
      
      const response = await clientAxios.post(`/chequeras/${chequeraId}/cheques/emitir`, requestData);
      
      dispatch({
        type: CHEQUERA_ACTIONS.ADD_CHEQUE,
        payload: response.data.data.movimiento,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para agregar cheque de terceros
  const agregarChequeTerceros = async (chequeraId, chequeData) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      // Estructurar los datos según la nueva API
      const requestData = {
        numero: chequeData.numero,
        monto: chequeData.monto,
        fechaEmision: chequeData.fechaEmision,
        fechaVencimiento: chequeData.fechaVencimiento,
        concepto: chequeData.concepto || '',
        observaciones: chequeData.observaciones || '',
        cliente: {
          nombre: chequeData.beneficiario || chequeData.clienteNombre,
          cuit: chequeData.clienteCuit || '',
          telefono: chequeData.clienteTelefono || '',
          email: chequeData.clienteEmail || '',
          direccion: chequeData.clienteDireccion || ''
        },
        emisor: {
          nombre: chequeData.emisorNombre || '',
          cuit: chequeData.emisorCuit || '',
          banco: chequeData.emisorBanco || ''
        }
      };
      
      const response = await clientAxios.post(`/chequeras/${chequeraId}/cheques/terceros`, requestData);
      
      dispatch({
        type: CHEQUERA_ACTIONS.ADD_CHEQUE,
        payload: response.data.data.movimiento,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener cheques de una chequera
  const getCheques = async (chequeraId, params = {}) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.tipo) queryParams.append('tipo', params.tipo);
      if (params.clienteCuit) queryParams.append('clienteCuit', params.clienteCuit);
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);

      const response = await clientAxios.get(`/chequeras/${chequeraId}/cheques?${queryParams.toString()}`);
      
      dispatch({
        type: CHEQUERA_ACTIONS.SET_CHEQUES,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener movimientos de una chequera
  const getMovimientos = async (chequeraId, params = {}) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.tipo) queryParams.append('tipo', params.tipo);
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);

      const response = await clientAxios.get(`/chequeras/${chequeraId}/movimientos?${queryParams.toString()}`);
      
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para cambiar estado de un cheque
  const cambiarEstadoCheque = async (chequeraId, chequeId, movimientoData) => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.patch(`/chequeras/${chequeraId}/cheques/${chequeId}`, movimientoData);
      
      dispatch({
        type: CHEQUERA_ACTIONS.UPDATE_CHEQUE,
        payload: response.data.data.cheque,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener resumen de chequeras
  const getChequerasResumen = async () => {
    try {
      dispatch({ type: CHEQUERA_ACTIONS.SET_LOADING, payload: true });
      
      const response = await clientAxios.get('/chequeras/resumen');
      
      dispatch({
        type: CHEQUERA_ACTIONS.SET_RESUMEN,
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
    dispatch({ type: CHEQUERA_ACTIONS.CLEAR_ERROR });
  };

  // Función para limpiar estado
  const clearState = () => {
    dispatch({ type: CHEQUERA_ACTIONS.SET_CHEQUERAS, payload: { chequeras: [], pagination: initialState.pagination } });
    dispatch({ type: CHEQUERA_ACTIONS.SET_CURRENT_CHEQUERA, payload: null });
    dispatch({ type: CHEQUERA_ACTIONS.SET_CHEQUES, payload: { cheques: [], ...initialState.pagination } });
    dispatch({ type: CHEQUERA_ACTIONS.SET_RESUMEN, payload: null });
  };

  // Función para establecer chequera actual
  const setCurrentChequera = (chequera) => {
    dispatch({ type: CHEQUERA_ACTIONS.SET_CURRENT_CHEQUERA, payload: chequera });
  };

  // Valor del contexto
  const value = {
    // Estado
    chequeras: state.chequeras,
    currentChequera: state.currentChequera,
    cheques: state.cheques,
    resumen: state.resumen,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,

    // Funciones
    getChequeras,
    getChequeraById,
    createChequera,
    updateChequera,
    deleteChequera,
    emitirCheque,
    agregarChequeTerceros,
    getCheques,
    getMovimientos,
    cambiarEstadoCheque,
    getChequerasResumen,
    clearError,
    clearState,
    setCurrentChequera,
  };

  return (
    <ChequeraContext.Provider value={value}>
      {children}
    </ChequeraContext.Provider>
  );
};

export default ChequeraContext;