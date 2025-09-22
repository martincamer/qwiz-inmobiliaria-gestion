import express from "express";
import {
  crearInquilino,
  obtenerInquilinos,
  obtenerInquilinoPorId,
  actualizarInquilino,
  eliminarInquilino,
  agregarPago,
  marcarPagoComoPagado,
  obtenerHistorialPagos,
  generarPagosMensuales,
  obtenerInquilinosConPagosVencidos,
  obtenerEstadisticasInquilinos,
} from "../controllers/tenantController.js";
import { protect } from "../middleware/auth.js";
import { validarInquilino, validarPago } from "../middleware/validation.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas principales de inquilinos
router
  .route("/")
  .get(obtenerInquilinos) // GET /api/inquilinos - Obtener todos los inquilinos
  .post(validarInquilino, crearInquilino); // POST /api/inquilinos - Crear nuevo inquilino

// Rutas especiales (deben ir antes de las rutas con parámetros)
router.get("/pagos-vencidos", obtenerInquilinosConPagosVencidos); // GET /api/inquilinos/pagos-vencidos
router.get("/estadisticas", obtenerEstadisticasInquilinos); // GET /api/inquilinos/estadisticas

// Rutas con ID de inquilino
router
  .route("/:id")
  .get(obtenerInquilinoPorId) // GET /api/inquilinos/:id - Obtener inquilino por ID
  .put(actualizarInquilino) // PUT /api/inquilinos/:id - Actualizar inquilino
  .delete(eliminarInquilino); // DELETE /api/inquilinos/:id - Eliminar inquilino

// Rutas de pagos
router
  .route("/:id/pagos")
  .get(obtenerHistorialPagos) // GET /api/inquilinos/:id/pagos - Obtener historial de pagos
  .post(validarPago, agregarPago); // POST /api/inquilinos/:id/pagos - Agregar nuevo pago

// Rutas específicas de pagos
router.put("/:id/pagos/:pagoId/pagar", marcarPagoComoPagado); // PUT /api/inquilinos/:id/pagos/:pagoId/pagar
router.post("/:id/generar-pagos", generarPagosMensuales); // POST /api/inquilinos/:id/generar-pagos

export default router;
