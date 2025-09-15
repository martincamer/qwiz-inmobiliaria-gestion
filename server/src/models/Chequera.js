import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Schema para movimientos de cheques (ingresos/egresos)
const movimientoChequeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    tipo: {
      type: String,
      enum: ["ingreso", "egreso"],
      required: [true, "El tipo de movimiento es requerido"],
    },
    chequeId: {
      type: String,
      required: [true, "El ID del cheque es requerido"],
    },
    monto: {
      type: Number,
      required: [true, "El monto del movimiento es requerido"],
      min: [0, "El monto debe ser mayor a 0"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha del movimiento es requerida"],
      default: Date.now,
    },
    concepto: {
      type: String,
      trim: true,
      maxlength: [200, "El concepto no puede exceder 200 caracteres"],
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [300, "Las observaciones no pueden exceder 300 caracteres"],
    },
    movementId: {
      type: String,
      ref: "Movement",
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

// Schema para cheques disponibles
const chequeDisponibleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    numero: {
      type: String,
      required: [true, "El número de cheque es requerido"],
      trim: true,
    },
    tipo: {
      type: String,
      enum: ["propio", "tercero"],
      required: [true, "El tipo de cheque es requerido"],
    },
    monto: {
      type: Number,
      required: [true, "El monto del cheque es requerido"],
      min: [0, "El monto debe ser mayor a 0"],
    },
    fechaEmision: {
      type: Date,
      required: [true, "La fecha de emisión es requerida"],
    },
    fechaVencimiento: {
      type: Date,
      required: [true, "La fecha de vencimiento es requerida"],
    },
    estado: {
      type: String,
      enum: [
        "disponible",
        "emitido",
        "cobrado",
        "rechazado",
        "vencido",
        "anulado",
        "depositado",
        "endosado",
      ],
      default: "disponible",
    },
    // Datos del cliente/beneficiario
    cliente: {
      nombre: {
        type: String,
        trim: true,
      },
      cuit: {
        type: String,
        trim: true,
      },
      telefono: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      direccion: {
        type: String,
        trim: true,
      },
    },
    // Datos del emisor (para cheques de terceros)
    emisor: {
      nombre: {
        type: String,
        trim: true,
      },
      cuit: {
        type: String,
        trim: true,
      },
      banco: {
        type: String,
        trim: true,
      },
      numeroCuenta: {
        type: String,
        trim: true,
      },
      sucursal: {
        type: String,
        trim: true,
      },
      telefono: {
        type: String,
        trim: true,
      },
    },
    // Datos bancarios del cheque
    datosBancarios: {
      banco: {
        type: String,
        trim: true,
      },
      sucursal: {
        type: String,
        trim: true,
      },
      numeroCuenta: {
        type: String,
        trim: true,
      },
      codigoBanco: {
        type: String,
        trim: true,
      },
    },
    concepto: {
      type: String,
      trim: true,
      maxlength: [200, "El concepto no puede exceder 200 caracteres"],
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [300, "Las observaciones no pueden exceder 300 caracteres"],
    },
    // Referencia al movimiento asociado
    movementId: {
      type: String,
      ref: "Movement",
    },
    // Historial de cambios de estado
    historialEstados: [
      {
        estadoAnterior: {
          type: String,
          enum: [
            "disponible",
            "emitido",
            "cobrado",
            "rechazado",
            "vencido",
            "anulado",
            "depositado",
            "endosado",
          ],
        },
        estadoNuevo: {
          type: String,
          enum: [
            "disponible",
            "emitido",
            "cobrado",
            "rechazado",
            "vencido",
            "anulado",
            "depositado",
            "endosado",
          ],
        },
        fecha: {
          type: Date,
          default: Date.now,
        },
        motivo: {
          type: String,
          trim: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
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

// Schema principal de la chequera
const chequeraSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    // Información básica de la chequera
    nombre: {
      type: String,
      required: [true, "El nombre de la chequera es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    tipo: {
      type: String,
      enum: ["propia", "terceros"],
      required: [true, "El tipo de chequera es requerido"],
      default: "propia",
    },
    // Datos bancarios de la chequera
    banco: {
      type: String,
      required: [true, "El banco es requerido"],
      trim: true,
    },
    numeroCuenta: {
      type: String,
      required: function () {
        return this.tipo === "propia";
      },
      trim: true,
    },
    sucursal: {
      type: String,
      trim: true,
    },
    codigoBanco: {
      type: String,
      trim: true,
    },
    // Datos del titular
    titular: {
      type: String,
      required: [true, "El titular es requerido"],
      trim: true,
    },
    cuit: {
      type: String,
      trim: true,
    },
    // Configuración de numeración (solo para chequeras propias)
    rangoDesde: {
      type: Number,
      required: function () {
        return this.tipo === "propia";
      },
    },
    rangoHasta: {
      type: Number,
      required: function () {
        return this.tipo === "propia";
      },
    },
    proximoCheque: {
      type: Number,
      default: function () {
        return this.rangoDesde || 1;
      },
    },
    // Estado de la chequera
    isActive: {
      type: Boolean,
      default: true,
    },
    // Arrays de subdocumentos
    movimientos: [movimientoChequeSchema],
    chequesDisponibles: [chequeDisponibleSchema],

    // Metadatos
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

// Método para obtener el próximo número de cheque (solo para chequeras propias)
chequeraSchema.methods.getNextChequeNumber = function () {
  if (this.tipo !== "propia") {
    throw new Error("Este método solo es válido para chequeras propias");
  }

  if (this.proximoCheque > this.rangoHasta) {
    throw new Error("No hay más cheques disponibles en esta chequera");
  }

  const numero = this.proximoCheque;
  this.proximoCheque += 1;
  return numero;
};

// Método para emitir un cheque propio
chequeraSchema.methods.emitirChequePropio = function (chequeData, userId) {
  if (this.tipo !== "propia") {
    throw new Error("Este método solo es válido para chequeras propias");
  }

  const numero = this.getNextChequeNumber();

  const cheque = {
    numero: numero.toString(),
    tipo: "propio",
    monto: chequeData.monto,
    fechaEmision: chequeData.fechaEmision || new Date(),
    fechaVencimiento: chequeData.fechaVencimiento,
    estado: "emitido",
    cliente: chequeData.cliente,
    datosBancarios: {
      banco: this.banco,
      sucursal: this.sucursal,
      numeroCuenta: this.numeroCuenta,
      codigoBanco: this.codigoBanco,
    },
    concepto: chequeData.concepto,
    observaciones: chequeData.observaciones,
    movementId: chequeData.movementId,
    historialEstados: [
      {
        estadoAnterior: "disponible",
        estadoNuevo: "emitido",
        fecha: new Date(),
        motivo: "Emisión de cheque",
        createdBy: userId,
      },
    ],
    createdBy: userId,
  };

  this.chequesDisponibles.push(cheque);

  // Crear movimiento de egreso
  const movimiento = {
    tipo: "egreso",
    chequeId: cheque.id,
    monto: cheque.monto,
    fecha: cheque.fechaEmision,
    concepto: cheque.concepto,
    observaciones: cheque.observaciones,
    movementId: cheque.movementId,
    createdBy: userId,
  };

  this.movimientos.push(movimiento);
  this.lastModifiedBy = userId;

  return { cheque, movimiento };
};

// Método para agregar un cheque de terceros
chequeraSchema.methods.agregarChequeTerceros = function (chequeData, userId) {
  if (this.tipo !== "terceros") {
    throw new Error("Este método solo es válido para chequeras de terceros");
  }

  // Verificar que no exista un cheque con el mismo número del mismo emisor
  const existingCheque = this.chequesDisponibles.find(
    (cheque) =>
      cheque.numero === chequeData.numero.toString() &&
      cheque.emisor?.cuit === chequeData.emisor?.cuit
  );

  if (existingCheque) {
    throw new Error("Ya existe un cheque con ese número del mismo emisor");
  }

  const cheque = {
    numero: chequeData.numero.toString(),
    tipo: "tercero",
    monto: chequeData.monto,
    fechaEmision: chequeData.fechaEmision,
    fechaVencimiento: chequeData.fechaVencimiento,
    estado: chequeData.estado || "disponible",
    cliente: chequeData.cliente,
    emisor: chequeData.emisor,
    datosBancarios: {
      banco: chequeData.emisor?.banco,
      sucursal: chequeData.emisor?.sucursal,
      numeroCuenta: chequeData.emisor?.numeroCuenta,
    },
    concepto: chequeData.concepto,
    observaciones: chequeData.observaciones,
    movementId: chequeData.movementId,
    historialEstados: [
      {
        estadoAnterior: null,
        estadoNuevo: chequeData.estado || "disponible",
        fecha: new Date(),
        motivo: "Ingreso de cheque de terceros",
        createdBy: userId,
      },
    ],
    createdBy: userId,
  };

  this.chequesDisponibles.push(cheque);

  // Crear movimiento de ingreso
  const movimiento = {
    tipo: "ingreso",
    chequeId: cheque.id,
    monto: cheque.monto,
    fecha: cheque.fechaEmision,
    concepto: cheque.concepto,
    observaciones: cheque.observaciones,
    movementId: cheque.movementId,
    createdBy: userId,
  };

  this.movimientos.push(movimiento);
  this.lastModifiedBy = userId;

  return { cheque, movimiento };
};

// Método para cambiar estado de un cheque
chequeraSchema.methods.cambiarEstadoCheque = function (
  chequeId,
  nuevoEstado,
  motivo,
  userId
) {
  const cheque = this.chequesDisponibles.id(chequeId);
  if (!cheque) {
    throw new Error("Cheque no encontrado");
  }

  const estadoAnterior = cheque.estado;
  cheque.estado = nuevoEstado;

  // Agregar al historial de estados
  cheque.historialEstados.push({
    estadoAnterior,
    estadoNuevo: nuevoEstado,
    fecha: new Date(),
    motivo: motivo || `Cambio de estado a ${nuevoEstado}`,
    createdBy: userId,
  });

  this.lastModifiedBy = userId;

  return cheque;
};

// Método para obtener cheques por estado
chequeraSchema.methods.getChequesByEstado = function (estado) {
  return this.chequesDisponibles.filter((cheque) => cheque.estado === estado);
};

// Método para obtener cheques por tipo
chequeraSchema.methods.getChequesByTipo = function (tipo) {
  return this.chequesDisponibles.filter((cheque) => cheque.tipo === tipo);
};

// Método para obtener movimientos por tipo
chequeraSchema.methods.getMovimientosByTipo = function (tipo) {
  return this.movimientos.filter((movimiento) => movimiento.tipo === tipo);
};

// Método para obtener cheques de terceros por emisor
chequeraSchema.methods.getChequesByEmisor = function (emisorCuit) {
  if (this.tipo !== "terceros") {
    throw new Error("Este método solo es válido para chequeras de terceros");
  }

  return this.chequesDisponibles.filter(
    (cheque) => cheque.emisor && cheque.emisor.cuit === emisorCuit
  );
};

// Método para obtener resumen de la chequera
chequeraSchema.methods.getResumen = function () {
  const totalCheques = this.chequesDisponibles.length;
  const chequesPropios = this.chequesDisponibles.filter(
    (c) => c.tipo === "propio"
  ).length;
  const chequesTerceros = this.chequesDisponibles.filter(
    (c) => c.tipo === "tercero"
  ).length;

  const chequesPorEstado = {};
  const estadosValidos = [
    "disponible",
    "emitido",
    "cobrado",
    "rechazado",
    "vencido",
    "anulado",
    "depositado",
    "endosado",
  ];

  estadosValidos.forEach((estado) => {
    chequesPorEstado[estado] = this.chequesDisponibles.filter(
      (c) => c.estado === estado
    ).length;
  });

  const totalIngresos = this.movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((sum, m) => sum + m.monto, 0);

  const totalEgresos = this.movimientos
    .filter((m) => m.tipo === "egreso")
    .reduce((sum, m) => sum + m.monto, 0);

  return {
    totalCheques,
    chequesPropios,
    chequesTerceros,
    chequesPorEstado,
    totalMovimientos: this.movimientos.length,
    totalIngresos,
    totalEgresos,
    saldo: totalIngresos - totalEgresos,
    chequesDisponiblesPropia:
      this.tipo === "propia" ? this.rangoHasta - this.proximoCheque + 1 : null,
  };
};

// Método para validar datos del emisor
chequeraSchema.methods.validarEmisor = function (emisorData) {
  if (this.tipo !== "terceros") {
    return true; // No se requiere validación para chequeras propias
  }

  if (!emisorData) {
    throw new Error(
      "Los datos del emisor son requeridos para cheques de terceros"
    );
  }

  if (!emisorData.nombre || !emisorData.cuit) {
    throw new Error("El nombre y CUIT del emisor son requeridos");
  }

  return true;
};

// Índices para mejorar el rendimiento
chequeraSchema.index({ companyId: 1, isActive: 1 });
chequeraSchema.index({ userId: 1 });
chequeraSchema.index({ "chequesDisponibles.numero": 1 });
chequeraSchema.index({ "chequesDisponibles.estado": 1 });
chequeraSchema.index({ "chequesDisponibles.tipo": 1 });
chequeraSchema.index({ "chequesDisponibles.emisor.cuit": 1 });
chequeraSchema.index({ "movimientos.tipo": 1 });
chequeraSchema.index({ "movimientos.fecha": -1 });
chequeraSchema.index({ createdAt: -1 });

const Chequera = mongoose.model("Chequera", chequeraSchema);

export default Chequera;
