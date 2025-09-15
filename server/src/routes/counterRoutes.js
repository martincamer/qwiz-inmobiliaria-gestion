import express from "express";
import {
  getCounters,
  configurarFormato,
  resetCounter,
  getNextNumber,
  generateNextNumber,
} from "../controllers/counterController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Obtener todos los contadores
router.get("/", protect, getCounters);

// Configurar formato de numeración
router.put("/formato/:tipo", protect, configurarFormato);

// Resetear contador
router.put("/reset/:tipo", protect, resetCounter);

// Obtener siguiente número (solo vista previa)
router.get("/next-number/:tipo", protect, getNextNumber);

// Generar y consumir siguiente número
router.post("/generate-number/:tipo", protect, generateNextNumber);

export default router;