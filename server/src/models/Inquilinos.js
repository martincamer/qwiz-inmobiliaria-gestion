import mongoose from "mongoose";

const inquilinosSchema = new mongoose.Schema(
  {
    // Información personal
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es requerido"],
      trim: true,
      maxlength: [100, "El apellido no puede exceder 100 caracteres"],
    },
    tipoDocumento: {
      type: String,
      enum: ["DNI", "CUIT", "CUIL", "Pasaporte", "Cedula"],
      required: [true, "El tipo de documento es requerido"],
    },
    numeroDocumento: {
      type: String,
      required: [true, "El número de documento es requerido"],
      trim: true,
      unique: true,
    },
    fechaNacimiento: {
      type: Date,
    },
    nacionalidad: {
      type: String,
      default: "Argentina",
      trim: true,
    },
    estadoCivil: {
      type: String,
      enum: ["soltero", "casado", "divorciado", "viudo", "union_convivencial"],
    },
    ocupacion: {
      type: String,
      trim: true,
    },

    // Información de contacto
    contacto: {
      telefono: {
        type: String,
        required: [true, "El teléfono es requerido"],
        trim: true,
      },
      telefonoAlternativo: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        required: [true, "El email es requerido"],
        trim: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Por favor ingresa un email válido",
        ],
      },
      emailAlternativo: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },

    // Dirección actual
    direccionActual: {
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
      barrio: {
        type: String,
        trim: true,
      },
      ciudad: {
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
        default: "Argentina",
        trim: true,
      },
    },

    // Información laboral
    datosLaborales: {
      empresa: {
        type: String,
        trim: true,
      },
      cargo: {
        type: String,
        trim: true,
      },
      antiguedad: {
        type: Number, // en meses
        min: [0, "La antigüedad no puede ser negativa"],
      },
      ingresosMensuales: {
        type: Number,
        min: [0, "Los ingresos no pueden ser negativos"],
      },
      monedaIngresos: {
        type: String,
        enum: ["ARS", "USD", "EUR"],
        default: "ARS",
      },
      telefonoEmpresa: {
        type: String,
        trim: true,
      },
      direccionEmpresa: {
        type: String,
        trim: true,
      },
    },

    // Información fiscal
    datosFiscales: {
      cuit: {
        type: String,
        trim: true,
        match: [
          /^\d{2}-\d{8}-\d{1}$/,
          "El CUIT debe tener el formato XX-XXXXXXXX-X",
        ],
      },
      condicionIva: {
        type: String,
        enum: [
          "Responsable Inscripto",
          "Monotributista",
          "Exento",
          "No Responsable",
          "Consumidor Final",
        ],
        default: "Consumidor Final",
      },
    },

    // Información bancaria
    datosBancarios: {
      banco: {
        type: String,
        trim: true,
      },
      tipoCuenta: {
        type: String,
        enum: ["caja_ahorro", "cuenta_corriente"],
      },
      numeroCuenta: {
        type: String,
        trim: true,
      },
      cbu: {
        type: String,
        trim: true,
        match: [/^\d{22}$/, "El CBU debe tener 22 dígitos"],
      },
      alias: {
        type: String,
        trim: true,
      },
    },

    // Referencias personales
    referencias: [{
      nombre: {
        type: String,
        required: true,
        trim: true,
      },
      telefono: {
        type: String,
        required: true,
        trim: true,
      },
      relacion: {
        type: String,
        enum: ["familiar", "laboral", "personal", "comercial"],
        required: true,
      },
      observaciones: {
        type: String,
        trim: true,
      },
    }],

    // Estado del inquilino
    estado: {
      type: String,
      enum: ["activo", "inactivo", "suspendido", "moroso"],
      default: "activo",
    },

    // Contratos asociados
    contratos: [{
      tipo: {
        type: String,
        enum: ["alquiler", "venta"],
        required: true,
      },
      propiedad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Propiedades",
        required: true,
      },
      propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Propietarios",
        required: true,
      },
      fechaInicio: {
        type: Date,
        required: true,
      },
      fechaFin: {
        type: Date,
        required: true,
      },
      montoMensual: {
        type: Number,
        required: true,
        min: [0, "El monto no puede ser negativo"],
      },
      moneda: {
        type: String,
        enum: ["ARS", "USD", "EUR"],
        default: "ARS",
      },
      deposito: {
        type: Number,
        min: [0, "El depósito no puede ser negativo"],
        default: 0,
      },
      comision: {
        type: Number,
        min: [0, "La comisión no puede ser negativa"],
        default: 0,
      },
      expensas: {
        type: Number,
        min: [0, "Las expensas no pueden ser negativas"],
        default: 0,
      },
      diaVencimiento: {
        type: Number,
        min: [1, "El día debe ser entre 1 y 31"],
        max: [31, "El día debe ser entre 1 y 31"],
        default: 10,
      },
      estado: {
        type: String,
        enum: ["activo", "finalizado", "rescindido", "vencido"],
        default: "activo",
      },
      observaciones: {
        type: String,
        trim: true,
      },
      fechaCreacion: {
        type: Date,
        default: Date.now,
      },
    }],

    // Cuenta corriente del inquilino
    cuentaCorriente: {
      saldo: {
        type: Number,
        default: 0,
      },
      moneda: {
        type: String,
        enum: ["ARS", "USD", "EUR"],
        default: "ARS",
      },
      ultimoMovimiento: {
        type: Date,
      },
    },

    // Facturas emitidas al inquilino
    facturas: [{
      numero: {
        type: String,
        required: true,
        unique: true,
      },
      fecha: {
        type: Date,
        required: true,
        default: Date.now,
      },
      fechaVencimiento: {
        type: Date,
        required: true,
      },
      concepto: {
        type: String,
        required: true,
        trim: true,
      },
      descripcion: {
        type: String,
        trim: true,
      },
      monto: {
        type: Number,
        required: true,
        min: [0, "El monto no puede ser negativo"],
      },
      moneda: {
        type: String,
        enum: ["ARS", "USD", "EUR"],
        default: "ARS",
      },
      estado: {
        type: String,
        enum: ["pendiente", "pagada", "vencida", "anulada"],
        default: "pendiente",
      },
      contrato: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inquilinos.contratos",
      },
      propiedad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Propiedades",
      },
      fechaPago: {
        type: Date,
      },
      metodoPago: {
        type: String,
        enum: [
          "efectivo",
          "transferencia",
          "cheque",
          "tarjeta_credito",
          "tarjeta_debito",
          "mercadopago",
          "debito_automatico",
        ],
      },
      recargo: {
        type: Number,
        default: 0,
        min: [0, "El recargo no puede ser negativo"],
      },
      descuento: {
        type: Number,
        default: 0,
        min: [0, "El descuento no puede ser negativo"],
      },
      observaciones: {
        type: String,
        trim: true,
      },
    }],

    // Cobranzas realizadas al inquilino
    cobranzas: [{
      numero: {
        type: String,
        required: true,
        unique: true,
      },
      fecha: {
        type: Date,
        required: true,
        default: Date.now,
      },
      concepto: {
        type: String,
        required: true,
        trim: true,
      },
      descripcion: {
        type: String,
        trim: true,
      },
      monto: {
        type: Number,
        required: true,
        min: [0, "El monto no puede ser negativo"],
      },
      moneda: {
        type: String,
        enum: ["ARS", "USD", "EUR"],
        default: "ARS",
      },
      metodoPago: {
        type: String,
        enum: [
          "efectivo",
          "transferencia",
          "cheque",
          "tarjeta_credito",
          "tarjeta_debito",
          "mercadopago",
          "debito_automatico",
        ],
        required: true,
      },
      estado: {
        type: String,
        enum: ["pendiente", "cobrado", "rechazado", "anulado"],
        default: "pendiente",
      },
      contrato: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inquilinos.contratos",
      },
      propiedad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Propiedades",
      },
      factura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inquilinos.facturas",
      },
      fechaCobro: {
        type: Date,
      },
      numeroRecibo: {
        type: String,
        trim: true,
      },
      observaciones: {
        type: String,
        trim: true,
      },
    }],

    // Documentos del inquilino
    documentos: [{
      nombre: {
        type: String,
        required: true,
        trim: true,
      },
      tipo: {
        type: String,
        enum: [
          "dni_frente",
          "dni_dorso",
          "recibo_sueldo",
          "constancia_ingresos",
          "referencias_laborales",
          "referencias_comerciales",
          "garantia",
          "contrato",
          "otro",
        ],
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      fechaSubida: {
        type: Date,
        default: Date.now,
      },
      descripcion: {
        type: String,
        trim: true,
      },
    }],

    // Observaciones y notas
    observaciones: {
      type: String,
      trim: true,
      maxlength: [1000, "Las observaciones no pueden exceder 1000 caracteres"],
    },

    // Referencias del usuario y empresa
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es requerido"],
    },
    inmobiliaria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La inmobiliaria es requerida"],
    },

    // Información de creación y modificación
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modificadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar el rendimiento
inquilinosSchema.index({ numeroDocumento: 1 });
inquilinosSchema.index({ "contacto.email": 1 });
inquilinosSchema.index({ estado: 1 });
inquilinosSchema.index({ usuario: 1 });
inquilinosSchema.index({ inmobiliaria: 1 });
inquilinosSchema.index({ "contratos.propiedad": 1 });
inquilinosSchema.index({ "contratos.propietario": 1 });
inquilinosSchema.index({ "contratos.estado": 1 });
inquilinosSchema.index({ "facturas.numero": 1 });
inquilinosSchema.index({ "cobranzas.numero": 1 });
inquilinosSchema.index({ "facturas.estado": 1 });
inquilinosSchema.index({ "cobranzas.estado": 1 });
inquilinosSchema.index({ createdAt: -1 });

