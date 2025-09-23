import Prospect from "../models/Prospect.js";
import { validationResult } from "express-validator";

// @desc    Crear un nuevo prospecto
// @route   POST /api/prospectos
// @access  Private
export const crearProspecto = async (req, res) => {
  try {
    console.log("\n👤 === CREAR PROSPECTO ===");
    console.log("📦 Datos recibidos:", JSON.stringify(req.body, null, 2));
    
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Errores de validación:", JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }
    
    console.log("✅ Validación pasada correctamente");

    // Verificar si el email ya existe (opcional, solo si se proporciona email)
    if (req.body.email) {
      console.log("🔍 Verificando email existente:", req.body.email);
      const prospectoExistente = await Prospect.findOne({ 
        email: req.body.email, 
        activo: true 
      });
      if (prospectoExistente) {
        console.log("⚠️ Ya existe un prospecto activo con este email:", req.body.email);
        return res.status(400).json({
          success: false,
          message: "Ya existe un prospecto activo con este email",
        });
      }
      console.log("✅ Email disponible");
    }

    // Crear el nuevo prospecto con todos los campos dinámicos del cliente
    console.log("🏗️ Creando nuevo prospecto...");
    const nuevoProspecto = new Prospect(req.body);

    console.log("💾 Guardando prospecto en la base de datos...");
    const prospectoGuardado = await nuevoProspecto.save();
    console.log("✅ Prospecto guardado exitosamente:", prospectoGuardado._id);

    res.status(201).json({
      success: true,
      message: "Prospecto creado exitosamente",
      data: prospectoGuardado.obtenerPerfilPublico(),
    });
  } catch (error) {
    console.error("\n💥 === ERROR AL CREAR PROSPECTO ===");
    console.error("🔴 Tipo de error:", error.name);
    console.error("🔴 Mensaje:", error.message);
    console.error("🔴 Stack:", error.stack);
    
    // Si es un error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear el prospecto",
    });
  }
};

