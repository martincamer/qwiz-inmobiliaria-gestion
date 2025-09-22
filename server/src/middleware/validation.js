import { body, param, query } from 'express-validator';

// Validaciones para autenticación
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user', 'accountant'])
    .withMessage('Rol inválido')
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número')
];

// Validaciones para clientes
export const validateCustomer = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del cliente es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido'),
  
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('La dirección es requerida'),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('La ciudad es requerida'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('El estado es requerido'),
  
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('El código postal es requerido'),
  
  body('taxId')
    .trim()
    .notEmpty()
    .withMessage('El RFC es requerido')
    .isLength({ min: 12, max: 13 })
    .withMessage('El RFC debe tener 12 o 13 caracteres'),
  
  body('customerType')
    .optional()
    .isIn(['individual', 'business'])
    .withMessage('Tipo de cliente inválido'),
  
  body('creditLimit')
    .optional()
    .isNumeric()
    .withMessage('El límite de crédito debe ser un número')
    .custom(value => value >= 0)
    .withMessage('El límite de crédito no puede ser negativo')
];

// Validaciones para inventario
export const validateInventory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del producto es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('El SKU es requerido'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida'),
  
  body('unit')
    .isIn(['pcs', 'kg', 'lbs', 'liters', 'meters', 'boxes', 'cases'])
    .withMessage('Unidad de medida inválida'),
  
  body('pricing.cost')
    .isNumeric()
    .withMessage('El costo debe ser un número')
    .custom(value => value >= 0)
    .withMessage('El costo no puede ser negativo'),
  
  body('pricing.sellingPrice')
    .isNumeric()
    .withMessage('El precio de venta debe ser un número')
    .custom(value => value >= 0)
    .withMessage('El precio de venta no puede ser negativo'),
  
  body('stock.current')
    .isNumeric()
    .withMessage('El stock actual debe ser un número')
    .custom(value => value >= 0)
    .withMessage('El stock actual no puede ser negativo'),
  
  body('stock.minimum')
    .isNumeric()
    .withMessage('El stock mínimo debe ser un número')
    .custom(value => value >= 0)
    .withMessage('El stock mínimo no puede ser negativo')
];

// Validaciones para cuentas contables
export const validateAccount = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('El código de cuenta es requerido'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la cuenta es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  
  body('type')
    .isIn(['asset', 'liability', 'equity', 'revenue', 'expense', 'cost_of_goods_sold'])
    .withMessage('Tipo de cuenta inválido'),
  
  body('subtype')
    .isIn([
      'current_asset', 'fixed_asset', 'intangible_asset',
      'current_liability', 'long_term_liability',
      'owner_equity', 'retained_earnings',
      'operating_revenue', 'other_revenue',
      'operating_expense', 'administrative_expense', 'financial_expense',
      'direct_cost', 'indirect_cost'
    ])
    .withMessage('Subtipo de cuenta inválido'),
  
  body('level')
    .isInt({ min: 1, max: 5 })
    .withMessage('El nivel debe ser un número entre 1 y 5'),
  
  body('normalBalance')
    .isIn(['debit', 'credit'])
    .withMessage('Balance normal inválido'),
  
  body('openingBalance')
    .optional()
    .isNumeric()
    .withMessage('El balance inicial debe ser un número')
];

// Validaciones para parámetros de ID
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido')
];

// Validaciones para paginación
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100')
];

