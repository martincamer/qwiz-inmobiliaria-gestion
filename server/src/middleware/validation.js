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