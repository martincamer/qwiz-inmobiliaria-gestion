import express from "express";
import {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
  agregarFactura,
  agregarPresupuesto,
  registrarPagoEfectivo,
  registrarPagoBancario,
  registrarPagoCheque,
  getCuentaCorriente,
  getClientesResumen,
} from "../controllers/clienteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas principales de clientes
router.post("/", createCliente); // Crear nuevo cliente
router.get("/", getClientes); // Obtener todos los clientes de la empresa
router.get("/resumen", getClientesResumen); // Obtener resumen de clientes
router.get("/:id", getClienteById); // Obtener cliente por ID
router.put("/:id", updateCliente); // Actualizar cliente
router.delete("/:id", deleteCliente); // Eliminar (desactivar) cliente

// Rutas de facturas
router.post("/:id/facturas", agregarFactura); // Agregar factura a un cliente
// Ruta getFacturas eliminada - Los datos se obtienen directamente del cliente

// Rutas de presupuestos
router.post("/:id/presupuestos", agregarPresupuesto); // Agregar presupuesto a un cliente

// Rutas de pagos
router.post("/:id/pagos/efectivo", registrarPagoEfectivo); // Registrar pago en efectivo
router.post("/:id/pagos/bancario", registrarPagoBancario); // Registrar pago bancario
router.post("/:id/pagos/cheque", registrarPagoCheque); // Registrar pago con cheque

// Rutas de cuenta corriente
router.get("/:id/cuenta-corriente", getCuentaCorriente); // Obtener cuenta corriente de un cliente

export default router;