// Validaciones para inquilinos
export const validarInquilino = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre completo es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Formato de teléfono inválido'),
  
  body('numeroDocumento')
    .trim()
    .notEmpty()
    .withMessage('El DNI/CUIT/Razón Social es requerido'),
  
  // Referencia al propietario
  body('propietario')
    .isMongoId()
    .withMessage('La referencia al propietario debe ser un ID válido'),
  
  // Validaciones de la propiedad
  body('propiedad.address')
    .trim()
    .notEmpty()
    .withMessage('La dirección de la propiedad es requerida')
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),
  
  body('propiedad.details')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Los detalles no pueden exceder 500 caracteres'),
  
  body('propiedad.type')
    .optional()
    .isIn(['casa', 'departamento', 'oficina', 'local_comercial', 'terreno', 'galpon', 'otro'])
    .withMessage('Tipo de propiedad inválido'),
  
  body('propiedad.rooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El número de habitaciones debe ser un entero positivo'),
  
  body('propiedad.bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El número de baños debe ser un entero positivo'),
  
  body('propiedad.area')
    .optional()
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('El área debe ser un número positivo'),
  
  body('propiedad.furnished')
    .optional()
    .isBoolean()
    .withMessage('El campo amueblado debe ser verdadero o falso'),
  
  // Validaciones del contrato
  body('contrato.startDate')
    .isISO8601()
    .withMessage('La fecha de inicio debe ser una fecha válida'),
  
  body('contrato.endDate')
    .isISO8601()
    .withMessage('La fecha de finalización debe ser una fecha válida')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.contrato.startDate)) {
        throw new Error('La fecha de finalización debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  
  body('contrato.rentAmount')
    .isNumeric()
    .custom(value => value > 0)
    .withMessage('El monto del alquiler debe ser un número positivo'),
  
  body('contrato.currency')
    .optional()
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Moneda inválida'),
  
  body('contrato.paymentDay')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('El día de pago debe estar entre 1 y 31'),
  
  body('contrato.reminderFrequency')
    .optional()
    .isIn(['Mensual', 'Bimensual', 'Trimestral', 'Cuatrimestral', 'Semestral', 'Anual', ''])
    .withMessage('Frecuencia de recordatorio inválida'),
  
  body('contrato.adjustmentIndex')
    .optional()
    .isIn(['IPC', 'ICL', 'CC', 'RIPTE', 'CAC', 'CER', 'IS', 'IPIM', 'UVA', 'Preacordado', ''])
    .withMessage('Índice de ajuste inválido'),
  
  body('contrato.deposit.amount')
    .optional()
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('El monto del depósito debe ser un número positivo o cero'),
  
  body('contrato.deposit.paid')
    .optional()
    .isBoolean()
    .withMessage('El estado del depósito debe ser verdadero o falso'),
  
  body('contrato.deposit.paidDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de pago del depósito debe ser una fecha válida'),
  
  // Validaciones del contacto de emergencia
  body('contactoEmergencia.name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre del contacto de emergencia no puede exceder 100 caracteres'),
  
  body('contactoEmergencia.phone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Formato de teléfono del contacto de emergencia inválido'),
  
  body('contactoEmergencia.relationship')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La relación del contacto de emergencia no puede exceder 50 caracteres'),
  
  // Validaciones de notas
  body('notas')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las notas no pueden exceder 1000 caracteres')
];

// Validaciones para pagos
export const validarPago = [
  body('monto')
    .isNumeric()
    .custom(value => value > 0)
    .withMessage('El monto debe ser un número positivo'),
  
  body('moneda')
    .optional()
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Moneda inválida'),
  
  body('fechaPago')
    .optional()
    .isISO8601()
    .withMessage('La fecha de pago debe ser una fecha válida'),
  
  body('fechaVencimiento')
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida'),
  
  body('metodoPago')
    .optional()
    .isIn(['efectivo', 'transferencia', 'cheque', 'tarjeta_credito', 'tarjeta_debito', 'mercadopago', 'otro'])
    .withMessage('Método de pago inválido'),
  
  body('estado')
    .optional()
    .isIn(['pendiente', 'pagado', 'vencido', 'parcial'])
    .withMessage('Estado de pago inválido'),
  
  body('concepto')
    .optional()
    .isIn(['alquiler', 'expensas', 'servicios', 'deposito', 'multa', 'otro'])
    .withMessage('Concepto de pago inválido'),
  
  body('notas')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Las notas no pueden exceder 300 caracteres'),
  
  body('recibo.number')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El número de recibo no puede exceder 50 caracteres'),
  
  body('recibo.path')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La ruta del recibo no puede exceder 200 caracteres')
];

// Validaciones para propietarios
export const validarPropietario = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres'),

  body('numeroIdentificacion')
    .trim()
    .notEmpty()
    .withMessage('El número de identificación es obligatorio')
    .isLength({ max: 20 })
    .withMessage('El número de identificación no puede exceder 20 caracteres'),

  body('tipoIdentificacion')
    .optional()
    .isIn(['DNI', 'CUIT', 'CUIL', 'RAZON_SOCIAL'])
    .withMessage('Tipo de identificación inválido'),

  // Validaciones de dirección
  body('direccion.calle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La calle no puede exceder 100 caracteres'),

  body('direccion.numero')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('El número no puede exceder 10 caracteres'),

  body('direccion.piso')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('El piso no puede exceder 10 caracteres'),

  body('direccion.departamento')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('El departamento no puede exceder 10 caracteres'),

  body('direccion.ciudad')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La ciudad no puede exceder 50 caracteres'),

  body('direccion.provincia')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La provincia no puede exceder 50 caracteres'),

  body('direccion.codigoPostal')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('El código postal no puede exceder 10 caracteres'),

  // Validaciones de información bancaria
  body('informacionBancaria.banco')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El nombre del banco no puede exceder 50 caracteres'),

  body('informacionBancaria.tipoCuenta')
    .optional()
    .isIn(['AHORRO', 'CORRIENTE', 'CAJA_AHORRO'])
    .withMessage('Tipo de cuenta inválido'),

  body('informacionBancaria.numeroCuenta')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El número de cuenta no puede exceder 30 caracteres'),

  body('informacionBancaria.cbu')
    .optional()
    .trim()
    .isLength({ min: 22, max: 22 })
    .withMessage('El CBU debe tener exactamente 22 caracteres'),

  body('informacionBancaria.alias')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El alias no puede exceder 20 caracteres'),

  // Validaciones de información fiscal
  body('informacionFiscal.condicionIva')
    .optional()
    .isIn([
      'RESPONSABLE_INSCRIPTO',
      'MONOTRIBUTISTA',
      'EXENTO',
      'CONSUMIDOR_FINAL',
      'RESPONSABLE_NO_INSCRIPTO'
    ])
    .withMessage('Condición de IVA inválida'),

  body('informacionFiscal.ingresosBrutos')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El número de ingresos brutos no puede exceder 20 caracteres'),

  // Validaciones de contraseña (opcional para propietarios)
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  // Validaciones de notas
  body('notas')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las notas no pueden exceder 1000 caracteres'),

  // Validaciones de configuración de notificaciones
  body('configuracionNotificaciones.email')
    .optional()
    .isBoolean()
    .withMessage('La configuración de email debe ser verdadero o falso'),

  body('configuracionNotificaciones.sms')
    .optional()
    .isBoolean()
    .withMessage('La configuración de SMS debe ser verdadero o falso'),

  body('configuracionNotificaciones.whatsapp')
    .optional()
    .isBoolean()
    .withMessage('La configuración de WhatsApp debe ser verdadero o falso'),

  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El estado activo debe ser verdadero o falso')
];

