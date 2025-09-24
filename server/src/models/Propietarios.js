import mongoose from "mongoose";

const propietariosSchema = new mongoose.Schema(
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

    // Dirección
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
      categoriaMonotributo: {
        type: String,
        enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
      },
      ingresosBrutos: {
        type: String,
        trim: true,
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
      titular: {
        type: String,
        trim: true,
      },
    },

    // Estado del propietario
    estado: {
      type: String,
      enum: ["activo", "inactivo", "suspendido"],
      default: "activo",
    },

    // Observaciones y notas
    observaciones: {
      type: String,
      trim: true,
      maxlength: [1000, "Las observaciones no pueden exceder 1000 caracteres"],
    },

    // Propiedades asociadas
    propiedades: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Propiedades",
    }],

    // Documentos del propietario
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
          "cuit",
          "constancia_ingresos",
          "escritura",
          "titulo_propiedad",
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
propietariosSchema.index({ numeroDocumento: 1 });
propietariosSchema.index({ "contacto.email": 1 });
propietariosSchema.index({ estado: 1 });
propietariosSchema.index({ usuario: 1 });
propietariosSchema.index({ inmobiliaria: 1 });
propietariosSchema.index({ createdAt: -1 });

// Índice compuesto para búsquedas
propietariosSchema.index({ 
  inmobiliaria: 1, 
  estado: 1, 
  "contacto.email": 1 
});

// Método para obtener nombre completo
propietariosSchema.methods.getNombreCompleto = function() {
  return `${this.nombre} ${this.apellido}`;
};

const Propietarios = mongoose.model("Propietarios", propietariosSchema);

export default Propietarios;