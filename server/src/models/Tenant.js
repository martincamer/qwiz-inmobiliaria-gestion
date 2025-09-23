import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const tenantSchema = new mongoose.Schema(
  {
    // ID único del inquilino
    tenantId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    
    // Campos esenciales mínimos (como en Property)
    name: {
      type: String,
      required: [true, "El nombre completo es requerido"],
      trim: true,
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

    // Referencia al propietario (opcional)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },

    // Referencia a la propiedad (opcional)
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    // Estado básico
    status: {
      type: String,
      enum: ["activo", "inactivo", "vencido", "suspendido"],
      default: "activo",
    },

    // Información de la inmobiliaria (requerida para relaciones)
    realEstate: {
      companyId: {
        type: String,
        required: [true, "El ID de la inmobiliaria es requerido"],
      },
      companyName: {
        type: String,
        trim: true,
      },
      agentId: {
        type: String,
        trim: true,
      },
      agentName: {
        type: String,
        trim: true,
      },
    },

    // Fechas de auditoría (automáticas)
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // Usuario que creó/modificó (opcional)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Campos del sistema (automáticos)
    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: false, // Permite campos dinámicos del cliente (como Property)
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices básicos para rendimiento
tenantSchema.index({ email: 1 });
tenantSchema.index({ tenantId: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ "realEstate.companyId": 1 });
tenantSchema.index({ isActive: 1 });

// Índices dinámicos que se crearán si los campos existen
tenantSchema.index({ owner: 1 }, { sparse: true });
tenantSchema.index({ property: 1 }, { sparse: true });
tenantSchema.index({ phone: 1 }, { sparse: true });
tenantSchema.index({ idNumber: 1 }, { sparse: true });

// Virtual para obtener datos básicos
tenantSchema.virtual("basicInfo").get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    status: this.status,
    isActive: this.isActive,
    createdAt: this.createdAt,
  };
});

// Middleware para actualizar updatedAt automáticamente
tenantSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  
  // Solo hashear la contraseña si existe y ha sido modificada
  if (this.password && this.isModified("password")) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Método para comparar contraseñas (si existe)
tenantSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para obtener datos públicos del inquilino
tenantSchema.methods.getPublicProfile = function () {
  const tenantObject = this.toObject();
  delete tenantObject.password;
  delete tenantObject.resetPasswordToken;
  delete tenantObject.resetPasswordExpire;
  delete tenantObject.emailVerificationToken;
  return tenantObject;
};

// Método para verificar si el contrato está vigente (si existe)
tenantSchema.methods.isContractActive = function () {
  if (!this.contract || !this.contract.startDate || !this.contract.endDate) {
    return false;
  }
  const now = new Date();
  return (
    this.status === "activo" &&
    now >= this.contract.startDate &&
    now <= this.contract.endDate
  );
};

// Método para obtener días restantes del contrato (si existe)
tenantSchema.methods.getContractDaysRemaining = function () {
  if (!this.contract || !this.contract.endDate) return 0;
  const now = new Date();
  const endDate = this.contract.endDate;
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Método para verificar si hay pagos vencidos (si existe historial)
tenantSchema.methods.hasOverduePayments = function () {
  if (!this.paymentHistory || !Array.isArray(this.paymentHistory)) {
    return false;
  }
  const now = new Date();
  return this.paymentHistory.some(
    payment => 
      payment.status === "pendiente" && 
      payment.dueDate < now
  );
};

// Método para obtener el próximo pago pendiente (si existe)
tenantSchema.methods.getNextPaymentDue = function () {
  if (!this.paymentHistory || !Array.isArray(this.paymentHistory)) {
    return null;
  }
  const pendingPayments = this.paymentHistory
    .filter(payment => payment.status === "pendiente")
    .sort((a, b) => a.dueDate - b.dueDate);
  
  return pendingPayments.length > 0 ? pendingPayments[0] : null;
};

// Método para calcular el total adeudado (si existe historial)
tenantSchema.methods.getTotalOwed = function () {
  if (!this.paymentHistory || !Array.isArray(this.paymentHistory)) {
    return 0;
  }
  return this.paymentHistory
    .filter(payment => payment.status === "pendiente" || payment.status === "vencido")
    .reduce((total, payment) => total + (payment.amount || 0), 0);
};

// Método estático para crear inquilino con datos mínimos
tenantSchema.statics.crearConDatosMinimos = async function (datosBasicos, inmobiliaria) {
  const { nombre, email } = datosBasicos;
  
  if (!nombre || !email) {
    throw new Error("Nombre y email son requeridos");
  }

  // Verificar si el email ya existe
  const existente = await this.findOne({ email });
  if (existente) {
    throw new Error("Ya existe un inquilino con este email");
  }

  // Crear con datos mínimos
  const inquilino = await this.create({
    name: nombre,
    email,
    realEstate: inmobiliaria,
    status: "activo",
    // Los demás campos del cliente se agregarán dinámicamente
  });

  return inquilino;
};

// Método estático para búsqueda flexible (como Property)
tenantSchema.statics.flexibleSearch = function (filters = {}) {
  const query = { isActive: { $ne: false } }; // Busca activos por defecto

  // Aplica filtros dinámicamente si existen
  Object.keys(filters).forEach((key) => {
    if (
      filters[key] !== undefined &&
      filters[key] !== null &&
      filters[key] !== ""
    ) {
      if (typeof filters[key] === "string") {
        query[key] = new RegExp(filters[key], "i");
      } else {
        query[key] = filters[key];
      }
    }
  });

  return this.find(query).sort({ status: 1, createdAt: -1 });
};

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;