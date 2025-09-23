import express from "express";
import {
  crearPropietario,
  obtenerPropietarios,
  obtenerPropietarioPorId,
  actualizarPropietario,
  eliminarPropietario,
  obtenerInquilinosPropietario,
  obtenerEstadisticasPropietario,
  cambiarPasswordPropietario,
} from "../controllers/ownerController.js";
import {
  validarPropietario,
  validarCambioPassword,
} from "../middleware/validation.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// @route   POST /api/propietarios
// @desc    Crear un nuevo propietario
// @access  Private (Cualquier usuario autenticado)
router.post("/", validarPropietario, crearPropietario);

// @route   GET /api/propietarios
// @desc    Obtener todos los propietarios con filtros y paginación
// @access  Private (Cualquier usuario autenticado)
router.get("/", obtenerPropietarios);

// @route   GET /api/propietarios/:id
// @desc    Obtener un propietario por ID
// @access  Private (Admin, Agente, Propietario propio)
router.get(
  "/:id",
  authorize("admin", "agente", "propietario"),
  obtenerPropietarioPorId
);

// @route   PUT /api/propietarios/:id
// @desc    Actualizar un propietario
// @access  Private (Cualquier usuario autenticado)
router.put("/:id", validarPropietario, actualizarPropietario);

// @route   DELETE /api/propietarios/:id
// @desc    Eliminar un propietario
// @access  Private (Admin)
router.delete("/:id", authorize("admin"), eliminarPropietario);

// @route   GET /api/propietarios/:id/inquilinos
// @desc    Obtener inquilinos de un propietario
// @access  Private (Admin, Agente, Propietario propio)
router.get(
  "/:id/inquilinos",
  authorize("admin", "agente", "propietario"),
  obtenerInquilinosPropietario
);

// @route   GET /api/propietarios/:id/estadisticas
// @desc    Obtener estadísticas de un propietario
// @access  Private (Admin, Agente, Propietario propio)
router.get(
  "/:id/estadisticas",
  authorize("admin", "agente", "propietario"),
  obtenerEstadisticasPropietario
);

// @route   PUT /api/propietarios/:id/cambiar-password
// @desc    Cambiar contraseña del propietario
// @access  Private (Admin, Propietario propio)
router.put(
  "/:id/cambiar-password",
  authorize("admin", "propietario"),
  validarCambioPassword,
  cambiarPasswordPropietario
);

export default router;
