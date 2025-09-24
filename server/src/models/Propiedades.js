import mongoose from "mongoose";

const propiedadesSchema = new mongoose.Schema(
  {
    // Información básica
    titulo: {
      type: String,
      required: [true, "El título de la propiedad es requerido"],
      trim: true,
      maxlength: [200, "El título no puede exceder 200 caracteres"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
      maxlength: [2000, "La descripción no puede exceder 2000 caracteres"],
    },

    // Tipo de operación
    tipoOperacion: {
      type: String,
      enum: ["venta", "alquiler", "alquiler_temporal"],
      required: [true, "El tipo de operación es requerido"],
    },

    // Tipo de propiedad
    tipoPropiedad: {
      type: String,
      enum: [
        "casa",
        "departamento",
        "ph",
        "duplex",
        "triplex",
        "quinta",
        "terreno",
        "local_comercial",
        "oficina",
        "galpon",
        "deposito",
        "cochera",
        "consultorio",
        "otro",
      ],
      required: [true, "El tipo de propiedad es requerido"],
    },

    // Ubicación
    direccion: {
      calle: {
        type: String,
        required: [true, "La calle es requerida"],
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
        required: [true, "El barrio es requerido"],
        trim: true,
      },
      ciudad: {
        type: String,
        required: [true, "La ciudad es requerida"],
        trim: true,
      },
      provincia: {
        type: String,
        required: [true, "La provincia es requerida"],
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
      coordenadas: {
        latitud: {
          type: Number,
        },
        longitud: {
          type: Number,
        },
      },
    },

    // Características físicas
    caracteristicas: {
      superficieTotal: {
        type: Number,
        required: [true, "La superficie total es requerida"],
        min: [1, "La superficie debe ser mayor a 0"],
      },
      superficieCubierta: {
        type: Number,
        min: [0, "La superficie cubierta no puede ser negativa"],
      },
      ambientes: {
        type: Number,
        min: [1, "Debe tener al menos 1 ambiente"],
      },
      dormitorios: {
        type: Number,
        min: [0, "Los dormitorios no pueden ser negativos"],
        default: 0,
      },
      baños: {
        type: Number,
        min: [0, "Los baños no pueden ser negativos"],
        default: 0,
      },
      toilettes: {
        type: Number,
        min: [0, "Los toilettes no pueden ser negativos"],
        default: 0,
      },
      cocheras: {
        type: Number,
        min: [0, "Las cocheras no pueden ser negativas"],
        default: 0,
      },
      antiguedad: {
        type: Number,
        min: [0, "La antigüedad no puede ser negativa"],
      },
      orientacion: {
        type: String,
        enum: [
          "norte",
          "sur",
          "este",
          "oeste",
          "noreste",
          "noroeste",
          "sureste",
          "suroeste",
        ],
      },
    },

    // Servicios y comodidades
    servicios: {
      agua: { type: Boolean, default: false },
      luz: { type: Boolean, default: false },
      gas: { type: Boolean, default: false },
      cloacas: { type: Boolean, default: false },
      telefono: { type: Boolean, default: false },
      internet: { type: Boolean, default: false },
      cableTV: { type: Boolean, default: false },
      portero: { type: Boolean, default: false },
      seguridad: { type: Boolean, default: false },
      ascensor: { type: Boolean, default: false },
      calefaccion: { type: Boolean, default: false },
      aireAcondicionado: { type: Boolean, default: false },
      piscina: { type: Boolean, default: false },
      jardin: { type: Boolean, default: false },
      terraza: { type: Boolean, default: false },
      balcon: { type: Boolean, default: false },
      parrilla: { type: Boolean, default: false },
      gimnasio: { type: Boolean, default: false },
      sum: { type: Boolean, default: false },
      lavadero: { type: Boolean, default: false },
      baulera: { type: Boolean, default: false },
    },

    // Información económica
    precio: {
      monto: {
        type: Number,
        required: [true, "El precio es requerido"],
        min: [0, "El precio no puede ser negativo"],
      },
      moneda: {
        type: String,
        enum: ["ARS", "USD", "EUR"],
        default: "ARS",
      },
      incluyeExpensas: {
        type: Boolean,
        default: false,
      },
    },

    // Expensas (para alquileres)
    expensas: {
      monto: {
        type: Number,
        min: [0, "Las expensas no pueden ser negativas"],
        default: 0,
      },
      moneda: {
        type: String,
        enum: ["ARS", "USD", "EUR"],
        default: "ARS",
      },
    },

    // Información del propietario
    propietario: {
      nombre: {
        type: String,
        required: [true, "El nombre del propietario es requerido"],
        trim: true,
      },
      telefono: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      direccion: {
        type: String,
        trim: true,
      },
      dni: {
        type: String,
        trim: true,
      },
    },

    // Estado de la propiedad
    estado: {
      type: String,
      enum: ["disponible", "reservada", "vendida", "alquilada", "suspendida"],
      default: "disponible",
    },

    // Información de publicación
    publicacion: {
      fechaPublicacion: {
        type: Date,
        default: Date.now,
      },
      fechaVencimiento: {
        type: Date,
      },
      destacada: {
        type: Boolean,
        default: false,
      },
      activa: {
        type: Boolean,
        default: true,
      },
      visitas: {
        type: Number,
        default: 0,
      },
      consultas: {
        type: Number,
        default: 0,
      },
    },

    // Imágenes (URLs de Cloudinary)
    imagenes: [
      {
        url: {
          type: String,
          required: true,
        },
        descripcion: {
          type: String,
          trim: true,
        },
        esPrincipal: {
          type: Boolean,
          default: false,
        },
        orden: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Documentos adicionales
    documentos: [
      {
        nombre: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
        },
        tipo: {
          type: String,
          enum: [
            "escritura",
            "plano",
            "informe_dominio",
            "certificado_energetico",
            "otro",
          ],
        },
        fechaSubida: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Información del agente responsable
    agenteResponsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El agente responsable es requerido"],
    },

    // Empresa inmobiliaria
    inmobiliaria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La inmobiliaria es requerida"],
    },

    // Notas internas
    notasInternas: {
      type: String,
      trim: true,
      maxlength: [1000, "Las notas internas no pueden exceder 1000 caracteres"],
    },

    // Historial de cambios de precio
    historialPrecios: [
      {
        precio: {
          type: Number,
          required: true,
        },
        moneda: {
          type: String,
          enum: ["ARS", "USD", "EUR"],
          required: true,
        },
        fecha: {
          type: Date,
          default: Date.now,
        },
        motivo: {
          type: String,
          trim: true,
        },
      },
    ],

    // Información de contacto para consultas
    contacto: {
      mostrarTelefono: {
        type: Boolean,
        default: true,
      },
      mostrarEmail: {
        type: Boolean,
        default: true,
      },
      horarioContacto: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar el rendimiento
propiedadesSchema.index({ "direccion.ciudad": 1 });
propiedadesSchema.index({ "direccion.barrio": 1 });
propiedadesSchema.index({ tipoOperacion: 1 });
propiedadesSchema.index({ tipoPropiedad: 1 });
propiedadesSchema.index({ estado: 1 });
propiedadesSchema.index({ "precio.monto": 1 });
propiedadesSchema.index({ "caracteristicas.ambientes": 1 });
propiedadesSchema.index({ "caracteristicas.dormitorios": 1 });
propiedadesSchema.index({ agenteResponsable: 1 });
propiedadesSchema.index({ inmobiliaria: 1 });
propiedadesSchema.index({ "publicacion.activa": 1 });
propiedadesSchema.index({ "publicacion.destacada": 1 });
propiedadesSchema.index({ createdAt: -1 });

// Índice compuesto para búsquedas comunes
propiedadesSchema.index({
  tipoOperacion: 1,
  tipoPropiedad: 1,
  "direccion.ciudad": 1,
  estado: 1,
});

// Método para obtener la imagen principal
propiedadesSchema.methods.getImagenPrincipal = function () {
  const imagenPrincipal = this.imagenes.find((img) => img.esPrincipal);
  return imagenPrincipal || this.imagenes[0] || null;
};

// Método para generar slug de la propiedad
propiedadesSchema.methods.generateSlug = function () {
  const slug =
    `${this.tipoOperacion}-${this.tipoPropiedad}-${this.direccion.barrio}-${this._id}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  return slug;
};

// Método para incrementar visitas
propiedadesSchema.methods.incrementarVisitas = function () {
  this.publicacion.visitas += 1;
  return this.save();
};

// Método para incrementar consultas
propiedadesSchema.methods.incrementarConsultas = function () {
  this.publicacion.consultas += 1;
  return this.save();
};

// Método para cambiar estado
propiedadesSchema.methods.cambiarEstado = function (nuevoEstado, motivo = "") {
  this.estado = nuevoEstado;
  if (nuevoEstado === "vendida" || nuevoEstado === "alquilada") {
    this.publicacion.activa = false;
  }
  return this.save();
};

// Método para agregar cambio de precio al historial
propiedadesSchema.methods.cambiarPrecio = function (
  nuevoPrecio,
  nuevaMoneda,
  motivo = ""
) {
  // Agregar al historial
  this.historialPrecios.push({
    precio: this.precio.monto,
    moneda: this.precio.moneda,
    motivo: motivo || "Cambio de precio",
  });

  // Actualizar precio actual
  this.precio.monto = nuevoPrecio;
  this.precio.moneda = nuevaMoneda;

  return this.save();
};

// Middleware para establecer imagen principal si no existe
propiedadesSchema.pre("save", function (next) {
  if (this.imagenes && this.imagenes.length > 0) {
    const tienePrincipal = this.imagenes.some((img) => img.esPrincipal);
    if (!tienePrincipal) {
      this.imagenes[0].esPrincipal = true;
    }
  }
  next();
});

const Propiedades = mongoose.model("Propiedades", propiedadesSchema);

export default Propiedades;
