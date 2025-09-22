/**
 * Middleware de autorización basado en roles
 * Controla el acceso a rutas específicas según el rol del usuario
 */

/**
 * Middleware para autorizar roles específicos
 * @param {...string} allowedRoles - Roles permitidos para acceder a la ruta
 * @returns {Function} Middleware de autorización
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Acceso denegado. Usuario no autenticado.'
        });
      }

      // Verificar que el usuario tenga un rol asignado
      if (!req.user.role) {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado. Usuario sin rol asignado.'
        });
      }

      // Verificar si el rol del usuario está en los roles permitidos
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
        });
      }

      // Si todo está bien, continuar con la siguiente función
      next();
    } catch (error) {
      console.error('Error en autorización:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor en la autorización.'
      });
    }
  };
};

/**
 * Middleware para verificar si el usuario es administrador
 * @returns {Function} Middleware de autorización para admin
 */
export const requireAdmin = authorizeRoles('admin');

/**
 * Middleware para verificar si el usuario es agente o administrador
 * @returns {Function} Middleware de autorización para agente/admin
 */
export const requireAgent = authorizeRoles('agente', 'admin');

/**
 * Middleware para verificar si el usuario es propietario, agente o administrador
 * @returns {Function} Middleware de autorización para propietario/agente/admin
 */
export const requireOwnerOrAgent = authorizeRoles('propietario', 'agente', 'admin');

/**
 * Middleware para verificar si el usuario puede acceder a recursos de propietario
 * Permite acceso si es el mismo propietario, un agente o administrador
 * @returns {Function} Middleware de autorización
 */
export const authorizeOwnerAccess = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Usuario no autenticado.'
      });
    }

    const userRole = req.user.role;
    const userId = req.user.id;
    const resourceOwnerId = req.params.ownerId || req.body.ownerId || req.params.id;

    // Administradores y agentes tienen acceso completo
    if (userRole === 'admin' || userRole === 'agente') {
      return next();
    }

    // Propietarios solo pueden acceder a sus propios recursos
    if (userRole === 'propietario' && userId === resourceOwnerId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. No tienes permisos para acceder a este recurso.'
    });
  } catch (error) {
    console.error('Error en autorización de propietario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor en la autorización.'
    });
  }
};

/**
 * Middleware para verificar si el usuario puede acceder a recursos de inquilino
 * Permite acceso si es el mismo inquilino, un agente o administrador
 * @returns {Function} Middleware de autorización
 */
export const authorizeTenantAccess = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Usuario no autenticado.'
      });
    }

    const userRole = req.user.role;
    const userId = req.user.id;
    const resourceTenantId = req.params.tenantId || req.body.tenantId || req.params.id;

    // Administradores y agentes tienen acceso completo
    if (userRole === 'admin' || userRole === 'agente') {
      return next();
    }

    // Inquilinos solo pueden acceder a sus propios recursos
    if (userRole === 'inquilino' && userId === resourceTenantId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. No tienes permisos para acceder a este recurso.'
    });
  } catch (error) {
    console.error('Error en autorización de inquilino:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor en la autorización.'
    });
  }
};