// Índice compuesto para búsquedas
inquilinosSchema.index({ 
  inmobiliaria: 1, 
  estado: 1, 
  "contacto.email": 1 
});

// Método para obtener nombre completo
inquilinosSchema.methods.getNombreCompleto = function() {
  return `${this.nombre} ${this.apellido}`;
};

// Método para generar número de factura automático
inquilinosSchema.methods.generarNumeroFactura = async function() {
  const inmobiliariaId = this.inmobiliaria.toString().slice(-4);
  const año = new Date().getFullYear();
  
  // Buscar la última factura del año actual
  const ultimaFactura = await this.constructor.findOne(
    { 
      inmobiliaria: this.inmobiliaria,
      "facturas.numero": { $regex: `^${año}-${inmobiliariaId}-` }
    },
    { "facturas.$": 1 }
  ).sort({ "facturas.numero": -1 });

  let numeroSecuencial = 1;
  if (ultimaFactura && ultimaFactura.facturas.length > 0) {
    const ultimoNumero = ultimaFactura.facturas[0].numero;
    const partes = ultimoNumero.split('-');
    numeroSecuencial = parseInt(partes[2]) + 1;
  }

  return `${año}-${inmobiliariaId}-${numeroSecuencial.toString().padStart(5, '0')}`;
};

