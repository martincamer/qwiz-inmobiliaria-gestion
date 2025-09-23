import Property from "../models/Property.js";
import Owner from "../models/Owner.js";
import Tenant from "../models/Tenant.js";
import mongoose from "mongoose";

// Crear nueva propiedad
export const crearPropiedad = async (req, res) => {
  try {
    const nuevaPropiedad = new Property(req.body);

    // Verificar que el propietario existe
    if (nuevaPropiedad.owner) {
      const propietarioExiste = await Owner.findById(nuevaPropiedad.owner);
      if (!propietarioExiste) {
        return res.status(400).json({
          success: false,
          message: "El propietario especificado no existe",
        });
      }
    }

    const propiedadGuardada = await nuevaPropiedad.save();
    await propiedadGuardada.populate("owner", "nombre apellido email telefono");

    res.status(201).json({
      success: true,
      message: "Propiedad creada exitosamente",
      data: propiedadGuardada,
    });
  } catch (error) {
    console.error("Error al crear propiedad:", error);
    res.status(400).json({
      success: false,
      message: "Error al crear la propiedad",
      error: error.message,
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
      ordenarPor = "fechaCreacion",
      orden = "desc",
    } = req.query;

    // Construir filtros
    const filtros = {};

    if (tipo) filtros.type = tipo;
    if (estado) filtros.status = estado;
    if (propietario) filtros.owner = propietario;
    if (ciudad) filtros.city = new RegExp(ciudad, "i");
    if (barrio) filtros.neighborhood = new RegExp(barrio, "i");
    if (habitaciones)
      filtros["characteristics.bedrooms"] = parseInt(habitaciones);
    if (banos) filtros["characteristics.bathrooms"] = parseInt(banos);

    // Filtro de precio
    if (precioMin || precioMax) {
      filtros.$or = [];
      if (precioMin || precioMax) {
        const saleFilter = {};
        const rentFilter = {};
        if (precioMin) {
          saleFilter["pricing.salePrice"] = { $gte: parseFloat(precioMin) };
          rentFilter["pricing.rentPrice"] = { $gte: parseFloat(precioMin) };
        }
        if (precioMax) {
          if (saleFilter["pricing.salePrice"]) {
            saleFilter["pricing.salePrice"].$lte = parseFloat(precioMax);
          } else {
            saleFilter["pricing.salePrice"] = { $lte: parseFloat(precioMax) };
          }
          if (rentFilter["pricing.rentPrice"]) {
            rentFilter["pricing.rentPrice"].$lte = parseFloat(precioMax);
          } else {
            rentFilter["pricing.rentPrice"] = { $lte: parseFloat(precioMax) };
          }
        }
        filtros.$or.push(saleFilter, rentFilter);
      }
    }

    // Búsqueda de texto
    if (busqueda) {
      filtros.$or = [
        { title: new RegExp(busqueda, "i") },
        { description: new RegExp(busqueda, "i") },
        { address: new RegExp(busqueda, "i") },
        { city: new RegExp(busqueda, "i") },
        { neighborhood: new RegExp(busqueda, "i") },
      ];
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[ordenarPor] = orden === "desc" ? -1 : 1;

    // Ejecutar consulta con paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [propiedades, total] = await Promise.all([
      Property.find(filtros)
        .populate("owner", "nombre apellido email telefono")
        .populate("currentTenant", "nombre apellido email telefono")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Property.countDocuments(filtros),
    ]);

    res.json({
      success: true,
      data: propiedades,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las propiedades",
      error: error.message,
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
        message: "ID de propiedad inválido",
      });
    }

    const propiedad = await Property.findById(id)
      .populate("owner", "nombre apellido email telefono direccion")
      .populate("currentTenant", "nombre apellido email telefono")
      .populate("contractHistory.tenant", "nombre apellido email");

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    // Incrementar contador de vistas
    await propiedad.incrementViews();

    res.json({
      success: true,
      data: propiedad,
    });
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la propiedad",
      error: error.message,
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
        message: "ID de propiedad inválido",
      });
    }

    // Verificar que el propietario existe si se está actualizando
    if (req.body.owner) {
      const propietarioExiste = await Owner.findById(req.body.owner);
      if (!propietarioExiste) {
        return res.status(400).json({
          success: false,
          message: "El propietario especificado no existe",
        });
      }
    }

    const propiedadActualizada = await Property.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("owner", "nombre apellido email telefono");

    if (!propiedadActualizada) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Propiedad actualizada exitosamente",
      data: propiedadActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar propiedad:", error);
    res.status(400).json({
      success: false,
      message: "Error al actualizar la propiedad",
      error: error.message,
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
        message: "ID de propiedad inválido",
      });
    }

    const propiedad = await Property.findById(id);

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    // Verificar si la propiedad tiene inquilino activo
    if (propiedad.currentTenant) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar una propiedad con inquilino activo",
      });
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Propiedad eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la propiedad",
      error: error.message,
    });
  }
};

