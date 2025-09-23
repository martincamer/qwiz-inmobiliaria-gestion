import express from "express";
import {
  crearProspecto,
  obtenerProspectos,
  obtenerProspectoPorId,
  actualizarProspecto,
  eliminarProspecto,
  agregarInteraccion,
  mostrarPropiedad,
  obtenerEstadisticas,
} from "../controllers/prospectController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// @route   GET /api/prospectos/estadisticas
// @desc    Obtener estadísticas de prospectos
// @access  Private (Admin, Agente, User)
router.get(
  "/estadisticas",
  authorize("admin", "agente", "user"),
  obtenerEstadisticas
);

// @route   POST /api/prospectos
// @desc    Crear un nuevo prospecto
// @access  Private (Admin, Agente, User)
router.post("/", authorize("admin", "agente", "user"), crearProspecto);

// @route   GET /api/prospectos
// @desc    Obtener todos los prospectos con filtros y paginación
// @access  Private (Admin, Agente, User)
router.get("/", authorize("admin", "agente", "user"), obtenerProspectos);

// @route   GET /api/prospectos/:id
// @desc    Obtener un prospecto por ID
// @access  Private (Admin, Agente, User)
router.get("/:id", authorize("admin", "agente", "user"), obtenerProspectoPorId);

// @route   PUT /api/prospectos/:id
// @desc    Actualizar un prospecto
// @access  Private (Admin, Agente, User)
router.put("/:id", authorize("admin", "agente", "user"), actualizarProspecto);

// @route   DELETE /api/prospectos/:id
// @desc    Eliminar un prospecto (soft delete)
// @access  Private (Admin)
router.delete("/:id", authorize("admin"), eliminarProspecto);

// @route   POST /api/prospectos/:id/interacciones
// @desc    Agregar una interacción a un prospecto
// @access  Private (Admin, Agente, User)
router.post(
  "/:id/interacciones",
  authorize("admin", "agente", "user"),
  agregarInteraccion
);

// @route   POST /api/prospectos/:id/propiedades
// @desc    Mostrar una propiedad a un prospecto
// @access  Private (Admin, Agente, User)
router.post(
  "/:id/propiedades",
  authorize("admin", "agente", "user"),
  mostrarPropiedad
);

export default router;
