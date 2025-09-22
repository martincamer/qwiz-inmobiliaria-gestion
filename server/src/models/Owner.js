import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ownerSchema = new mongoose.Schema(
  {
    // Información personal básica
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder 50 caracteres"]
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      maxlength: [50, "El apellido no puede exceder 50 caracteres"]
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingrese un email válido"
      ]
    },
    telefono: {
      type: String,
      trim: true,
      maxlength: [20, "El teléfono no puede exceder 20 caracteres"]
    },
    numeroIdentificacion: {
      type: String,
      required: [true, "El número de identificación es obligatorio"],
      trim: true,
      maxlength: [20, "El número de identificación no puede exceder 20 caracteres"]
    },
    tipoIdentificacion: {
      type: String,
      enum: ["DNI", "CUIT", "CUIL", "RAZON_SOCIAL"],
      default: "DNI"
    },

    // Información adicional
    direccion: {
      calle: {
        type: String,
        trim: true,
        maxlength: [100, "La calle no puede exceder 100 caracteres"]
      },
      numero: {
        type: String,
        trim: true,
        maxlength: [10, "El número no puede exceder 10 caracteres"]
      },
      piso: {
        type: String,
        trim: true,
        maxlength: [10, "El piso no puede exceder 10 caracteres"]
      },
      departamento: {
        type: String,
        trim: true,
        maxlength: [10, "El departamento no puede exceder 10 caracteres"]
      },
      ciudad: {
        type: String,
        trim: true,
        maxlength: [50, "La ciudad no puede exceder 50 caracteres"]
      },
      provincia: {
        type: String,
        trim: true,
        maxlength: [50, "La provincia no puede exceder 50 caracteres"]
      },
      codigoPostal: {
        type: String,
        trim: true,
        maxlength: [10, "El código postal no puede exceder 10 caracteres"]
      }
    },

    // Información bancaria
    informacionBancaria: {
      banco: {
        type: String,
        trim: true,
        maxlength: [50, "El nombre del banco no puede exceder 50 caracteres"]
      },
      tipoCuenta: {
        type: String,
        enum: ["AHORRO", "CORRIENTE", "CAJA_AHORRO"],
        default: "CAJA_AHORRO"
      },
      numeroCuenta: {
        type: String,
        trim: true,
        maxlength: [30, "El número de cuenta no puede exceder 30 caracteres"]
      },
      cbu: {
        type: String,
        trim: true,
        maxlength: [22, "El CBU no puede exceder 22 caracteres"]
      },
      alias: {
        type: String,
        trim: true,
        maxlength: [20, "El alias no puede exceder 20 caracteres"]
      }
    },

    // Propiedades asociadas
    propiedades: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    }],

    // Inquilinos asociados
    inquilinos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant"
    }],

    // Información fiscal
    informacionFiscal: {
      condicionIva: {
        type: String,
        enum: [
          "RESPONSABLE_INSCRIPTO",
          "MONOTRIBUTISTA",
          "EXENTO",
          "CONSUMIDOR_FINAL",
          "RESPONSABLE_NO_INSCRIPTO"
        ],
        default: "CONSUMIDOR_FINAL"
      },
      ingresosBrutos: {
        type: String,
        trim: true,
        maxlength: [20, "El número de ingresos brutos no puede exceder 20 caracteres"]
      }
    },

    // Configuración de cuenta
    password: {
      type: String,
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },
    activo: {
      type: Boolean,
      default: true
    },
    fechaRegistro: {
      type: Date,
      default: Date.now
    },
    ultimoAcceso: {
      type: Date
    },

    // Notas y observaciones
    notas: {
      type: String,
      maxlength: [1000, "Las notas no pueden exceder 1000 caracteres"]
    },

    // Configuraciones de notificaciones
    configuracionNotificaciones: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      whatsapp: {
        type: Boolean,
        default: false
      }
    },

    // Documentos adjuntos
    documentos: [{
      tipo: {
        type: String,
        enum: ["DNI", "CUIT", "ESCRITURA", "CONTRATO", "OTRO"],
        required: true
      },
      nombre: {
        type: String,
        required: true,
        trim: true
      },
      url: {
        type: String,
        required: true
      },
      fechaSubida: {
        type: Date,
        default: Date.now
      }
    }],

    // Estadísticas
    estadisticas: {
      totalPropiedades: {
        type: Number,
        default: 0
      },
      totalInquilinos: {
        type: Number,
        default: 0
      },
      ingresosMensuales: {
        type: Number,
        default: 0
      },
      pagosRecibidos: {
        type: Number,
        default: 0
      },
      pagosPendientes: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Middleware para hashear la contraseña antes de guardar
ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Método para comparar contraseñas
ownerSchema.methods.compararPassword = async function (passwordCandidata) {
  if (!this.password) return false;
  return await bcrypt.compare(passwordCandidata, this.password);
};

// Virtual para nombre completo
ownerSchema.virtual("nombreCompleto").get(function () {
  return `${this.nombre} ${this.apellido}`;
});

// Virtual para dirección completa
ownerSchema.virtual("direccionCompleta").get(function () {
  if (!this.direccion.calle) return "";
  
  let direccion = this.direccion.calle;
  if (this.direccion.numero) direccion += ` ${this.direccion.numero}`;
  if (this.direccion.piso) direccion += `, Piso ${this.direccion.piso}`;
  if (this.direccion.departamento) direccion += `, Depto ${this.direccion.departamento}`;
  if (this.direccion.ciudad) direccion += `, ${this.direccion.ciudad}`;
  if (this.direccion.provincia) direccion += `, ${this.direccion.provincia}`;
  
  return direccion;
});

// Método para obtener el perfil público del propietario
ownerSchema.methods.obtenerPerfilPublico = function () {
  const propietario = this.toObject();
  delete propietario.password;
  delete propietario.__v;
  return propietario;
};

// Método para actualizar estadísticas
ownerSchema.methods.actualizarEstadisticas = async function () {
  const Tenant = mongoose.model("Tenant");
  const Property = mongoose.model("Property");
  
  try {
    // Contar propiedades
    this.estadisticas.totalPropiedades = await Property.countDocuments({ propietario: this._id });
    
    // Contar inquilinos activos
    this.estadisticas.totalInquilinos = await Tenant.countDocuments({ 
      propietario: this._id,
      estadoContrato: "ACTIVO"
    });
    
    // Calcular ingresos mensuales
    const inquilinosActivos = await Tenant.find({ 
      propietario: this._id,
      estadoContrato: "ACTIVO"
    });
    
    this.estadisticas.ingresosMensuales = inquilinosActivos.reduce((total, inquilino) => {
      return total + (inquilino.montoAlquiler || 0);
    }, 0);
    
    await this.save();
  } catch (error) {
    console.error("Error actualizando estadísticas del propietario:", error);
  }
};

// Método para agregar inquilino
ownerSchema.methods.agregarInquilino = async function (inquilinoId) {
  if (!this.inquilinos.includes(inquilinoId)) {
    this.inquilinos.push(inquilinoId);
    await this.save();
    await this.actualizarEstadisticas();
  }
};

// Método para remover inquilino
ownerSchema.methods.removerInquilino = async function (inquilinoId) {
  this.inquilinos = this.inquilinos.filter(id => !id.equals(inquilinoId));
  await this.save();
  await this.actualizarEstadisticas();
};

// Índices para mejorar el rendimiento
ownerSchema.index({ email: 1 });
ownerSchema.index({ numeroIdentificacion: 1 });
ownerSchema.index({ "nombre": "text", "apellido": "text" });
ownerSchema.index({ activo: 1 });
ownerSchema.index({ fechaRegistro: -1 });

const Owner = mongoose.model("Owner", ownerSchema);

export default Owner;