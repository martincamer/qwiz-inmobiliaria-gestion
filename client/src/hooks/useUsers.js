import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import clientAxios from '../lib/axios';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { user: currentUser } = useAuth();

  // Función para obtener todos los usuarios
  const getUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      
      // Agregar parámetros de consulta
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.role) queryParams.append('role', params.role);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
      if (params.search) queryParams.append('search', params.search);

      const response = await clientAxios.get(`/users?${queryParams.toString()}`);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al obtener usuarios';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener un usuario por ID
  const getUserById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await clientAxios.get(`/users/${id}`);
      
      return { success: true, data: response.data.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al obtener usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un usuario
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await clientAxios.put(`/users/${id}`, userData);
      
      if (response.data.success) {
        // Actualizar la lista local de usuarios
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === id ? response.data.data.user : user
          )
        );
      }

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await clientAxios.delete(`/users/${id}`);
      
      if (response.data.success) {
        // Remover de la lista local
        setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      }

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado de un usuario
  const toggleUserStatus = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await clientAxios.patch(`/users/${id}/toggle-status`);
      
      if (response.data.success) {
        // Actualizar la lista local
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === id ? { ...user, isActive: response.data.data.user.isActive } : user
          )
        );
      }

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar estado del usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener estadísticas de usuarios
  const getUserStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await clientAxios.get('/users/stats/overview');
      
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al obtener estadísticas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener historial de login de un usuario
  const getUserLoginHistory = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await clientAxios.get(`/users/${id}/login-history`);
      
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al obtener historial';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Verificar si el usuario actual es admin
  const isAdmin = currentUser?.role === 'admin';

  return {
    // Estado
    users,
    loading,
    error,
    pagination,
    isAdmin,
    
    // Funciones
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserStats,
    getUserLoginHistory,
    clearError,
  };
};

export default useUsers;