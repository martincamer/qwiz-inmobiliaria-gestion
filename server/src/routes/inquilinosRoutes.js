import express from "express";
import {
  createInquilino,
  getInquilinos,
  getInquilinoById,
  updateInquilino,
  deleteInquilino,
  cambiarEstadoInquilino,
  agregarContrato,
  agregarFactura,
  agregarCobranza,
  getFacturasPendientes,
  getCuentaCorriente,
} from "../controllers/inquilinosController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas CRUD básicas
router.post("/", createInquilino);
router.get("/", getInquilinos);
router.get("/:id", getInquilinoById);
router.put("/:id", updateInquilino);
router.delete("/:id", deleteInquilino);

// Rutas de acciones específicas
router.put("/:id/estado", cambiarEstadoInquilino);
router.post("/:id/contratos", agregarContrato);

// Rutas de cuenta corriente
router.post("/:id/facturas", agregarFactura);
router.post("/:id/cobranzas", agregarCobranza);
router.get("/:id/facturas-pendientes", getFacturasPendientes);
router.get("/:id/cuenta-corriente", getCuentaCorriente);

export default router;
