import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Schema para datos fiscales
const datosFiscalesSchema = new mongoose.Schema({
  condicionIva: {
    type: String,
    enum: [
      "responsable_inscripto",
      "monotributista",
      "exento",
      "consumidor_final",
      "no_responsable",
      "responsable_no_inscripto",
    ],
    required: [true, "La condición de IVA es requerida"],
  },
  cuit: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (
          this.condicionIva === "responsable_inscripto" ||
          this.condicionIva === "monotributista"
        ) {
          return v && v.length >= 11;
        }
        return true;
      },
      message:
        "CUIT es requerido para responsables inscriptos y monotributistas",
    },
  },
  ingresosBrutos: {
    numero: {
      type: String,
      trim: true,
    },
    jurisdiccion: {
      type: String,
      trim: true,
    },
    condicion: {
      type: String,
      enum: ["inscripto", "exento", "no_inscripto"],
      default: "no_inscripto",
    },
  },
  categoriaMonotributo: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    required: function () {
      return this.condicionIva === "monotributista";
    },
  },
  actividadPrincipal: {
    codigo: {
      type: String,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
  },
});

// Schema para dirección
const direccionSchema = new mongoose.Schema({
  calle: {
    type: String,
    trim: true,
  },
  numero: {
    type: String,
    trim: true,
  },
  piso: {
    type: String,
    trim: true,
  },
  departamento: {
    type: String,
    trim: true,
  },
  localidad: {
    type: String,
    trim: true,
  },
  provincia: {
    type: String,
    trim: true,
  },
  codigoPostal: {
    type: String,
    trim: true,
  },
  pais: {
    type: String,
    trim: true,
    default: "Argentina",
  },
});

// Schema para contacto
const contactoSchema = new mongoose.Schema({
  telefono: {
    type: String,
    trim: true,
  },
  celular: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Email no válido",
    },
  },
  sitioWeb: {
    type: String,
    trim: true,
  },
});

