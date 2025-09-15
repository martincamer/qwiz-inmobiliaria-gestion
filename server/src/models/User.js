import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    name: {
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
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // No incluir la contraseña en las consultas por defecto
    },
    role: {
      type: String,
      enum: ["admin", "user", "accountant"],
      default: "user",
    },
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
    profile: {
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      position: {
        type: String,
        trim: true,
      },
    },
    company: {
      id: {
        type: String,
        default: () => uuidv4(),
        unique: true,
      },
      name: {
        type: String,
        required: [true, "El nombre de la empresa es requerido"],
        trim: true,
        maxlength: [
          100,
          "El nombre de la empresa no puede exceder 100 caracteres",
        ],
      },
      size: {
        type: String,
        enum: ["1-5", "6-20", "21-50", "51-100", "100+"],
        required: [true, "El tamaño de la empresa es requerido"],
      },
      industry: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
      address: {
        street: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        zipCode: {
          type: String,
          trim: true,
        },
        country: {
          type: String,
          default: "Argentina",
          trim: true,
        },
      },
    },
    afipData: {
      cuit: {
        type: String,
        trim: true,
        match: [
          /^\d{2}-\d{8}-\d{1}$/,
          "El CUIT debe tener el formato XX-XXXXXXXX-X",
        ],
      },
      businessName: {
        type: String,
        trim: true,
      },
      taxCategory: {
        type: String,
        enum: [
          "Responsable Inscripto",
          "Monotributista",
          "Exento",
          "No Responsable",
          "Consumidor Final",
        ],
      },
      monotributoCategory: {
        type: String,
        enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
        required: function () {
          return this.afipData.taxCategory === "Monotributista";
        },
      },
      activityCode: {
        type: String,
        trim: true,
      },
      startDate: {
        type: Date,
      },
      grossIncomeNumber: {
        type: String,
        trim: true,
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ["mensual", "anual"],
        required: [true, "El plan de suscripción es requerido"],
        default: "mensual",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "suspended", "trial"],
        default: "trial",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
      trialEndDate: {
        type: Date,
        default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días de prueba
      },
      paymentMethod: {
        type: String,
        enum: ["credit_card", "debit_card", "bank_transfer", "mercadopago"],
      },
      lastPayment: {
        date: Date,
        amount: Number,
        currency: {
          type: String,
          default: "ARS",
        },
      },
      nextPayment: {
        date: Date,
        amount: Number,
      },
    },
    paymentStatus: {
      isPaid: {
        type: Boolean,
        default: false,
      },
      lastPaymentDate: {
        type: Date,
      },
      nextDueDate: {
        type: Date,
      },
      gracePeriodDays: {
        type: Number,
        default: 7, // Días de gracia después del vencimiento
      },
      canAccessSystem: {
        type: Boolean,
        default: true, // Permite acceso inicial durante trial
      },
      paymentHistory: [
        {
          paymentId: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          currency: {
            type: String,
            default: "ARS",
          },
          paymentDate: {
            type: Date,
            required: true,
          },
          paymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "bank_transfer", "mercadopago"],
          },
          status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
          },
          description: {
            type: String,
            trim: true,
          },
        },
      ],
      overdueNotifications: {
        lastSent: Date,
        count: {
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
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.emailVerificationToken;
  return userObject;
};

// Método para verificar si la suscripción está activa
userSchema.methods.isSubscriptionActive = function () {
  if (this.subscription.status === "trial") {
    return new Date() <= this.subscription.trialEndDate;
  }
  return (
    this.subscription.status === "active" &&
    new Date() <= this.subscription.endDate
  );
};

// Método para obtener días restantes de prueba
userSchema.methods.getTrialDaysRemaining = function () {
  if (this.subscription.status !== "trial") return 0;
  const now = new Date();
  const trialEnd = this.subscription.trialEndDate;
  const diffTime = trialEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Método para verificar si puede acceder al sistema
userSchema.methods.canAccessSystem = function () {
  // Si está en trial y no ha vencido
  if (this.subscription.status === "trial") {
    return new Date() <= this.subscription.trialEndDate;
  }

  // Si tiene suscripción activa y está al día con los pagos
  if (this.subscription.status === "active") {
    return this.paymentStatus.canAccessSystem && this.paymentStatus.isPaid;
  }

  return false;
};

// Método para verificar si el pago está vencido
userSchema.methods.isPaymentOverdue = function () {
  if (!this.paymentStatus.nextDueDate) return false;
  const now = new Date();
  const dueDate = new Date(this.paymentStatus.nextDueDate);
  const gracePeriodEnd = new Date(
    dueDate.getTime() + this.paymentStatus.gracePeriodDays * 24 * 60 * 60 * 1000
  );
  return now > gracePeriodEnd;
};

// Método para registrar un nuevo pago
userSchema.methods.addPayment = function (paymentData) {
  this.paymentStatus.paymentHistory.push({
    paymentId: paymentData.paymentId,
    amount: paymentData.amount,
    currency: paymentData.currency || "ARS",
    paymentDate: paymentData.paymentDate || new Date(),
    paymentMethod: paymentData.paymentMethod,
    status: paymentData.status || "completed",
    description: paymentData.description,
  });

  if (paymentData.status === "completed") {
    this.paymentStatus.isPaid = true;
    this.paymentStatus.lastPaymentDate = paymentData.paymentDate || new Date();
    this.paymentStatus.canAccessSystem = true;

    // Calcular próxima fecha de vencimiento
    const nextDue = new Date();
    if (this.subscription.plan === "mensual") {
      nextDue.setMonth(nextDue.getMonth() + 1);
    } else if (this.subscription.plan === "anual") {
      nextDue.setFullYear(nextDue.getFullYear() + 1);
    }
    this.paymentStatus.nextDueDate = nextDue;
  }
};

// Método para suspender acceso por falta de pago
userSchema.methods.suspendForNonPayment = function () {
  this.paymentStatus.canAccessSystem = false;
  this.paymentStatus.isPaid = false;
  this.subscription.status = "suspended";
};

// Índices para mejorar el rendimiento
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ "company.id": 1 });
// userSchema.index({ "afipData.cuit": 1 });
userSchema.index({ "subscription.status": 1 });
userSchema.index({ "subscription.plan": 1 });
userSchema.index({ "paymentStatus.isPaid": 1 });
userSchema.index({ "paymentStatus.canAccessSystem": 1 });
userSchema.index({ "paymentStatus.nextDueDate": 1 });
userSchema.index({ "paymentStatus.paymentHistory.status": 1 });

const User = mongoose.model("User", userSchema);

export default User;