// Validaciones para cambio de contraseña
export const validarCambioPassword = [
  body('passwordActual')
    .optional()
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),

  body('passwordNuevo')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
];

// Validaciones para propiedades
export const validarPropiedad = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ min: 5, max: 100 })
    .withMessage('El título debe tener entre 5 y 100 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede exceder 2000 caracteres'),

  body('tipo')
    .isIn(['casa', 'departamento', 'oficina', 'local_comercial', 'terreno', 'galpon', 'otro'])
    .withMessage('Tipo de propiedad inválido'),

  body('estado')
    .optional()
    .isIn(['disponible', 'ocupada', 'mantenimiento', 'vendida'])
    .withMessage('Estado de propiedad inválido'),

  body('propietario')
    .isMongoId()
    .withMessage('La referencia al propietario debe ser un ID válido'),

  // Validaciones de dirección
  body('direccion.calle')
    .trim()
    .notEmpty()
    .withMessage('La calle es obligatoria')
    .isLength({ max: 100 })
    .withMessage('La calle no puede exceder 100 caracteres'),

  body('direccion.numero')
    .trim()
    .notEmpty()
    .withMessage('El número es obligatorio')
    .isLength({ max: 10 })
    .withMessage('El número no puede exceder 10 caracteres'),

  body('direccion.piso')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('El piso no puede exceder 10 caracteres'),

  body('direccion.departamento')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('El departamento no puede exceder 10 caracteres'),

  body('direccion.ciudad')
    .trim()
    .notEmpty()
    .withMessage('La ciudad es obligatoria')
    .isLength({ max: 50 })
    .withMessage('La ciudad no puede exceder 50 caracteres'),

  body('direccion.provincia')
    .trim()
    .notEmpty()
    .withMessage('La provincia es obligatoria')
    .isLength({ max: 50 })
    .withMessage('La provincia no puede exceder 50 caracteres'),

  body('direccion.codigoPostal')
    .trim()
    .notEmpty()
    .withMessage('El código postal es obligatorio')
    .isLength({ max: 10 })
    .withMessage('El código postal no puede exceder 10 caracteres'),

  body('direccion.barrio')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El barrio no puede exceder 50 caracteres'),

  // Validaciones de características
  body('caracteristicas.habitaciones')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El número de habitaciones debe ser un entero positivo'),

  body('caracteristicas.banos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El número de baños debe ser un entero positivo'),

  body('caracteristicas.cocheras')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El número de cocheras debe ser un entero positivo'),

  body('caracteristicas.superficie.total')
    .optional()
    .isNumeric()
    .custom(value => value > 0)
    .withMessage('La superficie total debe ser un número positivo'),

  body('caracteristicas.superficie.cubierta')
    .optional()
    .isNumeric()
    .custom(value => value > 0)
    .withMessage('La superficie cubierta debe ser un número positivo'),

  body('caracteristicas.superficie.descubierta')
    .optional()
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('La superficie descubierta debe ser un número positivo o cero'),

  body('caracteristicas.antiguedad')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La antigüedad debe ser un entero positivo'),

  body('caracteristicas.orientacion')
    .optional()
    .isIn(['norte', 'sur', 'este', 'oeste', 'noreste', 'noroeste', 'sureste', 'suroeste'])
    .withMessage('Orientación inválida'),

  body('caracteristicas.amueblado')
    .optional()
    .isBoolean()
    .withMessage('El campo amueblado debe ser verdadero o falso'),

  body('caracteristicas.balcon')
    .optional()
    .isBoolean()
    .withMessage('El campo balcón debe ser verdadero o falso'),

  body('caracteristicas.terraza')
    .optional()
    .isBoolean()
    .withMessage('El campo terraza debe ser verdadero o falso'),

  body('caracteristicas.jardin')
    .optional()
    .isBoolean()
    .withMessage('El campo jardín debe ser verdadero o falso'),

  body('caracteristicas.piscina')
    .optional()
    .isBoolean()
    .withMessage('El campo piscina debe ser verdadero o falso'),

  body('caracteristicas.parrilla')
    .optional()
    .isBoolean()
    .withMessage('El campo parrilla debe ser verdadero o falso'),

  // Validaciones de precio
  body('precio.monto')
    .isNumeric()
    .custom(value => value > 0)
    .withMessage('El precio debe ser un número positivo'),

  body('precio.moneda')
    .optional()
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Moneda inválida'),

  body('precio.tipoOperacion')
    .isIn(['alquiler', 'venta', 'alquiler_temporal'])
    .withMessage('Tipo de operación inválido'),

  body('precio.expensas')
    .optional()
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('Las expensas deben ser un número positivo o cero'),

  // Validaciones de servicios
  body('servicios.agua')
    .optional()
    .isBoolean()
    .withMessage('El servicio de agua debe ser verdadero o falso'),

  body('servicios.gas')
    .optional()
    .isBoolean()
    .withMessage('El servicio de gas debe ser verdadero o falso'),

  body('servicios.luz')
    .optional()
    .isBoolean()
    .withMessage('El servicio de luz debe ser verdadero o falso'),

  body('servicios.internet')
    .optional()
    .isBoolean()
    .withMessage('El servicio de internet debe ser verdadero o falso'),

  body('servicios.cable')
    .optional()
    .isBoolean()
    .withMessage('El servicio de cable debe ser verdadero o falso'),

  body('servicios.telefono')
    .optional()
    .isBoolean()
    .withMessage('El servicio de teléfono debe ser verdadero o falso'),

  // Validaciones de comodidades
  body('comodidades.ascensor')
    .optional()
    .isBoolean()
    .withMessage('La comodidad ascensor debe ser verdadero o falso'),

  body('comodidades.portero')
    .optional()
    .isBoolean()
    .withMessage('La comodidad portero debe ser verdadero o falso'),

  body('comodidades.seguridad')
    .optional()
    .isBoolean()
    .withMessage('La comodidad seguridad debe ser verdadero o falso'),

  body('comodidades.gimnasio')
    .optional()
    .isBoolean()
    .withMessage('La comodidad gimnasio debe ser verdadero o falso'),

  body('comodidades.sum')
    .optional()
    .isBoolean()
    .withMessage('La comodidad SUM debe ser verdadero o falso'),

  body('comodidades.lavadero')
    .optional()
    .isBoolean()
    .withMessage('La comodidad lavadero debe ser verdadero o falso'),

  // Validaciones de información adicional
  body('informacionAdicional.notas')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Las notas no pueden exceder 2000 caracteres'),

  body('informacionAdicional.disponibilidad')
    .optional()
    .isISO8601()
    .withMessage('La fecha de disponibilidad debe ser una fecha válida'),

  body('informacionAdicional.comision')
    .optional()
    .isNumeric()
    .custom(value => value >= 0 && value <= 100)
    .withMessage('La comisión debe ser un número entre 0 y 100'),

  body('informacionAdicional.destacada')
    .optional()
    .isBoolean()
    .withMessage('El campo destacada debe ser verdadero o falso'),

  body('informacionAdicional.publicada')
    .optional()
    .isBoolean()
    .withMessage('El campo publicada debe ser verdadero o falso')
];

