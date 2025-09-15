import mongoose from "mongoose";

// Schema para manejar contadores de numeración automática
const counterSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: [true, "El ID de la empresa es requerido"],
      index: true,
    },
    tipo: {
      type: String,
      enum: [
        "factura_A",
        "factura_B",
        "factura_C",
        "factura_E",
        "factura_M",
        "presupuesto",
        "recibo_efectivo",
        "comprobante_bancario",
        "cheque",
        "nota_credito",
        "nota_debito"
      ],
      required: [true, "El tipo de documento es requerido"],
    },
    contador: {
      type: Number,
      default: 0,
      min: [0, "El contador no puede ser negativo"],
    },
    puntoVenta: {
      type: String,
      trim: true,
      default: "0001", // Punto de venta por defecto
    },
    prefijo: {
      type: String,
      trim: true,
      default: "",
    },
    sufijo: {
      type: String,
      trim: true,
      default: "",
    },
    formato: {
      type: String,
      default: "00000000", // Formato de padding con ceros para el número secuencial
    },
    activo: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para evitar duplicados
counterSchema.index({ companyId: 1, tipo: 1 }, { unique: true });

// Método estático para obtener el siguiente número
counterSchema.statics.getNextNumber = async function (companyId, tipo, userId) {
  try {
    // Buscar o crear el contador
    let counter = await this.findOneAndUpdate(
      { companyId, tipo, activo: true },
      {
        $inc: { contador: 1 },
        $set: { lastModifiedBy: userId },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // Si es un nuevo documento, establecer el createdBy
    if (!counter.createdBy) {
      counter.createdBy = userId;
      await counter.save();
    }

    // Formatear el número según el formato especificado
    const numeroFormateado = counter.contador.toString().padStart(
      counter.formato.length,
      "0"
    );

    // Construir el número final con formato punto de venta-número secuencial
    const numeroFinal = `${counter.prefijo}${counter.puntoVenta}-${numeroFormateado}${counter.sufijo}`;

    return {
      numero: numeroFinal,
      contador: counter.contador,
      prefijo: counter.prefijo,
      sufijo: counter.sufijo,
      puntoVenta: counter.puntoVenta,
    };
  } catch (error) {
    throw new Error(`Error al generar número automático: ${error.message}`);
  }
};

// Método estático para resetear un contador
counterSchema.statics.resetCounter = async function (companyId, tipo, nuevoValor = 0, userId) {
  try {
    const counter = await this.findOneAndUpdate(
      { companyId, tipo },
      {
        $set: {
          contador: nuevoValor,
          lastModifiedBy: userId,
        },
      },
      { new: true }
    );

    if (!counter) {
      throw new Error(`Contador no encontrado para ${tipo} en empresa ${companyId}`);
    }

    return counter;
  } catch (error) {
    throw new Error(`Error al resetear contador: ${error.message}`);
  }
};

// Método estático para configurar formato de numeración
counterSchema.statics.configurarFormato = async function (
  companyId,
  tipo,
  { prefijo = "", sufijo = "", formato = "00000000", puntoVenta = "0001" },
  userId
) {
  try {
    const counter = await this.findOneAndUpdate(
      { companyId, tipo },
      {
        $set: {
          prefijo,
          sufijo,
          formato,
          puntoVenta,
          lastModifiedBy: userId,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // Si es un nuevo documento, establecer el createdBy
    if (!counter.createdBy) {
      counter.createdBy = userId;
      await counter.save();
    }

    return counter;
  } catch (error) {
    throw new Error(`Error al configurar formato: ${error.message}`);
  }
};

// Método estático para obtener todos los contadores de una empresa
counterSchema.statics.getCountersByCompany = async function (companyId) {
  try {
    return await this.find({ companyId, activo: true }).sort({ tipo: 1 });
  } catch (error) {
    throw new Error(`Error al obtener contadores: ${error.message}`);
  }
};

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;