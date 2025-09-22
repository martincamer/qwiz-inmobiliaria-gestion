import Owner from "../models/Owner.js";
import Tenant from "../models/Tenant.js";
import { validationResult } from "express-validator";

// @desc    Crear un nuevo propietario
// @route   POST /api/propietarios
// @access  Private
export const crearPropietario = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }

    const {
      nombre,
      apellido,
      email,
      telefono,
      numeroIdentificacion,
      tipoIdentificacion,
      direccion,
      informacionBancaria,
      informacionFiscal,
      password,
      notas,
      configuracionNotificaciones,
    } = req.body;

    // Verificar si el email ya existe
    const propietarioExistente = await Owner.findOne({ email });
    if (propietarioExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un propietario con este email",
      });
    }

    // Verificar si el número de identificación ya existe
    const identificacionExistente = await Owner.findOne({ numeroIdentificacion });
    if (identificacionExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un propietario con este número de identificación",
      });
    }

    // Crear el nuevo propietario
    const nuevoPropietario = new Owner({
      nombre,
      apellido,
      email,
      telefono,
      numeroIdentificacion,
      tipoIdentificacion,
      direccion,
      informacionBancaria,
      informacionFiscal,
      password,
      notas,
      configuracionNotificaciones,
    });

    await nuevoPropietario.save();

    res.status(201).json({
      success: true,
      message: "Propietario creado exitosamente",
      data: nuevoPropietario.obtenerPerfilPublico(),
    });
  } catch (error) {
    console.error("Error al crear propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener todos los propietarios
// @route   GET /api/propietarios
// @access  Private
export const obtenerPropietarios = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      activo,
      tipoIdentificacion,
      sortBy = "fechaRegistro",
      sortOrder = "desc",
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (search) {
      filtros.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { apellido: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { numeroIdentificacion: { $regex: search, $options: "i" } },
      ];
    }

    if (activo !== undefined) {
      filtros.activo = activo === "true";
    }

    if (tipoIdentificacion) {
      filtros.tipoIdentificacion = tipoIdentificacion;
    }

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Ejecutar consulta
    const propietarios = await Owner.find(filtros)
      .select("-password")
      .populate("inquilinos", "name email phone status")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Owner.countDocuments(filtros);

    res.status(200).json({
      success: true,
      data: propietarios,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener propietarios:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener un propietario por ID
// @route   GET /api/propietarios/:id
// @access  Private
export const obtenerPropietarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const propietario = await Owner.findById(id)
      .select("-password")
      .populate("inquilinos", "name email phone status contract.rentAmount")
      .populate("propiedades");

    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: propietario,
    });
  } catch (error) {
    console.error("Error al obtener propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Actualizar un propietario
// @route   PUT /api/propietarios/:id
// @access  Private
export const actualizarPropietario = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }

    const propietario = await Owner.findById(id);
    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    // Verificar email único (si se está cambiando)
    if (req.body.email && req.body.email !== propietario.email) {
      const emailExistente = await Owner.findOne({ email: req.body.email });
      if (emailExistente) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un propietario con este email",
        });
      }
    }

    // Verificar número de identificación único (si se está cambiando)
    if (req.body.numeroIdentificacion && req.body.numeroIdentificacion !== propietario.numeroIdentificacion) {
      const identificacionExistente = await Owner.findOne({ 
        numeroIdentificacion: req.body.numeroIdentificacion 
      });
      if (identificacionExistente) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un propietario con este número de identificación",
        });
      }
    }

    // Actualizar campos
    const camposPermitidos = [
      "nombre", "apellido", "email", "telefono", "numeroIdentificacion",
      "tipoIdentificacion", "direccion", "informacionBancaria", 
      "informacionFiscal", "notas", "configuracionNotificaciones", "activo"
    ];

    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        propietario[campo] = req.body[campo];
      }
    });

    await propietario.save();
    await propietario.actualizarEstadisticas();

    res.status(200).json({
      success: true,
      message: "Propietario actualizado exitosamente",
      data: propietario.obtenerPerfilPublico(),
    });
  } catch (error) {
    console.error("Error al actualizar propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Eliminar un propietario
// @route   DELETE /api/propietarios/:id
// @access  Private
export const eliminarPropietario = async (req, res) => {
  try {
    const { id } = req.params;

    const propietario = await Owner.findById(id);
    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    // Verificar si tiene inquilinos activos
    const inquilinosActivos = await Tenant.countDocuments({
      propietario: id,
      status: "activo",
    });

    if (inquilinosActivos > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar el propietario porque tiene inquilinos activos",
      });
    }

    await Owner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Propietario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener inquilinos de un propietario
// @route   GET /api/propietarios/:id/inquilinos
// @access  Private
export const obtenerInquilinosPropietario = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const propietario = await Owner.findById(id);
    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    // Construir filtros
    const filtros = { propietario: id };
    if (status) {
      filtros.status = status;
    }

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inquilinos = await Tenant.find(filtros)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Tenant.countDocuments(filtros);

    res.status(200).json({
      success: true,
      data: inquilinos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener inquilinos del propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener estadísticas de un propietario
// @route   GET /api/propietarios/:id/estadisticas
// @access  Private
export const obtenerEstadisticasPropietario = async (req, res) => {
  try {
    const { id } = req.params;

    const propietario = await Owner.findById(id);
    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    // Actualizar estadísticas antes de devolverlas
    await propietario.actualizarEstadisticas();

    // Obtener estadísticas adicionales
    const inquilinosActivos = await Tenant.countDocuments({
      propietario: id,
      status: "activo",
    });

    const inquilinosInactivos = await Tenant.countDocuments({
      propietario: id,
      status: { $ne: "activo" },
    });

    // Calcular pagos del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const finMes = new Date();
    finMes.setMonth(finMes.getMonth() + 1);
    finMes.setDate(0);
    finMes.setHours(23, 59, 59, 999);

    const pagosMesActual = await Tenant.aggregate([
      { $match: { propietario: propietario._id } },
      { $unwind: "$paymentHistory" },
      {
        $match: {
          "paymentHistory.dueDate": { $gte: inicioMes, $lte: finMes },
          "paymentHistory.status": "pagado",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentHistory.amount" },
          cantidad: { $sum: 1 },
        },
      },
    ]);

    const estadisticas = {
      ...propietario.estadisticas.toObject(),
      inquilinosActivos,
      inquilinosInactivos,
      pagosMesActual: pagosMesActual[0] || { total: 0, cantidad: 0 },
    };

    res.status(200).json({
      success: true,
      data: estadisticas,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas del propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Cambiar contraseña del propietario
// @route   PUT /api/propietarios/:id/cambiar-password
// @access  Private
export const cambiarPasswordPropietario = async (req, res) => {
  try {
    const { id } = req.params;
    const { passwordActual, passwordNuevo } = req.body;

    const propietario = await Owner.findById(id).select("+password");
    if (!propietario) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    // Verificar contraseña actual si existe
    if (propietario.password && passwordActual) {
      const passwordCorrecta = await propietario.compararPassword(passwordActual);
      if (!passwordCorrecta) {
        return res.status(400).json({
          success: false,
          message: "La contraseña actual es incorrecta",
        });
      }
    }

    // Actualizar contraseña
    propietario.password = passwordNuevo;
    await propietario.save();

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};