// Validaciones para asignación de inquilino
export const validarAsignacionInquilino = [
  body('inquilinoId')
    .isMongoId()
    .withMessage('El ID del inquilino debe ser válido'),

  body('fechaInicio')
    .isISO8601()
    .withMessage('La fecha de inicio debe ser una fecha válida'),

  body('fechaFin')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe ser una fecha válida')
    .custom((value, { req }) => {
      if (value && req.body.fechaInicio) {
        const inicio = new Date(req.body.fechaInicio);
        const fin = new Date(value);
        if (fin <= inicio) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
      return true;
    }),

  body('deposito')
    .optional()
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('El depósito debe ser un número positivo o cero')
];

// ============================================================================
// VALIDACIONES PARA VENTAS
// ============================================================================

export const validarVenta = [
  // Referencia a la propiedad
  body('property')
    .isMongoId()
    .withMessage('La referencia a la propiedad debe ser un ID válido'),

  // Referencia al prospecto
  body('prospect')
    .isMongoId()
    .withMessage('La referencia al prospecto debe ser un ID válido'),

  // Validaciones de precio
  body('pricing.totalPrice')
    .isNumeric()
    .custom(value => value > 0)
    .withMessage('El precio total debe ser un número positivo'),

  body('pricing.currency')
    .optional()
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Moneda inválida'),

  body('pricing.depositPercentage')
    .isNumeric()
    .custom(value => value >= 0 && value <= 100)
    .withMessage('El porcentaje de seña debe estar entre 0 y 100'),

  body('pricing.paymentMethod')
    .optional()
    .isIn(['efectivo', 'transferencia', 'cheque', 'credito_hipotecario', 'mixto'])
    .withMessage('Método de pago inválido'),

  // Fechas
  body('expectedClosingDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha esperada de cierre debe ser una fecha válida')
    .custom((value) => {
      if (value) {
        const closingDate = new Date(value);
        const today = new Date();
        if (closingDate <= today) {
          throw new Error('La fecha esperada de cierre debe ser posterior a hoy');
        }
      }
      return true;
    }),

  // Comisión
  body('commission.percentage')
    .optional()
    .isNumeric()
    .custom(value => value >= 0 && value <= 100)
    .withMessage('El porcentaje de comisión debe estar entre 0 y 100'),

  // Notas
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Las notas no pueden exceder 2000 caracteres'),

  // Información adicional
  body('additionalInfo.financingRequired')
    .optional()
    .isBoolean()
    .withMessage('El campo financiamiento requerido debe ser verdadero o falso'),

  body('additionalInfo.bankApproval')
    .optional()
    .isBoolean()
    .withMessage('El campo aprobación bancaria debe ser verdadero o falso'),

  body('additionalInfo.legalReview')
    .optional()
    .isBoolean()
    .withMessage('El campo revisión legal debe ser verdadero o falso'),

  body('additionalInfo.inspectionCompleted')
    .optional()
    .isBoolean()
    .withMessage('El campo inspección completada debe ser verdadero o falso')
];

export const validarActualizacionVenta = [
  // Validaciones de precio (opcionales para actualización)
  body('pricing.totalPrice')
    .optional()
    .isNumeric()
    .custom(value => value > 0)
    .withMessage('El precio total debe ser un número positivo'),

  body('pricing.currency')
    .optional()
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Moneda inválida'),

  body('pricing.depositPercentage')
    .optional()
    .isNumeric()
    .custom(value => value >= 0 && value <= 100)
    .withMessage('El porcentaje de seña debe estar entre 0 y 100'),

  body('pricing.paymentMethod')
    .optional()
    .isIn(['efectivo', 'transferencia', 'cheque', 'credito_hipotecario', 'mixto'])
    .withMessage('Método de pago inválido'),

  // Fechas
  body('dates.expectedClosingDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha esperada de cierre debe ser una fecha válida'),

  body('dates.depositDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de depósito debe ser una fecha válida'),

  body('dates.contractSignDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de firma de contrato debe ser una fecha válida'),

  // Comisión
  body('commission.percentage')
    .optional()
    .isNumeric()
    .custom(value => value >= 0 && value <= 100)
    .withMessage('El porcentaje de comisión debe estar entre 0 y 100'),

  body('commission.paid')
    .optional()
    .isBoolean()
    .withMessage('El estado de pago de comisión debe ser verdadero o falso'),

  body('commission.paidDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de pago de comisión debe ser una fecha válida'),

  // Notas
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Las notas no pueden exceder 2000 caracteres'),

  // Información adicional
  body('additionalInfo.financingRequired')
    .optional()
    .isBoolean()
    .withMessage('El campo financiamiento requerido debe ser verdadero o falso'),

  body('additionalInfo.bankApproval')
    .optional()
    .isBoolean()
    .withMessage('El campo aprobación bancaria debe ser verdadero o falso'),

  body('additionalInfo.legalReview')
    .optional()
    .isBoolean()
    .withMessage('El campo revisión legal debe ser verdadero o falso'),

  body('additionalInfo.inspectionCompleted')
    .optional()
    .isBoolean()
    .withMessage('El campo inspección completada debe ser verdadero o falso')
];

export const validarEstadoVenta = [
  body('status')
    .isIn(['borrador', 'pendiente', 'señada', 'escriturada', 'cancelada', 'suspendida'])
    .withMessage('Estado de venta inválido'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La razón del cambio de estado no puede exceder 500 caracteres')
];