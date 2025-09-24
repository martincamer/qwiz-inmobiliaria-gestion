import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingresa un email válido",
      ],
    },
    contraseña: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // No incluir la contraseña en las consultas por defecto
    },
    role: {
      type: String,
      enum: ["admin", "usuario", "contador", "agente", "propietario"],
      default: "usuario",
    },
    rol: {
      type: String,
      enum: ["admin", "usuario", "contador", "agente", "propietario"],
      default: "usuario",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    estaActivo: {
      type: Boolean,
      default: true,
    },
    lastAccess: {
      type: Date,
    },
    ultimoAcceso: {
      type: Date,
    },
    tokenRestablecerContraseña: String,
    expiraRestablecerContraseña: Date,
    emailVerificado: {
      type: Boolean,
      default: false,
    },
    tokenVerificacionEmail: String,
    perfil: {
      telefono: {
        type: String,
        trim: true,
      },
      direccion: {
        type: String,
        trim: true,
      },
    },
    empresa: {
      id: {
        type: String,
        default: () => uuidv4(),
        unique: true,
      },
      nombre: {
        type: String,
        required: [true, "El nombre de la inmobiliaria es requerido"],
        trim: true,
        maxlength: [
          100,
          "El nombre de la inmobiliaria no puede exceder 100 caracteres",
        ],
      },
      slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        match: [
          /^[a-z0-9-]+$/,
          "El slug solo puede contener letras minúsculas, números y guiones",
        ],
        maxlength: [50, "El slug no puede exceder 50 caracteres"],
      },
      tipo: {
        type: String,
        enum: [
          "individual",
          "pequeña",
          "mediana",
          "grande",
          "empresa",
          "franquicia",
        ],
        required: [true, "El tipo de inmobiliaria es requerido"],
      },
      tipoInmobiliaria: {
        type: String,
        enum: [
          "residencial", // Residencial
          "comercial", // Comercial
          "industrial", // Industrial
          "mixto", // Mixto
          "lujo", // Lujo
          "rural", // Rural
        ],
        default: "residencial",
      },
      cantidadAgentes: {
        type: Number,
        min: [1, "Debe tener al menos 1 agente"],
        default: 1,
      },
      numeroLicencia: {
        type: String,
        trim: true,
      },
      sitioWeb: {
        type: String,
        trim: true,
      },
      direccion: {
        calle: {
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
    },
    datosAfip: {
      cuit: {
        type: String,
        trim: true,
        match: [
          /^\d{2}-\d{8}-\d{1}$/,
          "El CUIT debe tener el formato XX-XXXXXXXX-X",
        ],
      },
      razonSocial: {
        type: String,
        trim: true,
      },
      categoriaFiscal: {
        type: String,
        enum: [
          "Responsable Inscripto",
          "Monotributista",
          "Exento",
          "No Responsable",
          "Consumidor Final",
        ],
      },
      categoriaMonotributo: {
        type: String,
        enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
      },
      codigoActividad: {
        type: String,
        trim: true,
      },
      fechaInicio: {
        type: Date,
      },
      numeroIngresosBrutos: {
        type: String,
        trim: true,
      },
    },
    suscripcion: {
      plan: {
        type: String,
        enum: ["mensual", "anual"],
        required: [true, "El plan de suscripción es requerido"],
        default: "mensual",
      },
      estado: {
        type: String,
        enum: ["activo", "inactivo", "suspendido", "prueba"],
        default: "prueba",
      },
      fechaInicio: {
        type: Date,
        default: Date.now,
      },
      fechaFin: {
        type: Date,
      },
      fechaFinPrueba: {
        type: Date,
        default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días de prueba
      },
      metodoPago: {
        type: String,
        enum: [
          "tarjeta_credito",
          "tarjeta_debito",
          "transferencia_bancaria",
          "mercadopago",
        ],
      },
      ultimoPago: {
        fecha: Date,
        monto: Number,
        moneda: {
          type: String,
          default: "ARS",
        },
      },
      proximoPago: {
        fecha: Date,
        monto: Number,
      },
    },
    estadoPago: {
      estaPagado: {
        type: Boolean,
        default: false,
      },
      fechaUltimoPago: {
        type: Date,
      },
      proximaFechaVencimiento: {
        type: Date,
      },
      diasGracia: {
        type: Number,
        default: 7, // Días de gracia después del vencimiento
      },
      puedeAccederSistema: {
        type: Boolean,
        default: true, // Permite acceso inicial durante trial
      },
      historialPagos: [
        {
          idPago: {
            type: String,
            required: true,
          },
          monto: {
            type: Number,
            required: true,
          },
          moneda: {
            type: String,
            default: "ARS",
          },
          fechaPago: {
            type: Date,
            required: true,
          },
          metodoPago: {
            type: String,
            enum: [
              "tarjeta_credito",
              "tarjeta_debito",
              "transferencia_bancaria",
              "mercadopago",
            ],
          },
          estado: {
            type: String,
            enum: ["pendiente", "completado", "fallido", "reembolsado"],
            default: "pendiente",
          },
          descripcion: {
            type: String,
            trim: true,
          },
        },
      ],
      notificacionesVencimiento: {
        ultimoEnvio: Date,
        contador: {
          type: Number,
          default: 0,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para hashear la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  // Solo hashear la contraseña si ha sido modificada
  if (!this.isModified("contraseña")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

// Middleware para generar slug automáticamente
userSchema.pre("save", async function (next) {
  // Generar slug si no existe y hay nombre de empresa
  if (this.empresa.nombre && !this.empresa.slug) {
    this.generateSlug();

    // Verificar si el slug ya existe y agregar número si es necesario
    let slugExists = await this.constructor.findOne({
      "empresa.slug": this.empresa.slug,
    });
    let counter = 1;
    let originalSlug = this.empresa.slug;

    while (slugExists && slugExists._id.toString() !== this._id.toString()) {
      this.empresa.slug = `${originalSlug}-${counter}`;
      slugExists = await this.constructor.findOne({
        "empresa.slug": this.empresa.slug,
      });
      counter++;
    }
  }
  next();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.contraseña);
};

// Método para generar slug automáticamente
userSchema.methods.generateSlug = function () {
  if (!this.empresa.slug && this.empresa.nombre) {
    let baseSlug = this.empresa.nombre
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
      .replace(/\s+/g, "-") // Reemplazar espacios con guiones
      .replace(/-+/g, "-") // Reemplazar múltiples guiones con uno solo
      .trim("-"); // Remover guiones al inicio y final

    this.empresa.slug = baseSlug;
  }
  return this.empresa.slug;
};

// Método para obtener datos públicos del usuario
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.contraseña;
  delete userObject.tokenRestablecerContraseña;
  delete userObject.expiraRestablecerContraseña;
  delete userObject.tokenVerificacionEmail;
  return userObject;
};

// Método para verificar si la suscripción está activa
userSchema.methods.isSubscriptionActive = function () {
  if (this.suscripcion.estado === "prueba") {
    return new Date() <= this.suscripcion.fechaFinPrueba;
  }
  return (
    this.suscripcion.estado === "activo" &&
    new Date() <= this.suscripcion.fechaFin
  );
};

// Método para obtener días restantes de prueba
userSchema.methods.getTrialDaysRemaining = function () {
  if (this.suscripcion.estado !== "prueba") return 0;
  const now = new Date();
  const trialEnd = this.suscripcion.fechaFinPrueba;
  const diffTime = trialEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Método para verificar si puede acceder al sistema
userSchema.methods.canAccessSystem = function () {
  // Si está en trial y no ha vencido
  if (this.suscripcion.estado === "prueba") {
    return new Date() <= this.suscripcion.fechaFinPrueba;
  }

  // Si tiene suscripción activa y está al día con los pagos
  if (this.suscripcion.estado === "activo") {
    return this.estadoPago.puedeAccederSistema && this.estadoPago.estaPagado;
  }

  return false;
};

// Método para verificar si el pago está vencido
userSchema.methods.isPaymentOverdue = function () {
  if (!this.estadoPago.proximaFechaVencimiento) return false;
  const now = new Date();
  const dueDate = new Date(this.estadoPago.proximaFechaVencimiento);
  const gracePeriodEnd = new Date(
    dueDate.getTime() + this.estadoPago.diasGracia * 24 * 60 * 60 * 1000
  );
  return now > gracePeriodEnd;
};

// Método para registrar un nuevo pago
userSchema.methods.addPayment = function (paymentData) {
  this.estadoPago.historialPagos.push({
    idPago: paymentData.idPago,
    monto: paymentData.monto,
    moneda: paymentData.moneda || "ARS",
    fechaPago: paymentData.fechaPago || new Date(),
    metodoPago: paymentData.metodoPago,
    estado: paymentData.estado || "completado",
    descripcion: paymentData.descripcion,
  });

  if (paymentData.estado === "completado") {
    this.estadoPago.estaPagado = true;
    this.estadoPago.fechaUltimoPago = paymentData.fechaPago || new Date();
    this.estadoPago.puedeAccederSistema = true;

    // Calcular próxima fecha de vencimiento
    const nextDue = new Date();
    if (this.suscripcion.plan === "mensual") {
      nextDue.setMonth(nextDue.getMonth() + 1);
    } else if (this.suscripcion.plan === "anual") {
      nextDue.setFullYear(nextDue.getFullYear() + 1);
    }
    this.estadoPago.proximaFechaVencimiento = nextDue;
  }
};

// Método para suspender acceso por falta de pago
userSchema.methods.suspendForNonPayment = function () {
  this.estadoPago.puedeAccederSistema = false;
  this.estadoPago.estaPagado = false;
  this.suscripcion.estado = "suspendido";
};

// Índices para mejorar el rendimiento
userSchema.index({ email: 1 });
userSchema.index({ rol: 1 });
userSchema.index({ estaActivo: 1 });
userSchema.index({ "empresa.id": 1 });
userSchema.index({ "empresa.slug": 1 });
userSchema.index({ "suscripcion.estado": 1 });
userSchema.index({ "suscripcion.plan": 1 });
userSchema.index({ "estadoPago.estaPagado": 1 });
userSchema.index({ "estadoPago.puedeAccederSistema": 1 });
userSchema.index({ "estadoPago.proximaFechaVencimiento": 1 });
userSchema.index({ "estadoPago.historialPagos.estado": 1 });

const User = mongoose.model("User", userSchema);

export default User;
