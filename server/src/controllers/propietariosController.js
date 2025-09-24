import Propietarios from "../models/Propietarios.js";

// @desc    Crear nuevo propietario
// @route   POST /api/propietarios
// @access  Private
export const createPropietario = async (req, res) => {
  try {
    const propietarioData = {
      ...req.body,
      usuario: req.user._id,
      inmobiliaria: req.user._id,
      creadoPor: req.user._id,
    };

    const propietario = await Propietarios.create(propietarioData);

    res.status(201).json({
      success: true,
      message: "Propietario creado exitosamente",
      data: { propietario },
    });
  } catch (error) {
    console.error("Error creando propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Obtener todos los propietarios de la inmobiliaria
// @route   GET /api/propietarios
// @access  Private
export const getPropietarios = async (req, res) => {
  try {
    const propietarios = await Propietarios.find({ inmobiliaria: req.user._id })
      .populate("propiedades", "titulo direccion.calle direccion.numero")
      .populate("creadoPor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { propietarios, total: propietarios.length },
    });
  } catch (error) {
    console.error("Error obteniendo propietarios:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener propietario por ID
// @route   GET /api/propietarios/:id
// @access  Private
export const getPropietarioById = async (req, res) => {
  try {
    const propietario = await Propietarios.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    })
      .populate("propiedades", "titulo direccion tipoPropiedad tipoOperacion precio estado")
      .populate("creadoPor", "name email")
      .populate("modificadoPor", "name email");

    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: { propietario },
    });
  } catch (error) {
    console.error("Error obteniendo propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Actualizar propietario
// @route   PUT /api/propietarios/:id
// @access  Private
export const updatePropietario = async (req, res) => {
  try {
    const propietario = await Propietarios.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    const propietarioActualizado = await Propietarios.findByIdAndUpdate(
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
      .populate("propiedades", "titulo direccion.calle direccion.numero")
      .populate("creadoPor", "name email")
      .populate("modificadoPor", "name email");

    res.status(200).json({
      success: true,
      message: "Propietario actualizado exitosamente",
      data: { propietario: propietarioActualizado },
    });
  } catch (error) {
    console.error("Error actualizando propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Eliminar propietario
// @route   DELETE /api/propietarios/:id
// @access  Private
export const deletePropietario = async (req, res) => {
  try {
    const propietario = await Propietarios.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    // Verificar si tiene propiedades asociadas
    if (propietario.propiedades && propietario.propiedades.length > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar el propietario porque tiene propiedades asociadas",
      });
    }

    await Propietarios.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Propietario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error eliminando propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Cambiar estado del propietario
// @route   PATCH /api/propietarios/:id/estado
// @access  Private
export const cambiarEstadoPropietario = async (req, res) => {
  try {
    const { estado } = req.body;

    const propietario = await Propietarios.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    propietario.estado = estado;
    propietario.modificadoPor = req.user._id;
    await propietario.save();

    res.status(200).json({
      success: true,
      message: "Estado del propietario actualizado exitosamente",
      data: { propietario },
    });
  } catch (error) {
    console.error("Error cambiando estado:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Agregar propiedad al propietario
// @route   PATCH /api/propietarios/:id/propiedades
// @access  Private
export const agregarPropiedad = async (req, res) => {
  try {
    const { propiedadId } = req.body;

    const propietario = await Propietarios.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    // Verificar si la propiedad ya está asociada
    if (propietario.propiedades.includes(propiedadId)) {
      return res.status(400).json({
        success: false,
        message: "La propiedad ya está asociada a este propietario",
      });
    }

    propietario.propiedades.push(propiedadId);
    propietario.modificadoPor = req.user._id;
    await propietario.save();

    const propietarioActualizado = await Propietarios.findById(req.params.id)
      .populate("propiedades", "titulo direccion.calle direccion.numero");

    res.status(200).json({
      success: true,
      message: "Propiedad agregada exitosamente",
      data: { propietario: propietarioActualizado },
    });
  } catch (error) {
    console.error("Error agregando propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Remover propiedad del propietario
// @route   DELETE /api/propietarios/:id/propiedades/:propiedadId
// @access  Private
export const removerPropiedad = async (req, res) => {
  try {
    const { propiedadId } = req.params;

    const propietario = await Propietarios.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    propietario.propiedades = propietario.propiedades.filter(
      (prop) => prop.toString() !== propiedadId
    );
    propietario.modificadoPor = req.user._id;
    await propietario.save();

    const propietarioActualizado = await Propietarios.findById(req.params.id)
      .populate("propiedades", "titulo direccion.calle direccion.numero");

    res.status(200).json({
      success: true,
      message: "Propiedad removida exitosamente",
      data: { propietario: propietarioActualizado },
    });
  } catch (error) {
    console.error("Error removiendo propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};