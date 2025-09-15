import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const movementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    movementNumber: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["ingreso", "egreso", "transferencia"],
      required: [true, "El tipo de movimiento es requerido"],
    },
    amount: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [0, "El monto debe ser mayor a 0"],
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
      maxlength: [200, "La descripción no puede exceder 200 caracteres"],
    },
    reference: {
      type: String,
      trim: true,
      maxlength: [50, "La referencia no puede exceder 50 caracteres"],
    },
    category: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        "efectivo",
        "transferencia",
        "cheque",
        "tarjeta_credito",
        "tarjeta_debito",
        "otro",
      ],
      default: "efectivo",
    },
    relatedCashBoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CashBox",
      required: function () {
        return this.type === "transferencia";
      },
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cashBoxSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    name: {
      type: String,
      required: [true, "El nombre de la caja es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "La descripción no puede exceder 300 caracteres"],
    },
    currentBalance: {
      type: Number,
      default: 0,
      min: [0, "El saldo no puede ser negativo"],
    },
    previousBalance: {
      type: Number,
      default: 0,
    },
    initialBalance: {
      type: Number,
      default: 0,
      min: [0, "El saldo inicial no puede ser negativo"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      default: "ARS",
      enum: ["ARS", "USD", "EUR"],
    },
    movements: [movementSchema],
    lastMovementNumber: {
      type: Number,
      default: 0,
    },
    companyId: {
      type: String,
      required: [true, "El ID de la empresa es requerido"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID del usuario es requerido"],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para generar número de movimiento automático
cashBoxSchema.methods.getNextMovementNumber = function () {
  this.lastMovementNumber += 1;
  return this.lastMovementNumber;
};

// Método para agregar movimiento
cashBoxSchema.methods.addMovement = function (movementData, userId) {
  const movementNumber = this.getNextMovementNumber();

  // Calcular nuevo saldo
  let newBalance = this.currentBalance;
  if (movementData.type === "ingreso") {
    newBalance += movementData.amount;
  } else if (movementData.type === "egreso") {
    newBalance -= movementData.amount;
  } else if (movementData.type === "transferencia") {
    // Para transferencias, el monto se resta de la caja origen
    newBalance -= movementData.amount;
  }

  // Validar que el saldo no sea negativo
  if (newBalance < 0) {
    throw new Error("Saldo insuficiente para realizar el movimiento");
  }

  const movement = {
    movementNumber,
    type: movementData.type,
    amount: movementData.amount,
    description: movementData.description,
    reference: movementData.reference,
    category: movementData.category,
    paymentMethod: movementData.paymentMethod || "efectivo",
    relatedCashBoxId: movementData.relatedCashBoxId,
    balanceAfter: newBalance,
    createdBy: userId,
  };

  this.movements.push(movement);
  this.previousBalance = this.currentBalance;
  this.currentBalance = newBalance;
  this.lastModifiedBy = userId;

  return movement;
};

// Método para obtener movimientos paginados
cashBoxSchema.methods.getMovements = function (
  page = 1,
  limit = 20,
  filters = {}
) {
  let movements = [...this.movements];

  // Aplicar filtros
  if (filters.type) {
    movements = movements.filter((m) => m.type === filters.type);
  }
  if (filters.dateFrom) {
    movements = movements.filter(
      (m) => m.createdAt >= new Date(filters.dateFrom)
    );
  }
  if (filters.dateTo) {
    movements = movements.filter(
      (m) => m.createdAt <= new Date(filters.dateTo)
    );
  }
  if (filters.category) {
    movements = movements.filter((m) => m.category === filters.category);
  }

  // Ordenar por fecha descendente
  movements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMovements = movements.slice(startIndex, endIndex);

  return {
    movements: paginatedMovements,
    totalMovements: movements.length,
    currentPage: page,
    totalPages: Math.ceil(movements.length / limit),
    hasNextPage: endIndex < movements.length,
    hasPrevPage: startIndex > 0,
  };
};

// Método para obtener resumen de la caja
cashBoxSchema.methods.getSummary = function (dateFrom, dateTo) {
  let movements = [...this.movements];

  if (dateFrom || dateTo) {
    movements = movements.filter((m) => {
      const movementDate = new Date(m.createdAt);
      if (dateFrom && movementDate < new Date(dateFrom)) return false;
      if (dateTo && movementDate > new Date(dateTo)) return false;
      return true;
    });
  }

  const summary = {
    totalIngresos: 0,
    totalEgresos: 0,
    totalTransferenciasOut: 0,
    totalTransferenciasIn: 0,
    totalMovements: movements.length,
    currentBalance: this.currentBalance,
    previousBalance: this.previousBalance,
  };

  movements.forEach((movement) => {
    switch (movement.type) {
      case "ingreso":
        summary.totalIngresos += movement.amount;
        break;
      case "egreso":
        summary.totalEgresos += movement.amount;
        break;
      case "transferencia":
        summary.totalTransferenciasOut += movement.amount;
        break;
    }
  });

  summary.netMovement = summary.totalIngresos - summary.totalEgresos;

  return summary;
};

// Índices para mejorar el rendimiento
cashBoxSchema.index({ companyId: 1, isActive: 1 });
cashBoxSchema.index({ userId: 1 });
cashBoxSchema.index({ "movements.movementNumber": 1 });
cashBoxSchema.index({ "movements.type": 1 });
cashBoxSchema.index({ "movements.createdAt": -1 });
cashBoxSchema.index({ createdAt: -1 });

const CashBox = mongoose.model("CashBox", cashBoxSchema);

export default CashBox;