// @desc    Obtener todos los prospectos
// @route   GET /api/prospectos
// @access  Private
export const obtenerProspectos = async (req, res) => {
  try {
    console.log("\n📋 === OBTENER PROSPECTOS ===");
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtros
    const filtros = { activo: true };
    
    if (req.query.estado) {
      filtros.estado = req.query.estado;
    }
    
    if (req.query.origen) {
      filtros.origen = req.query.origen;
    }
    
    if (req.query.prioridad) {
      filtros.prioridad = req.query.prioridad;
    }
    
    if (req.query.agente) {
      filtros.agente = req.query.agente;
    }
    
    if (req.query.search) {
      filtros.$text = { $search: req.query.search };
    }

    console.log("🔍 Filtros aplicados:", filtros);
    
    const prospectos = await Prospect.find(filtros)
      .populate('agente', 'nombre apellido email')
      .populate('propiedadesMostradas.propiedad', 'titulo direccion precio')
      .sort({ fechaContacto: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Prospect.countDocuments(filtros);
    
    console.log(`✅ ${prospectos.length} prospectos encontrados de ${total} total`);
    
    res.json({
      success: true,
      data: prospectos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("\n💥 === ERROR AL OBTENER PROSPECTOS ===");
    console.error("🔴 Error:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener los prospectos",
    });
  }
};

// @desc    Obtener prospecto por ID
// @route   GET /api/prospectos/:id
// @access  Private
export const obtenerProspectoPorId = async (req, res) => {
  try {
    console.log("\n🔍 === OBTENER PROSPECTO POR ID ===");
    console.log("🆔 ID recibido:", req.params.id);
    
    const prospecto = await Prospect.findById(req.params.id)
      .populate('agente', 'nombre apellido email')
      .populate('propiedadesMostradas.propiedad', 'titulo direccion precio imagenes');
    
    if (!prospecto) {
      console.log("❌ Prospecto no encontrado");
      return res.status(404).json({
        success: false,
        message: "Prospecto no encontrado",
      });
    }
    
    console.log("✅ Prospecto encontrado:", prospecto.nombreCompleto);
    
    res.json({
      success: true,
      data: prospecto.obtenerPerfilPublico(),
    });
  } catch (error) {
    console.error("\n💥 === ERROR AL OBTENER PROSPECTO ===");
    console.error("🔴 Error:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener el prospecto",
    });
  }
};

// @desc    Actualizar prospecto
// @route   PUT /api/prospectos/:id
// @access  Private
export const actualizarProspecto = async (req, res) => {
  try {
    console.log("\n✏️ === ACTUALIZAR PROSPECTO ===");
    console.log("🆔 ID:", req.params.id);
    console.log("📦 Datos recibidos:", JSON.stringify(req.body, null, 2));
    
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Errores de validación:", JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }
    
    const prospecto = await Prospect.findById(req.params.id);
    
    if (!prospecto) {
      console.log("❌ Prospecto no encontrado");
      return res.status(404).json({
        success: false,
        message: "Prospecto no encontrado",
      });
    }
    
    // Verificar si el email ya existe en otro prospecto (solo si se proporciona email)
    if (req.body.email && req.body.email !== prospecto.email) {
      const emailExistente = await Prospect.findOne({ 
        email: req.body.email, 
        _id: { $ne: req.params.id },
        activo: true 
      });
      
      if (emailExistente) {
        console.log("❌ Email ya existe en otro prospecto");
        return res.status(400).json({
          success: false,
          message: "Ya existe otro prospecto activo con este email",
        });
      }
    }
    
    // Actualizar todos los campos dinámicos del cliente
    // Excluir campos del sistema que no deben ser modificados directamente
    const camposExcluidos = ['_id', 'createdAt', 'updatedAt', '__v', 'interacciones', 'propiedadesMostradas'];
    
    Object.keys(req.body).forEach(campo => {
      if (!camposExcluidos.includes(campo) && req.body[campo] !== undefined) {
        prospecto[campo] = req.body[campo];
      }
    });
    
    // Actualizar fecha de último contacto si se cambia el estado
    if (req.body.estado && req.body.estado !== prospecto.estado && prospecto.fechaUltimoContacto !== undefined) {
      prospecto.fechaUltimoContacto = new Date();
    }
    
    console.log("💾 Guardando cambios...");
    const prospectoActualizado = await prospecto.save();
    
    console.log("✅ Prospecto actualizado exitosamente");
    
    res.json({
      success: true,
      message: "Prospecto actualizado exitosamente",
      data: prospectoActualizado.obtenerPerfilPublico(),
    });
  } catch (error) {
    console.error("\n💥 === ERROR AL ACTUALIZAR PROSPECTO ===");
    console.error("🔴 Error:", error.message);
    
    // Si es un error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al actualizar el prospecto",
    });
  }
};

// @desc    Eliminar prospecto (soft delete)
// @route   DELETE /api/prospectos/:id
// @access  Private
export const eliminarProspecto = async (req, res) => {
  try {
    console.log("\n🗑️ === ELIMINAR PROSPECTO ===");
    console.log("🆔 ID:", req.params.id);
    
    const prospecto = await Prospect.findById(req.params.id);
    
    if (!prospecto) {
      console.log("❌ Prospecto no encontrado");
      return res.status(404).json({
        success: false,
        message: "Prospecto no encontrado",
      });
    }
    
    // Soft delete
    prospecto.activo = false;
    await prospecto.save();
    
    console.log("✅ Prospecto eliminado exitosamente (soft delete)");
    
    res.json({
      success: true,
      message: "Prospecto eliminado exitosamente",
    });
  } catch (error) {
    console.error("\n💥 === ERROR AL ELIMINAR PROSPECTO ===");
    console.error("🔴 Error:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al eliminar el prospecto",
    });
  }
};

