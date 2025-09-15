import express from "express";
import {
  createChequera,
  getChequeras,
  getChequeraById,
  updateChequera,
  emitirCheque,
  agregarChequeTerceros,
  getCheques,
  cambiarEstadoCheque,
  deleteChequera,
  getChequerasResumen,
  getMovimientos,
} from "../controllers/chequeraController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas principales de chequeras
router.post("/", createChequera); // Crear nueva chequera
router.get("/", getChequeras); // Obtener todas las chequeras de la empresa
router.get("/resumen", getChequerasResumen); // Obtener resumen de chequeras
router.get("/:id", getChequeraById); // Obtener chequera por ID
router.put("/:id", updateChequera); // Actualizar chequera
router.delete("/:id", deleteChequera); // Eliminar (desactivar) chequera

// Rutas de cheques
router.post("/:id/cheques/emitir", emitirCheque); // Emitir cheque de chequera propia
router.post("/:id/cheques/terceros", agregarChequeTerceros); // Agregar cheque de terceros
router.get("/:id/cheques", getCheques); // Obtener cheques de una chequera
router.patch("/:id/cheques/:chequeId", cambiarEstadoCheque); // Cambiar estado de un cheque

// Rutas de movimientos
router.get("/:id/movimientos", getMovimientos); // Obtener movimientos de una chequera

export default router;
