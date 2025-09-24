import express from "express";
import {
  createPropietario,
  getPropietarios,
  getPropietarioById,
  updatePropietario,
  deletePropietario,
  cambiarEstadoPropietario,
  agregarPropiedad,
  removerPropiedad,
} from "../controllers/propietariosController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas CRUD básicas
router.post("/", createPropietario);
router.get("/", getPropietarios);
router.get("/:id", getPropietarioById);
router.put("/:id", updatePropietario);
router.delete("/:id", deletePropietario);

// Rutas de acciones específicas
router.put("/:id/estado", cambiarEstadoPropietario);
router.put("/:id/propiedades/:propiedadId", agregarPropiedad);
router.delete("/:id/propiedades/:propiedadId", removerPropiedad);

export default router;