// Schema para facturas
const facturaSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    numero: {
      type: String,
      required: [true, "El número de factura es requerido"],
      trim: true,
    },
    tipo: {
      type: String,
      enum: ["A", "B", "C", "E", "M"],
      required: [true, "El tipo de factura es requerido"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha de factura es requerida"],
      default: Date.now,
    },
    fechaVencimiento: {
      type: Date,
    },
    subtotal: {
      type: Number,
      required: [true, "El subtotal es requerido"],
      min: [0, "El subtotal debe ser mayor a 0"],
    },
    iva: {
      type: Number,
      default: 0,
      min: [0, "El IVA no puede ser negativo"],
    },
    total: {
      type: Number,
      required: [true, "El total es requerido"],
      min: [0, "El total debe ser mayor a 0"],
    },
    estado: {
      type: String,
      enum: ["pendiente", "pagada", "vencida", "anulada", "parcial"],
      default: "pendiente",
    },
    concepto: {
      type: String,
      trim: true,
      maxlength: [500, "El concepto no puede exceder 500 caracteres"],
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [1000, "Las observaciones no pueden exceder 1000 caracteres"],
    },
    items: [
      {
        descripcion: {
          type: String,
          required: [true, "La descripción del item es requerida"],
          trim: true,
        },
        cantidad: {
          type: Number,
          required: [true, "La cantidad es requerida"],
          min: [0, "La cantidad debe ser mayor a 0"],
        },
        precioUnitario: {
          type: Number,
          required: [true, "El precio unitario es requerido"],
          min: [0, "El precio unitario debe ser mayor a 0"],
        },
        subtotal: {
          type: Number,
          required: [true, "El subtotal del item es requerido"],
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

// Schema para presupuestos
const presupuestoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    numero: {
      type: String,
      required: [true, "El número de presupuesto es requerido"],
      trim: true,
    },
    fecha: {
      type: Date,
      required: [true, "La fecha de presupuesto es requerida"],
      default: Date.now,
    },
    fechaVencimiento: {
      type: Date,
      required: [true, "La fecha de vencimiento es requerida"],
    },
    subtotal: {
      type: Number,
      required: [true, "El subtotal es requerido"],
      min: [0, "El subtotal debe ser mayor a 0"],
    },
    iva: {
      type: Number,
      default: 0,
      min: [0, "El IVA no puede ser negativo"],
    },
    total: {
      type: Number,
      required: [true, "El total es requerido"],
      min: [0, "El total debe ser mayor a 0"],
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado", "vencido", "facturado"],
      default: "pendiente",
    },
    concepto: {
      type: String,
      trim: true,
      maxlength: [500, "El concepto no puede exceder 500 caracteres"],
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [1000, "Las observaciones no pueden exceder 1000 caracteres"],
    },
    items: [
      {
        descripcion: {
          type: String,
          required: [true, "La descripción del item es requerida"],
          trim: true,
        },
        cantidad: {
          type: Number,
          required: [true, "La cantidad es requerida"],
          min: [0, "La cantidad debe ser mayor a 0"],
        },
        precioUnitario: {
          type: Number,
          required: [true, "El precio unitario es requerido"],
          min: [0, "El precio unitario debe ser mayor a 0"],
        },
        subtotal: {
          type: Number,
          required: [true, "El subtotal del item es requerido"],
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

// Schema para movimientos de cuenta corriente
const movimientoCuentaCorrienteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    tipo: {
      type: String,
      enum: ["debe", "haber"],
      required: [true, "El tipo de movimiento es requerido"],
    },
    concepto: {
      type: String,
      enum: [
        "factura",
        "pago_efectivo",
        "pago_bancario",
        "pago_cheque",
        "nota_credito",
        "nota_debito",
        "ajuste",
        "interes",
        "descuento",
      ],
      required: [true, "El concepto es requerido"],
    },
    monto: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [0, "El monto debe ser mayor a 0"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es requerida"],
      default: Date.now,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [300, "La descripción no puede exceder 300 caracteres"],
    },
    referencia: {
      tipo: {
        type: String,
        enum: ["factura", "presupuesto", "pago", "nota", "ajuste"],
      },
      id: {
        type: String,
      },
      numero: {
        type: String,
      },
    },
    saldoAnterior: {
      type: Number,
      required: [true, "El saldo anterior es requerido"],
    },
    saldoActual: {
      type: Number,
      required: [true, "El saldo actual es requerido"],
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

// Schema para pagos en efectivo
const pagoEfectivoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    monto: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [0, "El monto debe ser mayor a 0"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es requerida"],
      default: Date.now,
    },
    concepto: {
      type: String,
      trim: true,
      maxlength: [300, "El concepto no puede exceder 300 caracteres"],
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [500, "Las observaciones no pueden exceder 500 caracteres"],
    },
    caja: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CashBox",
        required: [true, "La caja es requerida"],
      },
      nombre: {
        type: String,
        required: [true, "El nombre de la caja es requerido"],
        trim: true,
      },
    },
    recibo: {
      numero: {
        type: String,
        trim: true,
      },
      fecha: {
        type: Date,
      },
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

// Schema para pagos bancarios
const pagoBancarioSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    monto: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [0, "El monto debe ser mayor a 0"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es requerida"],
      default: Date.now,
    },
    tipo: {
      type: String,
      enum: [
        "transferencia",
        "deposito",
        "debito_automatico",
        "tarjeta_credito",
        "tarjeta_debito",
      ],
      required: [true, "El tipo de pago bancario es requerido"],
    },
    banco: {
      type: String,
      trim: true,
    },
    numeroCuenta: {
      type: String,
      trim: true,
    },
    numeroOperacion: {
      type: String,
      trim: true,
    },
    concepto: {
      type: String,
      trim: true,
      maxlength: [300, "El concepto no puede exceder 300 caracteres"],
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [500, "Las observaciones no pueden exceder 500 caracteres"],
    },
    comprobante: {
      numero: {
        type: String,
        trim: true,
      },
      fecha: {
        type: Date,
      },
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

// Schema para pagos con cheques
const pagoChequeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    monto: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [0, "El monto debe ser mayor a 0"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es requerida"],
      default: Date.now,
    },
    tipo: {
      type: String,
      enum: ["propio", "tercero"],
      required: [true, "El tipo de cheque es requerido"],
    },
    numero: {
      type: String,
      required: [true, "El número de cheque es requerido"],
      trim: true,
    },
    banco: {
      type: String,
      required: [true, "El banco es requerido"],
      trim: true,
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
      enum: ["entregado", "depositado", "cobrado", "rechazado", "anulado"],
      default: "entregado",
    },
    emisor: {
      nombre: {
        type: String,
        trim: true,
      },
      cuit: {
        type: String,
        trim: true,
      },
    },
    concepto: {
      type: String,
      trim: true,
      maxlength: [300, "El concepto no puede exceder 300 caracteres"],
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [500, "Las observaciones no pueden exceder 500 caracteres"],
    },
    chequeraId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chequera",
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

// Schema principal del cliente
const clienteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    // Datos personales/empresariales
    tipoPersona: {
      type: String,
      enum: ["fisica", "juridica"],
      required: [true, "El tipo de persona es requerido"],
      default: "fisica",
    },
    nombreCompleto: {
      type: String,
      required: [true, "El nombre completo es requerido"],
      trim: true,
      maxlength: [200, "El nombre no puede exceder 200 caracteres"],
    },
    razonSocial: {
      type: String,
      trim: true,
      maxlength: [200, "La razón social no puede exceder 200 caracteres"],
      required: function () {
        return this.tipoPersona === "juridica";
      },
    },
    dni: {
      type: String,
      trim: true,
      required: function () {
        return this.tipoPersona === "fisica";
      },
      validate: {
        validator: function (v) {
          if (this.tipoPersona === "fisica") {
            return v && v.length >= 7 && v.length <= 8;
          }
          return true;
        },
        message: "DNI debe tener entre 7 y 8 dígitos",
      },
    },
    fechaNacimiento: {
      type: Date,
      required: function () {
        return this.tipoPersona === "fisica";
      },
    },
    nacionalidad: {
      type: String,
      trim: true,
      default: "Argentina",
    },
    estadoCivil: {
      type: String,
      enum: ["soltero", "casado", "divorciado", "viudo", "union_convivencial"],
      required: function () {
        return this.tipoPersona === "fisica";
      },
    },
    profesion: {
      type: String,
      trim: true,
    },

    // Datos fiscales
    datosFiscales: datosFiscalesSchema,

    // Datos de contacto
    contacto: contactoSchema,

    // Direcciones
    direccionFiscal: direccionSchema,
    direccionComercial: direccionSchema,

    // Estado del cliente
    estado: {
      type: String,
      enum: ["activo", "inactivo", "suspendido", "moroso"],
      default: "activo",
    },

    // Configuración comercial
    configuracionComercial: {
      limiteCredito: {
        type: Number,
        default: 0,
        min: [0, "El límite de crédito no puede ser negativo"],
      },
      diasCredito: {
        type: Number,
        default: 0,
        min: [0, "Los días de crédito no pueden ser negativos"],
      },
      descuentoGeneral: {
        type: Number,
        default: 0,
        min: [0, "El descuento no puede ser negativo"],
        max: [100, "El descuento no puede ser mayor a 100%"],
      },
      vendedorAsignado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      observacionesComerciales: {
        type: String,
        trim: true,
        maxlength: [
          1000,
          "Las observaciones no pueden exceder 1000 caracteres",
        ],
      },
    },

    // Saldos y cuenta corriente
    saldoActual: {
      type: Number,
      default: 0,
    },
    saldoAnterior: {
      type: Number,
      default: 0,
    },

    // Arrays de subdocumentos
    facturas: [facturaSchema],
    presupuestos: [presupuestoSchema],
    cuentaCorriente: [movimientoCuentaCorrienteSchema],
    pagosEfectivo: [pagoEfectivoSchema],
    pagosBancarios: [pagoBancarioSchema],
    pagosCheques: [pagoChequeSchema],

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

// Métodos del cliente

// Método para agregar factura
clienteSchema.methods.agregarFactura = function (facturaData, userId) {
  const factura = {
    ...facturaData,
    createdBy: userId,
  };

  this.facturas.push(factura);

  // Agregar movimiento a cuenta corriente
  const movimiento = {
    tipo: "debe",
    concepto: "factura",
    monto: factura.total,
    fecha: factura.fecha,
    descripcion: `Factura ${factura.numero}`,
    referencia: {
      tipo: "factura",
      id: factura.id,
      numero: factura.numero,
    },
    saldoAnterior: this.saldoActual,
    saldoActual: this.saldoActual + factura.total,
    createdBy: userId,
  };

  this.cuentaCorriente.push(movimiento);
  this.saldoAnterior = this.saldoActual;
  this.saldoActual += factura.total;
  this.lastModifiedBy = userId;

  return { factura, movimiento };
};

// Método para agregar presupuesto
clienteSchema.methods.agregarPresupuesto = function (presupuestoData, userId) {
  const presupuesto = {
    ...presupuestoData,
    createdBy: userId,
  };

  this.presupuestos.push(presupuesto);
  this.lastModifiedBy = userId;

  return presupuesto;
};

// Método para registrar pago en efectivo
clienteSchema.methods.registrarPagoEfectivo = async function (
  pagoData,
  userId,
  numeroRecibo = null
) {
  // Importar Counter y CashBox aquí para evitar dependencias circulares
  const Counter = mongoose.model("Counter");
  const CashBox = mongoose.model("CashBox");

  // Generar número de recibo automáticamente si no se proporciona
  let reciboNumero = numeroRecibo;
  if (!reciboNumero) {
    try {
      const numeroData = await Counter.getNextNumber(
        this.companyId,
        "recibo_efectivo",
        userId
      );
      reciboNumero = numeroData.numero;
    } catch (error) {
      console.error("Error al generar número de recibo:", error);
      // Si falla la generación automática, usar timestamp como fallback
      reciboNumero = `REC-${Date.now()}`;
    }
  }

  const pago = {
    ...pagoData,
    recibo: {
      numero: reciboNumero,
      fecha: pagoData.fecha || new Date(),
    },
    createdBy: userId,
  };

  this.pagosEfectivo.push(pago);

  // Agregar movimiento a cuenta corriente
  const movimiento = {
    tipo: "haber",
    concepto: "pago_efectivo",
    monto: pago.monto,
    fecha: pago.fecha,
    descripcion: `Pago en efectivo - Recibo ${reciboNumero} - ${
      pago.concepto || "Sin concepto"
    }`,
    referencia: {
      tipo: "pago",
      id: pago.id,
      numero: reciboNumero,
    },
    saldoAnterior: this.saldoActual,
    saldoActual: this.saldoActual - pago.monto,
    createdBy: userId,
  };

  this.cuentaCorriente.push(movimiento);
  this.saldoAnterior = this.saldoActual;
  this.saldoActual -= pago.monto;
  this.lastModifiedBy = userId;

  // Registrar movimiento en la caja si se especifica
  let movimientoCaja = null;
  if (pagoData.caja && pagoData.caja.id) {
    try {
      const caja = await CashBox.findById(pagoData.caja.id);
      if (caja) {
        const movimientoData = {
          type: "ingreso",
          amount: pago.monto,
          description: `Pago de cliente: ${
            this.nombreCompleto || this.razonSocial
          } - Recibo ${reciboNumero}`,
          reference: `Recibo ${reciboNumero} - ${
            this.nombreCompleto || this.razonSocial
          }`,
          category: "pagos_clientes",
          paymentMethod: "efectivo",
        };

        movimientoCaja = caja.addMovement(movimientoData, userId);
        await caja.save();
      }
    } catch (error) {
      console.error("Error al registrar movimiento en caja:", error);
      // No fallar el pago si hay error en la caja, solo registrar el error
    }
  }

  return { pago, movimiento, movimientoCaja };
};

// Método para registrar pago bancario
clienteSchema.methods.registrarPagoBancario = function (pagoData, userId) {
  const pago = {
    ...pagoData,
    createdBy: userId,
  };

  this.pagosBancarios.push(pago);

  // Agregar movimiento a cuenta corriente
  const movimiento = {
    tipo: "haber",
    concepto: "pago_bancario",
    monto: pago.monto,
    fecha: pago.fecha,
    descripcion: `Pago ${pago.tipo} - ${pago.concepto || "Sin concepto"}`,
    saldoAnterior: this.saldoActual,
    saldoActual: this.saldoActual - pago.monto,
    createdBy: userId,
  };

  this.cuentaCorriente.push(movimiento);
  this.saldoAnterior = this.saldoActual;
  this.saldoActual -= pago.monto;
  this.lastModifiedBy = userId;

  return { pago, movimiento };
};

// Método para registrar pago con cheque
clienteSchema.methods.registrarPagoCheque = function (pagoData, userId) {
  const pago = {
    ...pagoData,
    createdBy: userId,
  };

  this.pagosCheques.push(pago);

  // Agregar movimiento a cuenta corriente
  const movimiento = {
    tipo: "haber",
    concepto: "pago_cheque",
    monto: pago.monto,
    fecha: pago.fecha,
    descripcion: `Pago cheque ${pago.tipo} N° ${pago.numero} - ${
      pago.concepto || "Sin concepto"
    }`,
    saldoAnterior: this.saldoActual,
    saldoActual: this.saldoActual - pago.monto,
    createdBy: userId,
  };

  this.cuentaCorriente.push(movimiento);
  this.saldoAnterior = this.saldoActual;
  this.saldoActual -= pago.monto;
  this.lastModifiedBy = userId;

  return { pago, movimiento };
};

// Método para obtener resumen del cliente
clienteSchema.methods.getResumen = function () {
  const totalFacturas = this.facturas.reduce((sum, f) => sum + f.total, 0);
  const totalPresupuestos = this.presupuestos.reduce(
    (sum, p) => sum + p.total,
    0
  );
  const totalPagosEfectivo = this.pagosEfectivo.reduce(
    (sum, p) => sum + p.monto,
    0
  );
  const totalPagosBancarios = this.pagosBancarios.reduce(
    (sum, p) => sum + p.monto,
    0
  );
  const totalPagosCheques = this.pagosCheques.reduce(
    (sum, p) => sum + p.monto,
    0
  );

  const facturasPendientes = this.facturas.filter(
    (f) => f.estado === "pendiente"
  );
  const facturasVencidas = this.facturas.filter((f) => {
    return (
      f.estado === "pendiente" &&
      f.fechaVencimiento &&
      new Date(f.fechaVencimiento) < new Date()
    );
  });

  return {
    saldoActual: this.saldoActual,
    saldoAnterior: this.saldoAnterior,
    totalFacturas,
    totalPresupuestos,
    totalPagos: totalPagosEfectivo + totalPagosBancarios + totalPagosCheques,
    totalPagosEfectivo,
    totalPagosBancarios,
    totalPagosCheques,
    cantidadFacturas: this.facturas.length,
    cantidadPresupuestos: this.presupuestos.length,
    cantidadPagos:
      this.pagosEfectivo.length +
      this.pagosBancarios.length +
      this.pagosCheques.length,
    facturasPendientes: facturasPendientes.length,
    facturasVencidas: facturasVencidas.length,
    montoFacturasPendientes: facturasPendientes.reduce(
      (sum, f) => sum + f.total,
      0
    ),
    montoFacturasVencidas: facturasVencidas.reduce(
      (sum, f) => sum + f.total,
      0
    ),
    ultimaFactura:
      this.facturas.length > 0 ? this.facturas[this.facturas.length - 1] : null,
    ultimoPago:
      this.cuentaCorriente.filter((m) => m.tipo === "haber").slice(-1)[0] ||
      null,
  };
};

// Método para obtener estado crediticio
clienteSchema.methods.getEstadoCrediticio = function () {
  const resumen = this.getResumen();
  const limiteCredito = this.configuracionComercial?.limiteCredito || 0;
  const diasCredito = this.configuracionComercial?.diasCredito || 0;

  let estado = "normal";
  let observaciones = [];

  if (this.saldoActual > limiteCredito) {
    estado = "excedido";
    observaciones.push("Límite de crédito excedido");
  }

  if (resumen.facturasVencidas > 0) {
    estado = "moroso";
    observaciones.push(`${resumen.facturasVencidas} facturas vencidas`);
  }

  if (this.estado === "suspendido") {
    estado = "suspendido";
    observaciones.push("Cliente suspendido");
  }

  return {
    estado,
    saldoActual: this.saldoActual,
    limiteCredito,
    creditoDisponible: Math.max(0, limiteCredito - this.saldoActual),
    diasCredito,
    observaciones,
  };
};

// Índices para mejorar el rendimiento
clienteSchema.index({ companyId: 1, estado: 1 });
clienteSchema.index({ userId: 1 });
clienteSchema.index({ nombreCompleto: "text", razonSocial: "text" });
clienteSchema.index({ "datosFiscales.cuit": 1 });
clienteSchema.index({ dni: 1 });
clienteSchema.index({ "contacto.email": 1 });
clienteSchema.index({ saldoActual: -1 });
clienteSchema.index({ "facturas.estado": 1 });
clienteSchema.index({ "facturas.fechaVencimiento": 1 });
clienteSchema.index({ "cuentaCorriente.fecha": -1 });
clienteSchema.index({ createdAt: -1 });

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;