// @desc    Agregar interacción a prospecto
// @route   POST /api/prospectos/:id/interacciones
// @access  Private
export const agregarInteraccion = async (req, res) => {
  try {
    console.log("\n💬 === AGREGAR INTERACCIÓN ===");
    console.log("🆔 ID Prospecto:", req.params.id);
    console.log("📦 Datos interacción:", JSON.stringify(req.body, null, 2));
    
    const prospecto = await Prospect.findById(req.params.id);
    
    if (!prospecto) {
      console.log("❌ Prospecto no encontrado");
      return res.status(404).json({
        success: false,
        message: "Prospecto no encontrado",
      });
    }
    
    const { tipo, descripcion, resultado } = req.body;
    
    if (!tipo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: "Tipo y descripción son obligatorios",
      });
    }
    
    await prospecto.agregarInteraccion({ tipo, descripcion, resultado });
    
    console.log("✅ Interacción agregada exitosamente");
    
    res.json({
      success: true,
      message: "Interacción agregada exitosamente",
      data: prospecto.obtenerPerfilPublico(),
    });
  } catch (error) {
    console.error("\n💥 === ERROR AL AGREGAR INTERACCIÓN ===");
    console.error("🔴 Error:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al agregar la interacción",
    });
  }
};

// @desc    Mostrar propiedad a prospecto
// @route   POST /api/prospectos/:id/propiedades
// @access  Private
export const mostrarPropiedad = async (req, res) => {
  try {
    console.log("\n🏠 === MOSTRAR PROPIEDAD ===");
    console.log("🆔 ID Prospecto:", req.params.id);
    console.log("📦 Datos:", JSON.stringify(req.body, null, 2));
    
    const prospecto = await Prospect.findById(req.params.id);
    
    if (!prospecto) {
      console.log("❌ Prospecto no encontrado");
      return res.status(404).json({
        success: false,
        message: "Prospecto no encontrado",
      });
    }
    
    const { propiedadId, interes, comentarios } = req.body;
    
    if (!propiedadId) {
      return res.status(400).json({
        success: false,
        message: "ID de propiedad es obligatorio",
      });
    }
    
    await prospecto.mostrarPropiedad(propiedadId, interes, comentarios);
    
    console.log("✅ Propiedad mostrada exitosamente");
    
    res.json({
      success: true,
      message: "Propiedad mostrada exitosamente",
      data: prospecto.obtenerPerfilPublico(),
    });
  } catch (error) {
    console.error("\n💥 === ERROR AL MOSTRAR PROPIEDAD ===");
    console.error("🔴 Error:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al mostrar la propiedad",
    });
  }
};

// @desc    Obtener estadísticas de prospectos
// @route   GET /api/prospectos/estadisticas
// @access  Private
export const obtenerEstadisticas = async (req, res) => {
  try {
    console.log("\n📊 === OBTENER ESTADÍSTICAS DE PROSPECTOS ===");
    
    const estadisticas = await Prospect.aggregate([
      { $match: { activo: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          porEstado: {
            $push: {
              estado: "$estado",
              count: 1
            }
          },
          porOrigen: {
            $push: {
              origen: "$origen",
              count: 1
            }
          },
          porPrioridad: {
            $push: {
              prioridad: "$prioridad",
              count: 1
            }
          }
        }
      }
    ]);
    
    // Procesar estadísticas por estado
    const estadisticasEstado = await Prospect.aggregate([
      { $match: { activo: true } },
      { $group: { _id: "$estado", count: { $sum: 1 } } }
    ]);
    
    // Procesar estadísticas por origen
    const estadisticasOrigen = await Prospect.aggregate([
      { $match: { activo: true } },
      { $group: { _id: "$origen", count: { $sum: 1 } } }
    ]);
    
    // Procesar estadísticas por prioridad
    const estadisticasPrioridad = await Prospect.aggregate([
      { $match: { activo: true } },
      { $group: { _id: "$prioridad", count: { $sum: 1 } } }
    ]);
    
    const total = await Prospect.countDocuments({ activo: true });
    
    console.log("✅ Estadísticas calculadas exitosamente");
    
    res.json({
      success: true,
      data: {
        total,
        porEstado: estadisticasEstado,
        porOrigen: estadisticasOrigen,
        porPrioridad: estadisticasPrioridad
      }
    });
  } catch (error) {
    console.error("\n💥 === ERROR AL OBTENER ESTADÍSTICAS ===");
    console.error("🔴 Error:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener las estadísticas",
    });
  }
};