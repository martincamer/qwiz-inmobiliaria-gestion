import express from "express";
import {
  crearPropiedad,
  obtenerPropiedades,
  obtenerPropiedadPorId,
  actualizarPropiedad,
  eliminarPropiedad,
  asignarInquilino,
  liberarInquilino,
  obtenerPropiedadesPorPropietario,
  obtenerPropiedadesSimilares,
  obtenerEstadisticasPropiedades,
  busquedaAvanzada
} from "../controllers/propertyController.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorization.js";
import { validarPropiedad, validarAsignacionInquilino } from "../middleware/validation.js";

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(protect);

// Rutas públicas (para usuarios autenticados)
// GET /api/propiedades - Obtener todas las propiedades con filtros
router.get("/", obtenerPropiedades);

// GET /api/propiedades/estadisticas - Obtener estadísticas
router.get("/estadisticas", authorizeRoles(['admin', 'propietario']), obtenerEstadisticasPropiedades);

// POST /api/propiedades/busqueda-avanzada - Búsqueda avanzada
router.post("/busqueda-avanzada", busquedaAvanzada);

// GET /api/propiedades/propietario/:propietarioId - Obtener propiedades por propietario
router.get("/propietario/:propietarioId", obtenerPropiedadesPorPropietario);

// GET /api/propiedades/:id - Obtener propiedad por ID
router.get("/:id", obtenerPropiedadPorId);

// GET /api/propiedades/:id/similares - Obtener propiedades similares
router.get("/:id/similares", obtenerPropiedadesSimilares);

// Rutas que requieren permisos específicos
// POST /api/propiedades - Crear nueva propiedad (admin y propietarios)
router.post("/", 
  authorizeRoles(['admin', 'propietario']), 
  validarPropiedad, 
  crearPropiedad
);

// PUT /api/propiedades/:id - Actualizar propiedad (admin y propietarios)
router.put("/:id", 
  authorizeRoles(['admin', 'propietario']), 
  validarPropiedad, 
  actualizarPropiedad
);

// DELETE /api/propiedades/:id - Eliminar propiedad (solo admin)
router.delete("/:id", 
  authorizeRoles(['admin']), 
  eliminarPropiedad
);

// Rutas para manejo de inquilinos
// POST /api/propiedades/:id/asignar-inquilino - Asignar inquilino a propiedad
router.post("/:id/asignar-inquilino", 
  authorizeRoles(['admin', 'propietario']), 
  validarAsignacionInquilino, 
  asignarInquilino
);

// POST /api/propiedades/:id/liberar-inquilino - Liberar inquilino de propiedad
router.post("/:id/liberar-inquilino", 
  authorizeRoles(['admin', 'propietario']), 
  liberarInquilino
);

export default router;