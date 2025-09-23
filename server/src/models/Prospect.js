import mongoose from "mongoose";

const prospectSchema = new mongoose.Schema(
  {
    // Campos esenciales para populate y relaciones
    agente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // Información de seguimiento (campos estructurados importantes)
    interacciones: [{
      tipo: {
        type: String,
        enum: ["LLAMADA", "EMAIL", "WHATSAPP", "REUNION", "VISITA", "OTRO"],
        required: true
      },
      descripcion: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, "La descripción no puede exceder 500 caracteres"]
      },
      fecha: {
        type: Date,
        default: Date.now
      },
      resultado: {
        type: String,
        enum: ["EXITOSO", "SIN_RESPUESTA", "REAGENDAR", "NO_INTERESADO"],
        default: "EXITOSO"
      }
    }],

    // Propiedades mostradas
    propiedadesMostradas: [{
      propiedad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
      },
      fechaMostrada: {
        type: Date,
        default: Date.now
      },
      interes: {
        type: String,
        enum: ["ALTO", "MEDIO", "BAJO", "NINGUNO"],
        default: "MEDIO"
      },
      comentarios: {
        type: String,
        maxlength: [500, "Los comentarios no pueden exceder 500 caracteres"]
      }
    }],

    // Fechas de auditoría (automáticas)
    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    },

    // Usuario que creó/modificó (opcional)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // Campos del sistema (automáticos)
    views: {
      type: Number,
      default: 0
    },

    favorites: {
      type: Number,
      default: 0
    },

    featured: {
      type: Boolean,
      default: false
    },

    // Estado activo
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    strict: false, // Permite campos dinámicos del cliente
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices básicos para rendimiento
prospectSchema.index({ featured: 1, activo: 1 });
prospectSchema.index({ createdAt: -1 });

// Índices dinámicos que se crearán si los campos existen
prospectSchema.index({ agente: 1 }, { sparse: true });
prospectSchema.index({ estado: 1 }, { sparse: true });
prospectSchema.index({ origen: 1 }, { sparse: true });
prospectSchema.index({ prioridad: 1 }, { sparse: true });
prospectSchema.index({ email: 1 }, { sparse: true });
prospectSchema.index({ telefono: 1 }, { sparse: true });
prospectSchema.index({ activo: 1 });

// Virtual para obtener datos básicos
prospectSchema.virtual("basicInfo").get(function () {
  return {
    id: this._id,
    nombre: this.nombre || "Sin nombre",
    apellido: this.apellido || "Sin apellido",
    email: this.email || "Sin email",
    telefono: this.telefono || "Sin teléfono",
    estado: this.estado || "NUEVO",
    createdAt: this.createdAt,
    views: this.views,
    featured: this.featured,
  };
});

// Virtual para nombre completo (si existen los campos)
prospectSchema.virtual("nombreCompleto").get(function () {
  if (this.nombre && this.apellido) {
    return `${this.nombre} ${this.apellido}`;
  }
  return this.nombre || this.apellido || "Sin nombre";
});

// Virtual para dirección completa (si existe el campo)
prospectSchema.virtual("direccionCompleta").get(function () {
  if (!this.direccion) return "";
  
  const { calle, numero, piso, departamento, ciudad, provincia } = this.direccion;
  let direccionCompleta = "";
  
  if (calle) direccionCompleta += calle;
  if (numero) direccionCompleta += ` ${numero}`;
  if (piso) direccionCompleta += `, Piso ${piso}`;
  if (departamento) direccionCompleta += `, Depto ${departamento}`;
  if (ciudad) direccionCompleta += `, ${ciudad}`;
  if (provincia) direccionCompleta += `, ${provincia}`;
  
  return direccionCompleta.trim();
});

// Middleware para actualizar updatedAt automáticamente
prospectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para incrementar vistas
prospectSchema.methods.incrementViews = function () {
  this.views = (this.views || 0) + 1;
  return this.save();
};

// Método para alternar favorito
prospectSchema.methods.toggleFavorite = function (increment = true) {
  if (increment) {
    this.favorites = (this.favorites || 0) + 1;
  } else {
    this.favorites = Math.max(0, (this.favorites || 0) - 1);
  }
  return this.save();
};

// Método para obtener perfil público
prospectSchema.methods.obtenerPerfilPublico = function () {
  const { password, ...perfilPublico } = this.toObject();
  return perfilPublico;
};

// Método para agregar interacción
prospectSchema.methods.agregarInteraccion = function (interaccion) {
  this.interacciones.push(interaccion);
  if (this.fechaUltimoContacto !== undefined) {
    this.fechaUltimoContacto = new Date();
  }
  return this.save();
};

// Método para actualizar estado
prospectSchema.methods.actualizarEstado = function (nuevoEstado) {
  this.estado = nuevoEstado;
  if (this.fechaUltimoContacto !== undefined) {
    this.fechaUltimoContacto = new Date();
  }
  return this.save();
};

// Método para mostrar propiedad
prospectSchema.methods.mostrarPropiedad = function (propiedadId, interes, comentarios) {
  this.propiedadesMostradas.push({
    propiedad: propiedadId,
    interes,
    comentarios
  });
  return this.save();
};

// Método estático para búsqueda flexible
prospectSchema.statics.flexibleSearch = function (filters = {}) {
  const query = { activo: { $ne: false } }; // Busca activos por defecto

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

  return this.find(query).sort({ featured: -1, createdAt: -1 });
};

const Prospect = mongoose.model("Prospect", prospectSchema);

export default Prospect;