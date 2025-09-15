import clientAxios from "../lib/axios";

// Servicios de autenticación
export const authAPI = {
  // Iniciar sesión
  login: async (email, password) => {
    const response = await clientAxios.post("/auth/login", { email, password });
    return response.data;
  },

  // Registrarse
  register: async (userData) => {
    const response = await clientAxios.post("/auth/register", userData);
    return response.data;
  },

  // Obtener perfil actual
  getProfile: async () => {
    const response = await clientAxios.get("/auth/me");
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    const response = await clientAxios.put("/auth/profile", profileData);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    const response = await clientAxios.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Verificar token
  verifyToken: async () => {
    const response = await clientAxios.get("/auth/verify");
    return response.data;
  },
};

// Servicios de usuarios
export const usersAPI = {
  // Obtener todos los usuarios
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const response = await clientAxios.get(`/users?${queryParams.toString()}`);
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await clientAxios.get(`/users/${id}`);
    return response.data;
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    const response = await clientAxios.put(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    const response = await clientAxios.delete(`/users/${id}`);
    return response.data;
  },

  // Cambiar estado del usuario
  toggleUserStatus: async (id) => {
    const response = await clientAxios.patch(`/users/${id}/toggle-status`);
    return response.data;
  },

  // Obtener estadísticas de usuarios
  getUserStats: async () => {
    const response = await clientAxios.get("/users/stats/overview");
    return response.data;
  },

  // Obtener historial de login
  getUserLoginHistory: async (id) => {
    const response = await clientAxios.get(`/users/${id}/login-history`);
    return response.data;
  },
};

// Servicios de empresa/compañía
export const companyAPI = {
  // Obtener información de la empresa del usuario actual
  getCompanyInfo: async () => {
    const response = await clientAxios.get("/auth/me");
    return response.data.data.user.company;
  },

  // Actualizar información de la empresa
  updateCompanyInfo: async (companyData) => {
    const response = await clientAxios.put("/auth/profile", {
      company: companyData,
    });
    return response.data;
  },
};

// Servicios de AFIP
export const afipAPI = {
  // Obtener datos de AFIP del usuario actual
  getAfipData: async () => {
    const response = await clientAxios.get("/auth/me");
    return response.data.data.user.afipData;
  },

  // Actualizar datos de AFIP
  updateAfipData: async (afipData) => {
    const response = await clientAxios.put("/auth/profile", {
      afipData: afipData,
    });
    return response.data;
  },
};

// Servicios de suscripción
export const subscriptionAPI = {
  // Obtener información de suscripción
  getSubscriptionInfo: async () => {
    const response = await clientAxios.get("/auth/me");
    return response.data.data.user.subscription;
  },

  // Obtener estado de pago
  getPaymentStatus: async () => {
    const response = await clientAxios.get("/auth/me");
    return response.data.data.user.paymentStatus;
  },

  // Verificar si puede acceder al sistema
  canAccessSystem: async () => {
    const response = await clientAxios.get("/auth/me");
    const user = response.data.data.user;

    // Lógica para verificar acceso (similar al método del modelo)
    if (user.subscription.status === "trial") {
      return new Date() <= new Date(user.subscription.trialEndDate);
    }

    if (user.subscription.status === "active") {
      return user.paymentStatus.canAccessSystem && user.paymentStatus.isPaid;
    }

    return false;
  },

  // Obtener días restantes de prueba
  getTrialDaysRemaining: async () => {
    const response = await clientAxios.get("/auth/me");
    const user = response.data.data.user;

    if (user.subscription.status !== "trial") return 0;

    const now = new Date();
    const trialEnd = new Date(user.subscription.trialEndDate);
    const diffTime = trialEnd - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  },
};

// Exportar todas las APIs
export default {
  auth: authAPI,
  users: usersAPI,
  company: companyAPI,
  afip: afipAPI,
  subscription: subscriptionAPI,
};
