import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para proteger rutas
export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token existe en los headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Verificar si no hay token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No autorizado, token requerido",
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "No autorizado, usuario no encontrado",
        });
      }

      // Verificar si el usuario está activo
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Cuenta desactivada",
        });
      }

      // Agregar usuario a la request
      req.user = user.getPublicProfile();
      next();
    } catch (error) {
      console.error("Error verificando token:", error);
      return res.status(401).json({
        success: false,
        message: "No autorizado, token inválido",
      });
    }
  } catch (error) {
    console.error("Error en middleware de autenticación:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Middleware para autorizar roles específicos
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Rol ${req.user.role} no autorizado para acceder a este recurso`,
      });
    }

    next();
  };
};

// Middleware para verificar si el usuario es propietario del recurso
export const checkOwnership = (resourceModel, resourceIdParam = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Recurso no encontrado",
        });
      }

      // Verificar si el usuario es el propietario o es admin
      if (
        resource.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "No autorizado para acceder a este recurso",
        });
      }

      // Agregar el recurso a la request para evitar otra consulta
      req.resource = resource;
      next();
    } catch (error) {
      console.error("Error verificando propiedad:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  };
};

// Middleware opcional de autenticación (no requiere token)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user && user.isActive) {
          req.user = user.getPublicProfile();
        }
      } catch (error) {
        // Token inválido, pero continuamos sin usuario
        console.log("Token inválido en autenticación opcional:", error.message);
      }
    }

    next();
  } catch (error) {
    console.error("Error en autenticación opcional:", error);
    next();
  }
};