// Método para generar número de cobranza automático
inquilinosSchema.methods.generarNumeroCobranza = async function() {
  const inmobiliariaId = this.inmobiliaria.toString().slice(-4);
  const año = new Date().getFullYear();
  
  // Buscar la última cobranza del año actual
  const ultimaCobranza = await this.constructor.findOne(
    { 
      inmobiliaria: this.inmobiliaria,
      "cobranzas.numero": { $regex: `^${año}-${inmobiliariaId}-` }
    },
    { "cobranzas.$": 1 }
  ).sort({ "cobranzas.numero": -1 });

  let numeroSecuencial = 1;
  if (ultimaCobranza && ultimaCobranza.cobranzas.length > 0) {
    const ultimoNumero = ultimaCobranza.cobranzas[0].numero;
    const partes = ultimoNumero.split('-');
    numeroSecuencial = parseInt(partes[2]) + 1;
  }

  return `${año}-${inmobiliariaId}-${numeroSecuencial.toString().padStart(5, '0')}`;
};

// Método para agregar contrato
inquilinosSchema.methods.agregarContrato = function(datosContrato) {
  const nuevoContrato = {
    tipo: datosContrato.tipo,
    propiedad: datosContrato.propiedad,
    propietario: datosContrato.propietario,
    fechaInicio: datosContrato.fechaInicio,
    fechaFin: datosContrato.fechaFin,
    montoMensual: datosContrato.montoMensual,
    moneda: datosContrato.moneda || "ARS",
    deposito: datosContrato.deposito || 0,
    comision: datosContrato.comision || 0,
    expensas: datosContrato.expensas || 0,
    diaVencimiento: datosContrato.diaVencimiento || 10,
    observaciones: datosContrato.observaciones,
  };

  this.contratos.push(nuevoContrato);
  return this.save();
};

