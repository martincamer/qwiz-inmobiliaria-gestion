import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // Campos esenciales para populate y relaciones
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },

    currentTenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },

    // Historial de contratos
    contractHistory: [
      {
        tenant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tenant",
        },
        startDate: Date,
        endDate: Date,
        deposit: Number,
        active: {
          type: Boolean,
          default: false,
        },
        reason: String,
      },
    ],

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
    views: {
      type: Number,
      default: 0,
    },

    favorites: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false, // Permite campos dinámicos del cliente
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices básicos para rendimiento
propertySchema.index({ featured: 1, published: 1 });
propertySchema.index({ createdAt: -1 });

// Índices dinámicos que se crearán si los campos existen
propertySchema.index({ owner: 1 }, { sparse: true });
propertySchema.index({ status: 1 }, { sparse: true });
propertySchema.index({ type: 1 }, { sparse: true });

// Virtual para obtener datos básicos
propertySchema.virtual("basicInfo").get(function () {
  return {
    id: this._id,
    title: this.title || "Sin título",
    status: this.status || "Disponible",
    type: this.type || "Propiedad",
    createdAt: this.createdAt,
    views: this.views,
    featured: this.featured,
  };
});

// Middleware para actualizar updatedAt automáticamente
propertySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para incrementar vistas
propertySchema.methods.incrementViews = function () {
  this.views = (this.views || 0) + 1;
  return this.save();
};

// Método para alternar favorito
propertySchema.methods.toggleFavorite = function (increment = true) {
  if (increment) {
    this.favorites = (this.favorites || 0) + 1;
  } else {
    this.favorites = Math.max(0, (this.favorites || 0) - 1);
  }
  return this.save();
};

// Método estático para búsqueda flexible
propertySchema.statics.flexibleSearch = function (filters = {}) {
  const query = { published: { $ne: false } }; // Busca publicadas por defecto

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

const Property = mongoose.model("Property", propertySchema);

export default Property;
