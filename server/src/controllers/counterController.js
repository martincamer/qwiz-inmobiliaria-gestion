import Counter from "../models/Counter.js";

// Obtener todos los contadores de la empresa
export const getCounters = async (req, res) => {
  try {
    const companyId = req.user.company.id;

    const counters = await Counter.getCountersByCompany(companyId);

    res.status(200).json({
      success: true,
      message: "Contadores obtenidos exitosamente",
      data: counters,
    });
  } catch (error) {
    console.error("Error al obtener contadores:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Configurar formato de numeración
export const configurarFormato = async (req, res) => {
  try {
    const { tipo } = req.params;
    const { prefijo, sufijo, formato } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    // Validar tipo de documento
    const tiposValidos = [
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
      "nota_debito",
    ];

    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de documento no válido",
      });
    }

    const counter = await Counter.configurarFormato(
      companyId,
      tipo,
      { prefijo, sufijo, formato },
      userId
    );

    res.status(200).json({
      success: true,
      message: "Formato configurado exitosamente",
      data: counter,
    });
  } catch (error) {
    console.error("Error al configurar formato:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Resetear contador
export const resetCounter = async (req, res) => {
  try {
    const { tipo } = req.params;
    const { nuevoValor = 0 } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    // Validar que el nuevo valor sea un número válido
    if (typeof nuevoValor !== "number" || nuevoValor < 0) {
      return res.status(400).json({
        success: false,
        message: "El nuevo valor debe ser un número mayor o igual a 0",
      });
    }

    const counter = await Counter.resetCounter(
      companyId,
      tipo,
      nuevoValor,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Contador reseteado exitosamente",
      data: counter,
    });
  } catch (error) {
    console.error("Error al resetear contador:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener siguiente número (solo vista previa, no incrementa el contador)
export const getNextNumber = async (req, res) => {
  try {
    const { tipo } = req.params;
    const companyId = req.user.company.id;

    // Buscar el contador actual sin incrementar
    let counter = await Counter.findOne({ companyId, tipo, activo: true });
    
    if (!counter) {
      // Si no existe, crear uno nuevo con valores por defecto
      counter = {
        contador: 0,
        prefijo: "",
        sufijo: "",
        formato: "00000000",
        puntoVenta: "0001"
      };
    }

    // Calcular el siguiente número sin incrementar
    const siguienteContador = counter.contador + 1;
    const numeroFormateado = siguienteContador.toString().padStart(
      counter.formato.length,
      "0"
    );
    const numeroFinal = `${counter.prefijo}${counter.puntoVenta}-${numeroFormateado}${counter.sufijo}`;

    res.json({
      success: true,
      data: {
        numero: numeroFinal,
        contador: siguienteContador,
        prefijo: counter.prefijo,
        sufijo: counter.sufijo,
        puntoVenta: counter.puntoVenta,
      },
    });
  } catch (error) {
    console.error("Error al obtener siguiente número:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Generar y consumir siguiente número
export const generateNextNumber = async (req, res) => {
  try {
    const { tipo } = req.params;
    const companyId = req.user.company.id;
    const userId = req.user._id;

    const numeroData = await Counter.getNextNumber(companyId, tipo, userId);

    res.json({
      success: true,
      data: numeroData,
    });
  } catch (error) {
    console.error("Error al generar siguiente número:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};