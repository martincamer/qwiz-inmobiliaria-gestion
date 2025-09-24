import express from "express";
import {
  createPropiedad,
  getPropiedades,
  getPropiedadById,
  updatePropiedad,
  deletePropiedad,
  cambiarEstadoPropiedad,
  incrementarVisitas,
  incrementarConsultas,
} from "../controllers/propiedadesController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Rutas públicas (para visitantes del sitio web)
router.put("/:id/visitas", incrementarVisitas);
router.put("/:id/consultas", incrementarConsultas);

// Rutas protegidas (requieren autenticación)
router.use(protect); // Todas las rutas siguientes requieren autenticación

// Rutas CRUD básicas
router.post("/", createPropiedad);
router.get("/", getPropiedades);
router.get("/:id", getPropiedadById);
router.put("/:id", updatePropiedad);
router.delete("/:id", deletePropiedad);

// Rutas de acciones específicas
router.put("/:id/estado", cambiarEstadoPropiedad);

export default router;