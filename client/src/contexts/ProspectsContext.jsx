import { createContext, useContext, useReducer, useEffect } from "react";
import clientAxios from "../lib/axios";

// Estado inicial
const initialState = {
  prospects: [],
  currentProspect: null,
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
    source: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

// Tipos de acciones
const PROSPECTS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_PROSPECTS: "SET_PROSPECTS",
  SET_CURRENT_PROSPECT: "SET_CURRENT_PROSPECT",
  ADD_PROSPECT: "ADD_PROSPECT",
  UPDATE_PROSPECT: "UPDATE_PROSPECT",
  DELETE_PROSPECT: "DELETE_PROSPECT",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_CURRENT_PROSPECT: "CLEAR_CURRENT_PROSPECT",
};

// Reducer
const prospectsReducer = (state, action) => {
  switch (action.type) {
    case PROSPECTS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case PROSPECTS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case PROSPECTS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case PROSPECTS_ACTIONS.SET_PROSPECTS:
      return {
        ...state,
        prospects: action.payload,
        isLoading: false,
        error: null,
      };

    case PROSPECTS_ACTIONS.SET_CURRENT_PROSPECT:
      return {
        ...state,
        currentProspect: action.payload,
        isLoading: false,
        error: null,
      };

    case PROSPECTS_ACTIONS.ADD_PROSPECT:
      return {
        ...state,
        prospects: [action.payload, ...state.prospects],
        isLoading: false,
        error: null,
      };

    case PROSPECTS_ACTIONS.UPDATE_PROSPECT:
      return {
        ...state,
        prospects: state.prospects.map((prospect) =>
          prospect._id === action.payload._id ? action.payload : prospect
        ),
        currentProspect:
          state.currentProspect?._id === action.payload._id
            ? action.payload
            : state.currentProspect,
        isLoading: false,
        error: null,
      };

    case PROSPECTS_ACTIONS.DELETE_PROSPECT:
      return {
        ...state,
        prospects: state.prospects.filter(
          (prospect) => prospect._id !== action.payload
        ),
        currentProspect:
          state.currentProspect?._id === action.payload
            ? null
            : state.currentProspect,
        isLoading: false,
        error: null,
      };

    case PROSPECTS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case PROSPECTS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case PROSPECTS_ACTIONS.CLEAR_CURRENT_PROSPECT:
      return {
        ...state,
        currentProspect: null,
      };

    default:
      return state;
  }
};

// Crear contexto
const ProspectsContext = createContext();

// Hook personalizado para usar el contexto
export const useProspects = () => {
  const context = useContext(ProspectsContext);
  if (!context) {
    throw new Error(
      "useProspects debe ser usado dentro de un ProspectsProvider"
    );
  }
  return context;
};

// Provider del contexto
export const ProspectsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(prospectsReducer, initialState);

  // Función para obtener todos los prospectos
  const getProspects = async (filters = {}) => {
    try {
      dispatch({ type: PROSPECTS_ACTIONS.SET_LOADING, payload: true });

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
        `/prospectos?${params.toString()}`
      );

      dispatch({
        type: PROSPECTS_ACTIONS.SET_PROSPECTS,
        payload: response.data.data,
      });
      dispatch({
        type: PROSPECTS_ACTIONS.SET_PAGINATION,
        payload: response.data.pagination,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener prospectos";
      dispatch({ type: PROSPECTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener un prospecto por ID
  const getProspectById = async (id) => {
    try {
      dispatch({ type: PROSPECTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.get(`/prospectos/${id}`);

      dispatch({
        type: PROSPECTS_ACTIONS.SET_CURRENT_PROSPECT,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener prospecto";
      dispatch({ type: PROSPECTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para crear un nuevo prospecto
  const createProspect = async (prospectData) => {
    try {
      dispatch({ type: PROSPECTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.post("/prospectos", prospectData);

      dispatch({
        type: PROSPECTS_ACTIONS.ADD_PROSPECT,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al crear prospecto";
      dispatch({ type: PROSPECTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar un prospecto
  const updateProspect = async (id, prospectData) => {
    try {
      dispatch({ type: PROSPECTS_ACTIONS.SET_LOADING, payload: true });

      const response = await clientAxios.put(`/prospectos/${id}`, prospectData);

      dispatch({
        type: PROSPECTS_ACTIONS.UPDATE_PROSPECT,
        payload: response.data.data,
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar prospecto";
      dispatch({ type: PROSPECTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar un prospecto
  const deleteProspect = async (id) => {
    try {
      dispatch({ type: PROSPECTS_ACTIONS.SET_LOADING, payload: true });

      await clientAxios.delete(`/prospectos/${id}`);

      dispatch({
        type: PROSPECTS_ACTIONS.DELETE_PROSPECT,
        payload: id,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar prospecto";
      dispatch({ type: PROSPECTS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar filtros
  const updateFilters = (newFilters) => {
    dispatch({ type: PROSPECTS_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Función para actualizar paginación
  const updatePagination = (newPagination) => {
    dispatch({
      type: PROSPECTS_ACTIONS.SET_PAGINATION,
      payload: newPagination,
    });
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: PROSPECTS_ACTIONS.CLEAR_ERROR });
  };

  // Función para limpiar prospecto actual
  const clearCurrentProspect = () => {
    dispatch({ type: PROSPECTS_ACTIONS.CLEAR_CURRENT_PROSPECT });
  };

  // Cargar prospectos al montar el componente
  useEffect(() => {
    getProspects();
  }, []);

  // Valor del contexto
  const value = {
    // Estado
    prospects: state.prospects,
    currentProspect: state.currentProspect,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Funciones
    getProspects,
    getProspectById,
    createProspect,
    updateProspect,
    deleteProspect,
    updateFilters,
    updatePagination,
    clearError,
    clearCurrentProspect,
  };

  return (
    <ProspectsContext.Provider value={value}>
      {children}
    </ProspectsContext.Provider>
  );
};

export default ProspectsContext;