// Método para agregar factura
inquilinosSchema.methods.agregarFactura = async function(datosFactura) {
  const numeroFactura = await this.generarNumeroFactura();
  
  const nuevaFactura = {
    numero: numeroFactura,
    fecha: datosFactura.fecha || new Date(),
    fechaVencimiento: datosFactura.fechaVencimiento,
    concepto: datosFactura.concepto,
    descripcion: datosFactura.descripcion,
    monto: datosFactura.monto,
    moneda: datosFactura.moneda || "ARS",
    contrato: datosFactura.contrato,
    propiedad: datosFactura.propiedad,
    recargo: datosFactura.recargo || 0,
    descuento: datosFactura.descuento || 0,
    observaciones: datosFactura.observaciones,
  };

  this.facturas.push(nuevaFactura);
  
  // Actualizar cuenta corriente
  this.cuentaCorriente.saldo += datosFactura.monto;
  this.cuentaCorriente.ultimoMovimiento = new Date();
  
  return this.save();
};

// Método para agregar cobranza
inquilinosSchema.methods.agregarCobranza = async function(datosCobranza) {
  const numeroCobranza = await this.generarNumeroCobranza();
  
  const nuevaCobranza = {
    numero: numeroCobranza,
    fecha: datosCobranza.fecha || new Date(),
    concepto: datosCobranza.concepto,
    descripcion: datosCobranza.descripcion,
    monto: datosCobranza.monto,
    moneda: datosCobranza.moneda || "ARS",
    metodoPago: datosCobranza.metodoPago,
    contrato: datosCobranza.contrato,
    propiedad: datosCobranza.propiedad,
    factura: datosCobranza.factura,
    numeroRecibo: datosCobranza.numeroRecibo,
    observaciones: datosCobranza.observaciones,
  };

  this.cobranzas.push(nuevaCobranza);
  
  // Actualizar cuenta corriente
  this.cuentaCorriente.saldo -= datosCobranza.monto;
  this.cuentaCorriente.ultimoMovimiento = new Date();
  
  return this.save();
};

// Método para obtener contratos activos
inquilinosSchema.methods.getContratosActivos = function() {
  return this.contratos.filter(contrato => contrato.estado === 'activo');
};

// Método para obtener facturas pendientes
inquilinosSchema.methods.getFacturasPendientes = function() {
  return this.facturas.filter(factura => factura.estado === 'pendiente');
};

// Método para obtener facturas vencidas
inquilinosSchema.methods.getFacturasVencidas = function() {
  const hoy = new Date();
  return this.facturas.filter(factura => 
    factura.estado === 'pendiente' && factura.fechaVencimiento < hoy
  );
};

// Método para verificar si está en mora
inquilinosSchema.methods.estaEnMora = function() {
  const facturasVencidas = this.getFacturasVencidas();
  return facturasVencidas.length > 0;
};

// Método para obtener saldo de cuenta corriente
inquilinosSchema.methods.getSaldoCuentaCorriente = function() {
  return {
    saldo: this.cuentaCorriente.saldo,
    moneda: this.cuentaCorriente.moneda,
    ultimoMovimiento: this.cuentaCorriente.ultimoMovimiento,
  };
};

const Inquilinos = mongoose.model("Inquilinos", inquilinosSchema);

export default Inquilinos;