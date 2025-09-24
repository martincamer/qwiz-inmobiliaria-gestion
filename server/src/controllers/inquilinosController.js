import Inquilinos from "../models/Inquilinos.js";

// @desc    Crear nuevo inquilino
// @route   POST /api/inquilinos
// @access  Private
export const createInquilino = async (req, res) => {
  try {
    const inquilinoData = {
      ...req.body,
      usuario: req.user._id,
      inmobiliaria: req.user._id,
      creadoPor: req.user._id,
    };

    const inquilino = await Inquilinos.create(inquilinoData);

    res.status(201).json({
      success: true,
      message: "Inquilino creado exitosamente",
      data: { inquilino },
    });
  } catch (error) {
    console.error("Error creando inquilino:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Obtener todos los inquilinos de la inmobiliaria
// @route   GET /api/inquilinos
// @access  Private
export const getInquilinos = async (req, res) => {
  try {
    const inquilinos = await Inquilinos.find({ inmobiliaria: req.user._id })
      .populate("contratos.propiedad", "titulo direccion.calle direccion.numero")
      .populate("contratos.propietario", "nombre apellido")
      .populate("creadoPor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { inquilinos, total: inquilinos.length },
    });
  } catch (error) {
    console.error("Error obteniendo inquilinos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener inquilino por ID
// @route   GET /api/inquilinos/:id
// @access  Private
export const getInquilinoById = async (req, res) => {
  try {
    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    })
      .populate("contratos.propiedad", "titulo direccion tipoPropiedad tipoOperacion precio estado")
      .populate("contratos.propietario", "nombre apellido contacto")
      .populate("creadoPor", "name email")
      .populate("modificadoPor", "name email");

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: { inquilino },
    });
  } catch (error) {
    console.error("Error obteniendo inquilino:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Actualizar inquilino
// @route   PUT /api/inquilinos/:id
// @access  Private
export const updateInquilino = async (req, res) => {
  try {
    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    const inquilinoActualizado = await Inquilinos.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        modificadoPor: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("contratos.propiedad", "titulo direccion.calle direccion.numero")
      .populate("contratos.propietario", "nombre apellido")
      .populate("creadoPor", "name email")
      .populate("modificadoPor", "name email");

    res.status(200).json({
      success: true,
      message: "Inquilino actualizado exitosamente",
      data: { inquilino: inquilinoActualizado },
    });
  } catch (error) {
    console.error("Error actualizando inquilino:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Eliminar inquilino
// @route   DELETE /api/inquilinos/:id
// @access  Private
export const deleteInquilino = async (req, res) => {
  try {
    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    // Verificar si tiene contratos activos
    const contratosActivos = inquilino.getContratosActivos();
    if (contratosActivos.length > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar el inquilino porque tiene contratos activos",
      });
    }

    await Inquilinos.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Inquilino eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error eliminando inquilino:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Cambiar estado del inquilino
// @route   PATCH /api/inquilinos/:id/estado
// @access  Private
export const cambiarEstadoInquilino = async (req, res) => {
  try {
    const { estado } = req.body;

    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    inquilino.estado = estado;
    inquilino.modificadoPor = req.user._id;
    await inquilino.save();

    res.status(200).json({
      success: true,
      message: "Estado del inquilino actualizado exitosamente",
      data: { inquilino },
    });
  } catch (error) {
    console.error("Error cambiando estado:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Agregar contrato al inquilino
// @route   POST /api/inquilinos/:id/contratos
// @access  Private
export const agregarContrato = async (req, res) => {
  try {
    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    await inquilino.agregarContrato(req.body);

    const inquilinoActualizado = await Inquilinos.findById(req.params.id)
      .populate("contratos.propiedad", "titulo direccion.calle direccion.numero")
      .populate("contratos.propietario", "nombre apellido");

    res.status(200).json({
      success: true,
      message: "Contrato agregado exitosamente",
      data: { inquilino: inquilinoActualizado },
    });
  } catch (error) {
    console.error("Error agregando contrato:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Agregar factura al inquilino
// @route   POST /api/inquilinos/:id/facturas
// @access  Private
export const agregarFactura = async (req, res) => {
  try {
    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    await inquilino.agregarFactura(req.body);

    res.status(200).json({
      success: true,
      message: "Factura agregada exitosamente",
      data: { inquilino },
    });
  } catch (error) {
    console.error("Error agregando factura:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Agregar cobranza al inquilino
// @route   POST /api/inquilinos/:id/cobranzas
// @access  Private
export const agregarCobranza = async (req, res) => {
  try {
    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    await inquilino.agregarCobranza(req.body);

    res.status(200).json({
      success: true,
      message: "Cobranza agregada exitosamente",
      data: { inquilino },
    });
  } catch (error) {
    console.error("Error agregando cobranza:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener facturas pendientes del inquilino
// @route   GET /api/inquilinos/:id/facturas-pendientes
// @access  Private
export const getFacturasPendientes = async (req, res) => {
  try {
    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    const facturasPendientes = inquilino.getFacturasPendientes();

    res.status(200).json({
      success: true,
      data: { facturas: facturasPendientes, total: facturasPendientes.length },
    });
  } catch (error) {
    console.error("Error obteniendo facturas pendientes:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener estado de cuenta corriente del inquilino
// @route   GET /api/inquilinos/:id/cuenta-corriente
// @access  Private
export const getCuentaCorriente = async (req, res) => {
  try {
    const inquilino = await Inquilinos.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    const saldoCuentaCorriente = inquilino.getSaldoCuentaCorriente();
    const facturasPendientes = inquilino.getFacturasPendientes();
    const facturasVencidas = inquilino.getFacturasVencidas();
    const estaEnMora = inquilino.estaEnMora();

    res.status(200).json({
      success: true,
      data: {
        saldo: saldoCuentaCorriente,
        facturasPendientes: facturasPendientes.length,
        facturasVencidas: facturasVencidas.length,
        estaEnMora,
      },
    });
  } catch (error) {
    console.error("Error obteniendo cuenta corriente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};