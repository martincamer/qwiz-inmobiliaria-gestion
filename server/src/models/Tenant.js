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
    
    // Información personal del inquilino
    name: {
      type: String,
      required: [true, "El nombre completo es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
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
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // No incluir la contraseña en las consultas por defecto
    },
    phone: {
      type: String,
      required: [true, "El teléfono es requerido"],
      trim: true,
      match: [
        /^[\+]?[1-9][\d]{0,15}$/,
        "Por favor ingresa un número de teléfono válido",
      ],
    },
    idNumber: {
      type: String,
      required: [true, "DNI/CUIT/Razón Social es requerido"],
      trim: true,
      unique: true,
    },
    
    // Referencia al propietario
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: [true, "La referencia al propietario es requerida"],
    },
    
    // Información de la propiedad
    property: {
      address: {
        type: String,
        required: [true, "La dirección de la propiedad es requerida"],
        trim: true,
        maxlength: [200, "La dirección no puede exceder 200 caracteres"],
      },
      details: {
        type: String,
        trim: true,
        maxlength: [500, "Los detalles no pueden exceder 500 caracteres"],
      },
      type: {
        type: String,
        enum: [
          "casa",
          "departamento",
          "oficina",
          "local_comercial",
          "terreno",
          "galpon",
          "otro"
        ],
        default: "departamento",
      },
      rooms: {
        type: Number,
        min: [0, "El número de habitaciones no puede ser negativo"],
      },
      bathrooms: {
        type: Number,
        min: [0, "El número de baños no puede ser negativo"],
      },
      area: {
        type: Number,
        min: [0, "El área no puede ser negativa"],
      },
      furnished: {
        type: Boolean,
        default: false,
      },
    },
    
    // Información del contrato
    contract: {
      startDate: {
        type: Date,
        required: [true, "La fecha de inicio del contrato es requerida"],
      },
      endDate: {
        type: Date,
        required: [true, "La fecha de finalización del contrato es requerida"],
      },
      rentAmount: {
        type: Number,
        required: [true, "El monto del alquiler es requerido"],
        min: [0, "El monto del alquiler no puede ser negativo"],
      },
      currency: {
        type: String,
        enum: ["ARS", "USD", "EUR"],
        default: "ARS",
      },
      paymentDay: {
        type: Number,
        min: [1, "El día de pago debe estar entre 1 y 31"],
        max: [31, "El día de pago debe estar entre 1 y 31"],
        default: 10,
      },
      reminderFrequency: {
        type: String,
        enum: [
          "Mensual",
          "Bimensual", 
          "Trimestral",
          "Cuatrimestral",
          "Semestral",
          "Anual",
          ""
        ],
        default: "",
      },
      adjustmentIndex: {
        type: String,
        enum: [
          "IPC", // Índice de Precios al Consumidor
          "ICL", // Índice de Contratos de Locación
          "CC",  // CasaPropia / HogAr / Procrear
          "RIPTE", // Remuneración Impositiva Promedio de los Trabajadores Estables
          "CAC", // Cámara Argentina de la Construcción
          "CER", // Coeficiente de Estabilización de Referencia
          "IS",  // Índice de Salarios
          "IPIM", // Índice de Precios Internos al por Mayor
          "UVA", // Unidad de Valor Adquisitivo
          "Preacordado",
          ""
        ],
        default: "",
      },
      deposit: {
        amount: {
          type: Number,
          min: [0, "El depósito no puede ser negativo"],
        },
        paid: {
          type: Boolean,
          default: false,
        },
        paidDate: {
          type: Date,
        },
      },
      guarantees: {
        type: [{
          type: {
            type: String,
            enum: ["garantia_propietaria", "seguro_caucion", "recibo_sueldo", "otro"],
          },
          description: {
            type: String,
            trim: true,
          },
          amount: {
            type: Number,
            min: [0, "El monto de la garantía no puede ser negativo"],
          },
        }],
        default: [],
      },
      contractDocument: {
        filename: {
          type: String,
          trim: true,
        },
        path: {
          type: String,
          trim: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    },
    
    // Estado del inquilino
    status: {
      type: String,
      enum: ["activo", "inactivo", "vencido", "suspendido"],
      default: "activo",
    },
    
    // Historial de pagos
    paymentHistory: [
      {
        paymentId: {
          type: String,
          default: () => uuidv4(),
        },
        amount: {
          type: Number,
          required: true,
          min: [0, "El monto del pago no puede ser negativo"],
        },
        currency: {
          type: String,
          enum: ["ARS", "USD", "EUR"],
          default: "ARS",
        },
        paymentDate: {
          type: Date,
          required: true,
        },
        dueDate: {
          type: Date,
          required: true,
        },
        paymentMethod: {
          type: String,
          enum: [
            "efectivo",
            "transferencia",
            "cheque",
            "tarjeta_credito",
            "tarjeta_debito",
            "mercadopago",
            "otro"
          ],
          default: "transferencia",
        },
        status: {
          type: String,
          enum: ["pendiente", "pagado", "vencido", "parcial"],
          default: "pendiente",
        },
        concept: {
          type: String,
          enum: [
            "alquiler",
            "expensas",
            "servicios",
            "deposito",
            "multa",
            "otro"
          ],
          default: "alquiler",
        },
        notes: {
          type: String,
          trim: true,
          maxlength: [300, "Las notas no pueden exceder 300 caracteres"],
        },
        receipt: {
          number: {
            type: String,
            trim: true,
          },
          path: {
            type: String,
            trim: true,
          },
        },
      },
    ],
    
    // Recordatorios y notificaciones
    reminders: {
      paymentReminders: {
        enabled: {
          type: Boolean,
          default: true,
        },
        daysBefore: {
          type: Number,
          default: 5,
          min: [1, "Los días de recordatorio deben ser al menos 1"],
          max: [30, "Los días de recordatorio no pueden exceder 30"],
        },
        lastSent: {
          type: Date,
        },
      },
      contractReminders: {
        enabled: {
          type: Boolean,
          default: true,
        },
        daysBefore: {
          type: Number,
          default: 30,
          min: [1, "Los días de recordatorio deben ser al menos 1"],
          max: [365, "Los días de recordatorio no pueden exceder 365"],
        },
        lastSent: {
          type: Date,
        },
      },
    },
    
    // Información adicional
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
    },
    
    // Configuración de acceso
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    
    // Información de la inmobiliaria (referencia al usuario que lo creó)
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
    
    // Notas y observaciones
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Las notas no pueden exceder 1000 caracteres"],
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para hashear la contraseña antes de guardar
tenantSchema.pre("save", async function (next) {
  // Solo hashear la contraseña si ha sido modificada
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
tenantSchema.methods.matchPassword = async function (enteredPassword) {
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

// Método para verificar si el contrato está vigente
tenantSchema.methods.isContractActive = function () {
  const now = new Date();
  return (
    this.status === "activo" &&
    now >= this.contract.startDate &&
    now <= this.contract.endDate
  );
};

// Método para obtener días restantes del contrato
tenantSchema.methods.getContractDaysRemaining = function () {
  const now = new Date();
  const endDate = this.contract.endDate;
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Método para verificar si hay pagos vencidos
tenantSchema.methods.hasOverduePayments = function () {
  const now = new Date();
  return this.paymentHistory.some(
    payment => 
      payment.status === "pendiente" && 
      payment.dueDate < now
  );
};

// Método para obtener el próximo pago pendiente
tenantSchema.methods.getNextPaymentDue = function () {
  const pendingPayments = this.paymentHistory
    .filter(payment => payment.status === "pendiente")
    .sort((a, b) => a.dueDate - b.dueDate);
  
  return pendingPayments.length > 0 ? pendingPayments[0] : null;
};

// Método para agregar un nuevo pago
tenantSchema.methods.addPayment = function (paymentData) {
  this.paymentHistory.push({
    amount: paymentData.amount,
    currency: paymentData.currency || "ARS",
    paymentDate: paymentData.paymentDate || new Date(),
    dueDate: paymentData.dueDate,
    paymentMethod: paymentData.paymentMethod || "transferencia",
    status: paymentData.status || "pendiente",
    concept: paymentData.concept || "alquiler",
    notes: paymentData.notes,
    receipt: paymentData.receipt,
  });
};

// Método para marcar un pago como pagado
tenantSchema.methods.markPaymentAsPaid = function (paymentId, paymentData = {}) {
  const payment = this.paymentHistory.id(paymentId);
  if (payment) {
    payment.status = "pagado";
    payment.paymentDate = paymentData.paymentDate || new Date();
    payment.paymentMethod = paymentData.paymentMethod || payment.paymentMethod;
    payment.notes = paymentData.notes || payment.notes;
    payment.receipt = paymentData.receipt || payment.receipt;
  }
  return payment;
};

// Método para calcular el total adeudado
tenantSchema.methods.getTotalOwed = function () {
  return this.paymentHistory
    .filter(payment => payment.status === "pendiente" || payment.status === "vencido")
    .reduce((total, payment) => total + payment.amount, 0);
};

// Método para generar pagos mensuales automáticamente
tenantSchema.methods.generateMonthlyPayments = function (months = 12) {
  const startDate = new Date(this.contract.startDate);
  const paymentDay = this.contract.paymentDay;
  
  for (let i = 0; i < months; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + i);
    dueDate.setDate(paymentDay);
    
    // Solo agregar si no existe ya un pago para esa fecha
    const existingPayment = this.paymentHistory.find(
      payment => 
        payment.dueDate.getMonth() === dueDate.getMonth() &&
        payment.dueDate.getFullYear() === dueDate.getFullYear() &&
        payment.concept === "alquiler"
    );
    
    if (!existingPayment && dueDate <= this.contract.endDate) {
      this.addPayment({
        amount: this.contract.rentAmount,
        dueDate: dueDate,
        concept: "alquiler",
        status: "pendiente",
      });
    }
  }
};

// Método para obtener información del propietario
tenantSchema.methods.obtenerPropietario = async function () {
  await this.populate('propietario');
  return this.propietario;
};

// Método para notificar al propietario sobre pagos
tenantSchema.methods.notificarPropietario = async function (tipo, mensaje) {
  const Owner = mongoose.model("Owner");
  const propietario = await Owner.findById(this.propietario);
  
  if (propietario && propietario.configuracionNotificaciones.email) {
    // Aquí se implementaría la lógica de envío de email
    console.log(`Notificación a ${propietario.email}: ${tipo} - ${mensaje}`);
  }
  
  return propietario;
};

// Índices para mejorar el rendimiento
tenantSchema.index({ email: 1 });
tenantSchema.index({ tenantId: 1 });
tenantSchema.index({ idNumber: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ "realEstate.companyId": 1 });
tenantSchema.index({ propietario: 1 });
tenantSchema.index({ "contract.startDate": 1 });
tenantSchema.index({ "contract.endDate": 1 });
tenantSchema.index({ "paymentHistory.status": 1 });
tenantSchema.index({ "paymentHistory.dueDate": 1 });
tenantSchema.index({ isActive: 1 });

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;