// Asignar inquilino a propiedad
export const asignarInquilino = async (req, res) => {
  try {
    const { id } = req.params;
    const { inquilinoId, fechaInicio, fechaFin, deposito } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(inquilinoId)
    ) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const [propiedad, inquilino] = await Promise.all([
      Property.findById(id),
      Tenant.findById(inquilinoId),
    ]);

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: "Inquilino no encontrado",
      });
    }

    if (propiedad.currentTenant) {
      return res.status(400).json({
        success: false,
        message: "La propiedad ya tiene un inquilino activo",
      });
    }

    // Asignar inquilino
    propiedad.currentTenant = inquilinoId;
    propiedad.status = "ocupada";

    // Agregar al historial
    propiedad.contractHistory.push({
      tenant: inquilinoId,
      startDate: new Date(fechaInicio),
      endDate: fechaFin ? new Date(fechaFin) : null,
      deposit: deposito || 0,
      active: true,
    });

    await propiedad.save();

    // Actualizar inquilino
    inquilino.propiedadActual = id;
    await inquilino.save();

    const propiedadActualizada = await Property.findById(id)
      .populate("owner", "nombre apellido email telefono")
      .populate("currentTenant", "nombre apellido email telefono");

    res.json({
      success: true,
      message: "Inquilino asignado exitosamente",
      data: propiedadActualizada,
    });
  } catch (error) {
    console.error("Error al asignar inquilino:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar inquilino",
      error: error.message,
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
        message: "ID de propiedad inválido",
      });
    }

    const propiedad = await Property.findById(id);

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    if (!propiedad.currentTenant) {
      return res.status(400).json({
        success: false,
        message: "La propiedad no tiene inquilino activo",
      });
    }

    const inquilinoId = propiedad.currentTenant;

    // Actualizar historial
    const historialActivo = propiedad.contractHistory.find((h) => h.active);
    if (historialActivo) {
      historialActivo.endDate = fechaFin ? new Date(fechaFin) : new Date();
      historialActivo.active = false;
      if (motivo) historialActivo.reason = motivo;
    }

    // Liberar propiedad
    propiedad.currentTenant = null;
    propiedad.status = "disponible";

    await propiedad.save();

    // Actualizar inquilino
    await Tenant.findByIdAndUpdate(inquilinoId, {
      propiedadActual: null,
    });

    const propiedadActualizada = await Property.findById(id).populate(
      "owner",
      "nombre apellido email telefono"
    );

    res.json({
      success: true,
      message: "Inquilino liberado exitosamente",
      data: propiedadActualizada,
    });
  } catch (error) {
    console.error("Error al liberar inquilino:", error);
    res.status(500).json({
      success: false,
      message: "Error al liberar inquilino",
      error: error.message,
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
        message: "ID de propietario inválido",
      });
    }

    const propiedades = await Property.find({ owner: propietarioId })
      .populate("currentTenant", "nombre apellido email telefono")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: propiedades,
    });
  } catch (error) {
    console.error("Error al obtener propiedades por propietario:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las propiedades",
      error: error.message,
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
        message: "ID de propiedad inválido",
      });
    }

    const propiedad = await Property.findById(id);

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada",
      });
    }

    const similares = await propiedad.buscarSimilares();

    res.json({
      success: true,
      data: similares,
    });
  } catch (error) {
    console.error("Error al obtener propiedades similares:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener propiedades similares",
      error: error.message,
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
      ingresosTotales,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "disponible" }),
      Property.countDocuments({ status: "ocupada" }),
      Property.countDocuments({ status: "mantenimiento" }),
      Property.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
      Property.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }]),
      Property.aggregate([
        { $group: { _id: null, total: { $sum: "$pricing.salePrice" } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        resumen: {
          total: totalPropiedades,
          disponibles: propiedadesDisponibles,
          ocupadas: propiedadesOcupadas,
          mantenimiento: propiedadesMantenimiento,
        },
        porTipo: estadisticasPorTipo,
        porCiudad: estadisticasPorCiudad,
        ingresosPotenciales: ingresosTotales[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
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
      data: propiedades,
    });
  } catch (error) {
    console.error("Error en búsqueda avanzada:", error);
    res.status(500).json({
      success: false,
      message: "Error en la búsqueda avanzada",
      error: error.message,
    });
  }
};
