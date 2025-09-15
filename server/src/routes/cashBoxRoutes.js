import express from "express";
import {
  createCashBox,
  getCashBoxes,
  getCashBoxById,
  updateCashBox,
  addMovement,
  getMovements,
  getCashBoxSummary,
  deleteCashBox,
  getGeneralSummary,
} from "../controllers/cashBoxController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas principales de cajas
router.post("/", createCashBox); // Crear nueva caja
router.get("/", getCashBoxes); // Obtener todas las cajas de la empresa
router.get("/summary", getGeneralSummary); // Obtener resumen general de todas las cajas
router.get("/:id", getCashBoxById); // Obtener caja por ID
router.put("/:id", updateCashBox); // Actualizar caja
router.delete("/:id", deleteCashBox); // Eliminar (desactivar) caja

// Rutas de movimientos
router.post("/:id/movements", addMovement); // Agregar movimiento a la caja
router.get("/:id/movements", getMovements); // Obtener movimientos de una caja
router.get("/:id/summary", getCashBoxSummary); // Obtener resumen de una caja específica

export default router;
