import Property from "../models/Property.js";
import Owner from "../models/Owner.js";
import Tenant from "../models/Tenant.js";
import mongoose from "mongoose";

// Crear nueva propiedad
export const crearPropiedad = async (req, res) => {
  try {
    const nuevaPropiedad = new Property(req.body);
    
    // Verificar que el propietario existe
    if (nuevaPropiedad.propietario) {
      const propietarioExiste = await Owner.findById(nuevaPropiedad.propietario);
      if (!propietarioExiste) {
        return res.status(400).json({
          success: false,
          message: "El propietario especificado no existe"
        });
      }
    }

    const propiedadGuardada = await nuevaPropiedad.save();
    await propiedadGuardada.populate('propietario', 'nombre apellido email telefono');
    
    res.status(201).json({
      success: true,
      message: "Propiedad creada exitosamente",
      data: propiedadGuardada
    });
  } catch (error) {
    console.error("Error al crear propiedad:", error);
    res.status(400).json({
      success: false,
      message: "Error al crear la propiedad",
      error: error.message
    });
  }
};

// Obtener todas las propiedades con filtros y paginación
export const obtenerPropiedades = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      tipo,
      estado,
      propietario,
      precioMin,
      precioMax,
      ciudad,
      barrio,
      habitaciones,
      banos,
      busqueda,
      ordenarPor = 'fechaCreacion',
      orden = 'desc'
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (tipo) filtros.tipo = tipo;
    if (estado) filtros.estado = estado;
    if (propietario) filtros.propietario = propietario;
    if (ciudad) filtros['direccion.ciudad'] = new RegExp(ciudad, 'i');
    if (barrio) filtros['direccion.barrio'] = new RegExp(barrio, 'i');
    if (habitaciones) filtros['caracteristicas.habitaciones'] = parseInt(habitaciones);
    if (banos) filtros['caracteristicas.banos'] = parseInt(banos);

    // Filtro de precio
    if (precioMin || precioMax) {
      filtros['precio.monto'] = {};
      if (precioMin) filtros['precio.monto'].$gte = parseFloat(precioMin);
      if (precioMax) filtros['precio.monto'].$lte = parseFloat(precioMax);
    }

    // Búsqueda de texto
    if (busqueda) {
      filtros.$or = [
        { titulo: new RegExp(busqueda, 'i') },
        { descripcion: new RegExp(busqueda, 'i') },
        { 'direccion.calle': new RegExp(busqueda, 'i') },
        { 'direccion.ciudad': new RegExp(busqueda, 'i') },
        { 'direccion.barrio': new RegExp(busqueda, 'i') }
      ];
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[ordenarPor] = orden === 'desc' ? -1 : 1;

    // Ejecutar consulta con paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [propiedades, total] = await Promise.all([
      Property.find(filtros)
        .populate('propietario', 'nombre apellido email telefono')
        .populate('inquilinoActual', 'nombre apellido email telefono')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Property.countDocuments(filtros)
    ]);

    res.json({
      success: true,
      data: propiedades,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las propiedades",
      error: error.message
    });
  }
};

// Obtener propiedad por ID
export const obtenerPropiedadPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de propiedad inválido"
      });
    }

    const propiedad = await Property.findById(id)
      .populate('propietario', 'nombre apellido email telefono direccion')
      .populate('inquilinoActual', 'nombre apellido email telefono')
      .populate('historialInquilinos.inquilino', 'nombre apellido email');

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada"
      });
    }

    // Incrementar contador de vistas
    await propiedad.incrementarVistas();

    res.json({
      success: true,
      data: propiedad
    });
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la propiedad",
      error: error.message
    });
  }
};

// Actualizar propiedad
export const actualizarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de propiedad inválido"
      });
    }

    // Verificar que el propietario existe si se está actualizando
    if (req.body.propietario) {
      const propietarioExiste = await Owner.findById(req.body.propietario);
      if (!propietarioExiste) {
        return res.status(400).json({
          success: false,
          message: "El propietario especificado no existe"
        });
      }
    }

    const propiedadActualizada = await Property.findByIdAndUpdate(
      id,
      { ...req.body, fechaActualizacion: new Date() },
      { new: true, runValidators: true }
    ).populate('propietario', 'nombre apellido email telefono');

    if (!propiedadActualizada) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada"
      });
    }

    res.json({
      success: true,
      message: "Propiedad actualizada exitosamente",
      data: propiedadActualizada
    });
  } catch (error) {
    console.error("Error al actualizar propiedad:", error);
    res.status(400).json({
      success: false,
      message: "Error al actualizar la propiedad",
      error: error.message
    });
  }
};

// Eliminar propiedad
export const eliminarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de propiedad inválido"
      });
    }

    const propiedad = await Property.findById(id);
    
    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada"
      });
    }

    // Verificar si la propiedad tiene inquilino activo
    if (propiedad.inquilinoActual) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar una propiedad con inquilino activo"
      });
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Propiedad eliminada exitosamente"
    });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la propiedad",
      error: error.message
    });
  }
};

