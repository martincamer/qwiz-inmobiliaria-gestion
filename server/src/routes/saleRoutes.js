import express from 'express';
import {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  updateSaleStatus,
  deleteSale,
  addDocument,
  removeDocument,
  getSalesStats,
  findSimilarSales,
  getOverdueSales
} from '../controllers/saleController.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/authorization.js';
import { 
  validarVenta, 
  validarActualizacionVenta,
  validarEstadoVenta 
} from '../middleware/validation.js';

const router = express.Router();

// ============================================================================
// RUTAS PÚBLICAS (Solo estadísticas y búsquedas)
// ============================================================================

router.get('/estadisticas', 
  protect, 
  authorizeRoles(['admin', 'gerente']), 
  getSalesStats
);

// Obtener ventas vencidas
router.get('/vencidas', 
  protect, 
  authorizeRoles(['admin', 'gerente']), 
  getOverdueSales
);

// Buscar ventas similares
router.get('/similares', 
  protect, 
  findSimilarSales
);

// ============================================================================
// RUTAS PRIVADAS (Requieren autenticación)
// ============================================================================

// Crear nueva venta
router.post('/', 
  protect, 
  authorizeRoles(['admin', 'gerente', 'agente']),
  validarVenta,
  createSale
);

// Obtener todas las ventas (con filtros)
router.get('/', 
  protect, 
  getSales
);

// Obtener venta por ID
router.get('/:id', 
  protect, 
  getSaleById
);

// Actualizar venta
router.put('/:id', 
  protect, 
  authorizeRoles(['admin', 'gerente', 'agente']),
  validarActualizacionVenta,
  updateSale
);

// Actualizar estado de venta
router.patch('/:id/estado', 
  protect, 
  authorizeRoles(['admin', 'gerente']),
  validarEstadoVenta,
  updateSaleStatus
);

// Eliminar venta
router.delete('/:id', 
  protect, 
  authorizeRoles(['admin']),
  deleteSale
);

// ============================================================================
// RUTAS DE DOCUMENTOS
// ============================================================================

// Agregar documento a venta (usando URLs de Cloudinary)
router.post('/:id/documentos', 
  protect, 
  authorizeRoles(['admin', 'gerente', 'agente']),
  addDocument
);

// Eliminar documento de venta
router.delete('/:id/documentos/:category/:documentId', 
  protect, 
  authorizeRoles(['admin', 'gerente', 'agente']),
  removeDocument
);

// ============================================================================
// RUTAS DE FILTRADO ESPECÍFICO
// ============================================================================

// Obtener ventas por estado
router.get('/estado/:status', 
  protect, 
  (req, res, next) => {
    req.query.status = req.params.status;
    next();
  },
  getSales
);

// ============================================================================
// RUTAS DE RELACIONES
// ============================================================================

// Obtener ventas por propietario
router.get('/propietario/:ownerId', 
  protect, 
  (req, res, next) => {
    req.query.owner = req.params.ownerId;
    next();
  },
  getSales
);

// Obtener ventas por prospecto
router.get('/prospecto/:prospectId', 
  protect, 
  (req, res, next) => {
    req.query.prospect = req.params.prospectId;
    next();
  },
  getSales
);

// Obtener ventas por propiedad
router.get('/propiedad/:propertyId', 
  protect, 
  (req, res, next) => {
    req.query.property = req.params.propertyId;
    next();
  },
  getSales
);

// ============================================================================
// RUTAS DE ACCIONES ESPECÍFICAS DE ESTADO
// ============================================================================

// Señar una venta
router.patch('/:id/senar', 
  protect, 
  authorizeRoles(['admin', 'gerente']),
  (req, res, next) => {
    req.body.status = 'señada';
    next();
  },
  updateSaleStatus
);

// Escriturar una venta
router.patch('/:id/escriturar', 
  protect, 
  authorizeRoles(['admin', 'gerente']),
  (req, res, next) => {
    req.body.status = 'escriturada';
    next();
  },
  updateSaleStatus
);

// Cancelar una venta
router.patch('/:id/cancelar', 
  protect, 
  authorizeRoles(['admin', 'gerente']),
  (req, res, next) => {
    req.body.status = 'cancelada';
    next();
  },
  updateSaleStatus
);

// ============================================================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ============================================================================

// Middleware de manejo de errores específico para rutas de ventas
router.use((error, req, res, next) => {
  console.error('Error en rutas de ventas:', error);

  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  // Error de cast (ID inválido)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido'
    });
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

export default router;