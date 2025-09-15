import { createContext, useContext, useReducer, useEffect } from "react";
import clientAxios from "../lib/axios";

// Estado inicial
const initialState = {
  clientes: [],
  currentCliente: null,
  facturas: [],
  presupuestos: [],
  pagos: [],
  cuentaCorriente: [],
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
const CLIENTE_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_CLIENTES: "SET_CLIENTES",
  SET_CURRENT_CLIENTE: "SET_CURRENT_CLIENTE",
  ADD_CLIENTE: "ADD_CLIENTE",
  UPDATE_CLIENTE: "UPDATE_CLIENTE",
  DELETE_CLIENTE: "DELETE_CLIENTE",
  SET_FACTURAS: "SET_FACTURAS",
  ADD_FACTURA: "ADD_FACTURA",
  SET_PRESUPUESTOS: "SET_PRESUPUESTOS",
  ADD_PRESUPUESTO: "ADD_PRESUPUESTO",
  SET_PAGOS: "SET_PAGOS",
  SET_CUENTA_CORRIENTE: "SET_CUENTA_CORRIENTE",
  ADD_PAGO: "ADD_PAGO",
  SET_RESUMEN: "SET_RESUMEN",
  SET_PAGINATION: "SET_PAGINATION",
};

// Reducer
const clienteReducer = (state, action) => {
  switch (action.type) {
    case CLIENTE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case CLIENTE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CLIENTE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case CLIENTE_ACTIONS.SET_CLIENTES:
      return {
        ...state,
        clientes: action.payload.clientes,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.SET_CURRENT_CLIENTE:
      return {
        ...state,
        currentCliente: action.payload,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.ADD_CLIENTE:
      return {
        ...state,
        clientes: [action.payload, ...state.clientes],
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.UPDATE_CLIENTE:
      return {
        ...state,
        clientes: state.clientes.map((cliente) =>
          cliente._id === action.payload._id ? action.payload : cliente
        ),
        currentCliente:
          state.currentCliente?._id === action.payload._id
            ? action.payload
            : state.currentCliente,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.DELETE_CLIENTE:
      return {
        ...state,
        clientes: state.clientes.filter(
          (cliente) => cliente._id !== action.payload
        ),
        currentCliente:
          state.currentCliente?._id === action.payload
            ? null
            : state.currentCliente,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.SET_FACTURAS:
      return {
        ...state,
        facturas: action.payload.facturas,
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

    case CLIENTE_ACTIONS.ADD_FACTURA:
      return {
        ...state,
        facturas: [action.payload.factura, ...state.facturas],
        currentCliente: state.currentCliente
          ? {
              ...state.currentCliente,
              saldoActual:
                action.payload.resumen?.saldoActual ||
                state.currentCliente.saldoActual,
              facturas: [
                action.payload.factura,
                ...(state.currentCliente.facturas || []),
              ],
            }
          : null,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.SET_PRESUPUESTOS:
      return {
        ...state,
        presupuestos: action.payload,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.ADD_PRESUPUESTO:
      return {
        ...state,
        presupuestos: [action.payload.presupuesto, ...state.presupuestos],
        currentCliente: state.currentCliente
          ? {
              ...state.currentCliente,
              presupuestos: [
                action.payload.presupuesto,
                ...(state.currentCliente.presupuestos || []),
              ],
            }
          : null,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.SET_PAGOS:
      return {
        ...state,
        pagos: action.payload,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.SET_CUENTA_CORRIENTE:
      return {
        ...state,
        cuentaCorriente: action.payload.movimientos,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalMovimientos: action.payload.totalMovimientos,
          hasNextPage: action.payload.hasNextPage,
          hasPrevPage: action.payload.hasPrevPage,
        },
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.ADD_PAGO:
      return {
        ...state,
        cuentaCorriente: [action.payload.movimiento, ...state.cuentaCorriente],
        currentCliente: state.currentCliente
          ? {
              ...state.currentCliente,
              saldoActual:
                action.payload.resumen?.saldoActual ||
                state.currentCliente.saldoActual,
            }
          : null,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.SET_RESUMEN:
      return {
        ...state,
        resumen: action.payload,
        isLoading: false,
        error: null,
      };

    case CLIENTE_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    default:
      return state;
  }
};

// Crear contexto
const ClienteContext = createContext();

// Hook personalizado para usar el contexto
export const useCliente = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error("useCliente debe ser usado dentro de un ClienteProvider");
  }
  return context;
};

// Provider del contexto
export const ClienteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clienteReducer, initialState);

  // Función para manejar errores
  const handleError = (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Error desconocido";
    dispatch({ type: CLIENTE_ACTIONS.SET_ERROR, payload: errorMessage });
    return errorMessage;
  };

  // Función para obtener todos los clientes
  const getClientes = async (params = {}) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.estado) queryParams.append("estado", params.estado);
      if (params.search) queryParams.append("search", params.search);
      if (params.tipoPersona)
        queryParams.append("tipoPersona", params.tipoPersona);

      const response = await clientAxios.get(
        `/clientes?${queryParams.toString()}`
      );

      dispatch({
        type: CLIENTE_ACTIONS.SET_CLIENTES,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener un cliente por ID
  const getClienteById = async (id) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get(`/clientes/${id}`);

      dispatch({
        type: CLIENTE_ACTIONS.SET_CURRENT_CLIENTE,
        payload: response.data.data.cliente,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para crear un nuevo cliente
  const createCliente = async (clienteData) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post("/clientes", clienteData);

      dispatch({
        type: CLIENTE_ACTIONS.ADD_CLIENTE,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar un cliente
  const updateCliente = async (id, clienteData) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.put(`/clientes/${id}`, clienteData);

      dispatch({
        type: CLIENTE_ACTIONS.UPDATE_CLIENTE,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar (desactivar) un cliente
  const deleteCliente = async (id) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.delete(`/clientes/${id}`);

      dispatch({
        type: CLIENTE_ACTIONS.DELETE_CLIENTE,
        payload: id,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para agregar una factura
  const agregarFactura = async (clienteId, facturaData) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(
        `/clientes/${clienteId}/facturas`,
        facturaData
      );

      dispatch({
        type: CLIENTE_ACTIONS.ADD_FACTURA,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función getFacturas eliminada - Los datos se obtienen directamente del cliente

  // Función para agregar un presupuesto
  const agregarPresupuesto = async (clienteId, presupuestoData) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(
        `/clientes/${clienteId}/presupuestos`,
        presupuestoData
      );

      dispatch({
        type: CLIENTE_ACTIONS.ADD_PRESUPUESTO,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para registrar pago en efectivo
  const registrarPagoEfectivo = async (clienteId, pagoData) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(
        `/clientes/${clienteId}/pagos/efectivo`,
        pagoData
      );

      dispatch({
        type: CLIENTE_ACTIONS.ADD_PAGO,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para registrar pago bancario
  const registrarPagoBancario = async (clienteId, pagoData) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(
        `/clientes/${clienteId}/pagos/bancario`,
        pagoData
      );

      dispatch({
        type: CLIENTE_ACTIONS.ADD_PAGO,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para registrar pago con cheque
  const registrarPagoCheque = async (clienteId, pagoData) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post(
        `/clientes/${clienteId}/pagos/cheque`,
        pagoData
      );

      dispatch({
        type: CLIENTE_ACTIONS.ADD_PAGO,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener cuenta corriente de un cliente
  const getCuentaCorriente = async (clienteId, params = {}) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.tipo) queryParams.append("tipo", params.tipo);
      if (params.fechaDesde)
        queryParams.append("fechaDesde", params.fechaDesde);
      if (params.fechaHasta)
        queryParams.append("fechaHasta", params.fechaHasta);

      const response = await clientAxios.get(
        `/clientes/${clienteId}/cuenta-corriente?${queryParams.toString()}`
      );

      dispatch({
        type: CLIENTE_ACTIONS.SET_CUENTA_CORRIENTE,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener presupuestos de un cliente
  const getPresupuestos = async (clienteId, params = {}) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const cliente = await clientAxios.get(`/clientes/${clienteId}`);

      dispatch({
        type: CLIENTE_ACTIONS.SET_PRESUPUESTOS,
        payload: cliente.data.data.cliente.presupuestos || [],
      });

      return {
        success: true,
        data: cliente.data.data.cliente.presupuestos || [],
      };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener pagos de un cliente
  const getPagos = async (clienteId, params = {}) => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const cliente = await clientAxios.get(`/clientes/${clienteId}`);
      const allPagos = [
        ...(cliente.data.data.cliente.pagosEfectivo || []).map((p) => ({
          ...p,
          tipo: "efectivo",
        })),
        ...(cliente.data.data.cliente.pagosBancarios || []).map((p) => ({
          ...p,
          tipo: p.tipoPago || "transferencia",
        })),
        ...(cliente.data.data.cliente.pagosCheques || []).map((p) => ({
          ...p,
          tipo: "cheque",
        })),
      ];

      dispatch({
        type: CLIENTE_ACTIONS.SET_PAGOS,
        payload: allPagos,
      });

      return { success: true, data: allPagos };
    } catch (error) {
      const errorMessage = handleError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener resumen de clientes
  const getClientesResumen = async () => {
    try {
      dispatch({ type: CLIENTE_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get("/clientes/resumen");

      dispatch({
        type: CLIENTE_ACTIONS.SET_RESUMEN,
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
    dispatch({ type: CLIENTE_ACTIONS.CLEAR_ERROR });
  };

  // Función para limpiar estado
  const clearState = () => {
    dispatch({
      type: CLIENTE_ACTIONS.SET_CLIENTES,
      payload: { clientes: [], pagination: initialState.pagination },
    });
    dispatch({ type: CLIENTE_ACTIONS.SET_CURRENT_CLIENTE, payload: null });
    dispatch({
      type: CLIENTE_ACTIONS.SET_FACTURAS,
      payload: { facturas: [], ...initialState.pagination },
    });
    dispatch({ type: CLIENTE_ACTIONS.SET_PRESUPUESTOS, payload: [] });
    dispatch({
      type: CLIENTE_ACTIONS.SET_CUENTA_CORRIENTE,
      payload: { movimientos: [], ...initialState.pagination },
    });
    dispatch({ type: CLIENTE_ACTIONS.SET_RESUMEN, payload: null });
  };

  // Función para establecer cliente actual
  const setCurrentCliente = (cliente) => {
    dispatch({ type: CLIENTE_ACTIONS.SET_CURRENT_CLIENTE, payload: cliente });
  };

  // Valor del contexto
  const value = {
    // Estado
    clientes: state.clientes,
    currentCliente: state.currentCliente,
    facturas: state.facturas,
    presupuestos: state.presupuestos,
    pagos: state.pagos,
    cuentaCorriente: state.cuentaCorriente,
    resumen: state.resumen,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,

    // Funciones
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    agregarFactura,
    // getFacturas eliminada - Los datos se obtienen directamente del cliente
    agregarPresupuesto,
    registrarPagoEfectivo,
    registrarPagoBancario,
    registrarPagoCheque,
    getCuentaCorriente,
    getPresupuestos,
    getPagos,
    getClientesResumen,
    clearError,
    clearState,
    setCurrentCliente,
  };

  return (
    <ClienteContext.Provider value={value}>{children}</ClienteContext.Provider>
  );
};

export default ClienteContext;