// Asignar inquilino a propiedad
export const asignarInquilino = async (req, res) => {
  try {
    const { id } = req.params;
    const { inquilinoId, fechaInicio, fechaFin, deposito } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(inquilinoId)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }

    const [propiedad, inquilino] = await Promise.all([
      Property.findById(id),
      Tenant.findById(inquilinoId)
    ]);

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada"
      });
    }

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado"
      });
    }

    if (propiedad.inquilinoActual) {
      return res.status(400).json({
        success: false,
        message: "La propiedad ya tiene un inquilino activo"
      });
    }

    // Asignar inquilino
    propiedad.inquilinoActual = inquilinoId;
    propiedad.estado = 'ocupada';
    
    // Agregar al historial
    propiedad.historialInquilinos.push({
      inquilino: inquilinoId,
      fechaInicio: new Date(fechaInicio),
      fechaFin: fechaFin ? new Date(fechaFin) : null,
      deposito: deposito || 0,
      activo: true
    });

    await propiedad.save();

    // Actualizar inquilino
    inquilino.propiedadActual = id;
    await inquilino.save();

    const propiedadActualizada = await Property.findById(id)
      .populate('propietario', 'nombre apellido email telefono')
      .populate('inquilinoActual', 'nombre apellido email telefono');

    res.json({
      success: true,
      message: "Inquilino asignado exitosamente",
      data: propiedadActualizada
    });
  } catch (error) {
    console.error("Error al asignar inquilino:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar inquilino",
      error: error.message
    });
  }
};

// Liberar inquilino de propiedad
export const liberarInquilino = async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaFin, motivo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de propiedad inválido"
      });
    }

    const propiedad = await Property.findById(id);

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada"
      });
    }

    if (!propiedad.inquilinoActual) {
      return res.status(400).json({
        success: false,
        message: "La propiedad no tiene inquilino activo"
      });
    }

    const inquilinoId = propiedad.inquilinoActual;

    // Actualizar historial
    const historialActivo = propiedad.historialInquilinos.find(h => h.activo);
    if (historialActivo) {
      historialActivo.fechaFin = fechaFin ? new Date(fechaFin) : new Date();
      historialActivo.activo = false;
      if (motivo) historialActivo.motivo = motivo;
    }

    // Liberar propiedad
    propiedad.inquilinoActual = null;
    propiedad.estado = 'disponible';
    
    await propiedad.save();

    // Actualizar inquilino
    await Tenant.findByIdAndUpdate(inquilinoId, {
      propiedadActual: null
    });

    const propiedadActualizada = await Property.findById(id)
      .populate('propietario', 'nombre apellido email telefono');

    res.json({
      success: true,
      message: "Inquilino liberado exitosamente",
      data: propiedadActualizada
    });
  } catch (error) {
    console.error("Error al liberar inquilino:", error);
    res.status(500).json({
      success: false,
      message: "Error al liberar inquilino",
      error: error.message
    });
  }
};

// Obtener propiedades por propietario
export const obtenerPropiedadesPorPropietario = async (req, res) => {
  try {
    const { propietarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propietarioId)) {
      return res.status(400).json({
        success: false,
        message: "ID de propietario inválido"
      });
    }

    const propiedades = await Property.find({ propietario: propietarioId })
      .populate('inquilinoActual', 'nombre apellido email telefono')
      .sort({ fechaCreacion: -1 });

    res.json({
      success: true,
      data: propiedades
    });
  } catch (error) {
    console.error("Error al obtener propiedades por propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las propiedades",
      error: error.message
    });
  }
};

// Buscar propiedades similares
export const obtenerPropiedadesSimilares = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de propiedad inválido"
      });
    }

    const propiedad = await Property.findById(id);
    
    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada"
      });
    }

    const similares = await propiedad.buscarSimilares();

    res.json({
      success: true,
      data: similares
    });
  } catch (error) {
    console.error("Error al obtener propiedades similares:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener propiedades similares",
      error: error.message
    });
  }
};

// Obtener estadísticas de propiedades
export const obtenerEstadisticasPropiedades = async (req, res) => {
  try {
    const [
      totalPropiedades,
      propiedadesDisponibles,
      propiedadesOcupadas,
      propiedadesMantenimiento,
      estadisticasPorTipo,
      estadisticasPorCiudad,
      ingresosTotales
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ estado: 'disponible' }),
      Property.countDocuments({ estado: 'ocupada' }),
      Property.countDocuments({ estado: 'mantenimiento' }),
      Property.aggregate([
        { $group: { _id: '$tipo', count: { $sum: 1 } } }
      ]),
      Property.aggregate([
        { $group: { _id: '$direccion.ciudad', count: { $sum: 1 } } }
      ]),
      Property.aggregate([
        { $group: { _id: null, total: { $sum: '$precio.monto' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        resumen: {
          total: totalPropiedades,
          disponibles: propiedadesDisponibles,
          ocupadas: propiedadesOcupadas,
          mantenimiento: propiedadesMantenimiento
        },
        porTipo: estadisticasPorTipo,
        porCiudad: estadisticasPorCiudad,
        ingresosPotenciales: ingresosTotales[0]?.total || 0
      }
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};

// Búsqueda avanzada
export const busquedaAvanzada = async (req, res) => {
  try {
    const criterios = req.body;
    const propiedades = await Property.busquedaAvanzada(criterios);

    res.json({
      success: true,
      data: propiedades
    });
  } catch (error) {
    console.error("Error en búsqueda avanzada:", error);
    res.status(500).json({
      success: false,
      message: "Error en la búsqueda avanzada",
      error: error.message
    });
  }
};