import Propiedades from "../models/Propiedades.js";

// @desc    Crear nueva propiedad
// @route   POST /api/propiedades
// @access  Private
export const createPropiedad = async (req, res) => {
  try {
    const propiedadData = {
      ...req.body,
      agenteResponsable: req.user._id,
      inmobiliaria: req.user._id,
    };

    const propiedad = await Propiedades.create(propiedadData);

    res.status(201).json({
      success: true,
      message: "Propiedad creada exitosamente",
      data: { propiedad },
    });
  } catch (error) {
    console.error("Error creando propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Obtener todas las propiedades de la inmobiliaria
// @route   GET /api/propiedades
// @access  Private
export const getPropiedades = async (req, res) => {
  try {
    const propiedades = await Propiedades.find({ inmobiliaria: req.user._id })
      .populate("agenteResponsable", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { propiedades, total: propiedades.length },
    });
  } catch (error) {
    console.error("Error obteniendo propiedades:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener propiedad por ID
// @route   GET /api/propiedades/:id
// @access  Private
export const getPropiedadById = async (req, res) => {
  try {
    const propiedad = await Propiedades.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    }).populate("agenteResponsable", "name email");

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: { propiedad },
    });
  } catch (error) {
    console.error("Error obteniendo propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Actualizar propiedad
// @route   PUT /api/propiedades/:id
// @access  Private
export const updatePropiedad = async (req, res) => {
  try {
    const propiedad = await Propiedades.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    const propiedadActualizada = await Propiedades.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("agenteResponsable", "name email");

    res.status(200).json({
      success: true,
      message: "Propiedad actualizada exitosamente",
      data: { propiedad: propiedadActualizada },
    });
  } catch (error) {
    console.error("Error actualizando propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Eliminar propiedad
// @route   DELETE /api/propiedades/:id
// @access  Private
export const deletePropiedad = async (req, res) => {
  try {
    const propiedad = await Propiedades.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    await Propiedades.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Propiedad eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error eliminando propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Cambiar estado de propiedad
// @route   PATCH /api/propiedades/:id/estado
// @access  Private
export const cambiarEstadoPropiedad = async (req, res) => {
  try {
    const { estado, motivo } = req.body;

    const propiedad = await Propiedades.findOne({
      _id: req.params.id,
      inmobiliaria: req.user._id,
    });

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    await propiedad.cambiarEstado(estado, motivo);

    res.status(200).json({
      success: true,
      message: "Estado de propiedad actualizado exitosamente",
      data: { propiedad },
    });
  } catch (error) {
    console.error("Error cambiando estado:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Incrementar visitas de propiedad
// @route   PATCH /api/propiedades/:id/visitas
// @access  Public
export const incrementarVisitas = async (req, res) => {
  try {
    const propiedad = await Propiedades.findById(req.params.id);

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    await propiedad.incrementarVisitas();

    res.status(200).json({
      success: true,
      message: "Visita registrada exitosamente",
    });
  } catch (error) {
    console.error("Error incrementando visitas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Incrementar consultas de propiedad
// @route   PATCH /api/propiedades/:id/consultas
// @access  Public
export const incrementarConsultas = async (req, res) => {
  try {
    const propiedad = await Propiedades.findById(req.params.id);

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    await propiedad.incrementarConsultas();

    res.status(200).json({
      success: true,
      message: "Consulta registrada exitosamente",
    });
  } catch (error) {
    console.error("Error incrementando consultas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
