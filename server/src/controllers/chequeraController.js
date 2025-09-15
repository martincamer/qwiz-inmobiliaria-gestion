import Chequera from "../models/Chequera.js";
import User from "../models/User.js";

// Crear nueva chequera
export const createChequera = async (req, res) => {
  try {
    const {
      nombre,
      tipo,
      banco,
      numeroCuenta,
      titular,
      cuit,
      rangoDesde,
      rangoHasta,
    } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    // Validar datos requeridos
    if (!nombre || !banco || !titular || !rangoDesde || !rangoHasta) {
      return res.status(400).json({
        success: false,
        message: "Nombre, banco, titular y rangos son requeridos",
      });
    }

    // Validar que el rango sea válido
    if (rangoDesde >= rangoHasta) {
      return res.status(400).json({
        success: false,
        message: "El rango inicial debe ser menor al rango final",
      });
    }

    // Verificar que no exista una chequera con el mismo nombre para la empresa
    const existingChequera = await Chequera.findOne({
      nombre: nombre.trim(),
      companyId,
      isActive: true,
    });

    if (existingChequera) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una chequera activa con ese nombre",
      });
    }

    const chequeraData = {
      nombre: nombre.trim(),
      tipo: tipo || "propia",
      banco: banco.trim(),
      numeroCuenta: numeroCuenta?.trim(),
      titular: titular.trim(),
      cuit: cuit?.trim(),
      rangoDesde: parseInt(rangoDesde),
      rangoHasta: parseInt(rangoHasta),
      companyId,
      userId,
      createdBy: userId,
    };

    const chequera = new Chequera(chequeraData);
    await chequera.save();

    // Poblar información del usuario creador
    await chequera.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Chequera creada exitosamente",
      data: chequera,
    });
  } catch (error) {
    console.error("Error al crear chequera:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener movimientos de una chequera
export const getMovimientos = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, fechaDesde, fechaHasta, limit = 50, page = 1 } = req.query;
    const companyId = req.user.company.id;

    const chequera = await Chequera.findOne({ _id: id, companyId, isActive: true })
      .populate('movimientosCheques.createdBy', 'name email')
      .populate('movimientosCheques.updatedBy', 'name email');

    if (!chequera) {
      return res.status(404).json({
        success: false,
        message: "Chequera no encontrada",
      });
    }

    let movimientos = [...chequera.movimientosCheques];

    // Filtrar por tipo si se especifica
    if (tipo && ['ingreso', 'egreso'].includes(tipo)) {
      movimientos = movimientos.filter(mov => mov.tipo === tipo);
    }

    // Filtrar por fechas si se especifican
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      movimientos = movimientos.filter(mov => new Date(mov.fechaMovimiento) >= desde);
    }

    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999); // Incluir todo el día
      movimientos = movimientos.filter(mov => new Date(mov.fechaMovimiento) <= hasta);
    }

    // Ordenar por fecha (más recientes primero)
    movimientos.sort((a, b) => new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento));

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const movimientosPaginados = movimientos.slice(startIndex, endIndex);

    // Calcular totales
    const totalIngresos = movimientos
      .filter(mov => mov.tipo === 'ingreso')
      .reduce((sum, mov) => sum + mov.monto, 0);
    
    const totalEgresos = movimientos
      .filter(mov => mov.tipo === 'egreso')
      .reduce((sum, mov) => sum + mov.monto, 0);

    res.json({
      success: true,
      data: {
        movimientos: movimientosPaginados,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(movimientos.length / limit),
          totalMovimientos: movimientos.length,
          hasNextPage: endIndex < movimientos.length,
          hasPrevPage: page > 1,
        },
        resumen: {
          totalIngresos,
          totalEgresos,
          saldo: totalIngresos - totalEgresos,
        },
        chequeraInfo: {
          id: chequera._id,
          nombre: chequera.nombre,
          tipo: chequera.tipo,
          banco: chequera.banco,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener todas las chequeras de la empresa
export const getChequeras = async (req, res) => {
  try {
    const companyId = req.user.company.id;
    const { page = 1, limit = 10, isActive, search, tipo } = req.query;

    const filter = { companyId };

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (tipo) {
      filter.tipo = tipo;
    }

    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { banco: { $regex: search, $options: "i" } },
        { titular: { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "createdBy", select: "name email" },
        { path: "lastModifiedBy", select: "name email" },
      ],
    };

    const chequeras = await Chequera.find(filter)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit);

    const total = await Chequera.countDocuments(filter);

    res.json({
      success: true,
      data: {
        chequeras,
        pagination: {
          currentPage: options.page,
          totalPages: Math.ceil(total / options.limit),
          totalItems: total,
          hasNextPage: options.page < Math.ceil(total / options.limit),
          hasPrevPage: options.page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener chequeras:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener chequera por ID
export const getChequeraById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.company.id;

    const chequera = await Chequera.findOne({ _id: id, companyId })
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .populate("cheques.createdBy", "name email");

    if (!chequera) {
      return res.status(404).json({
        success: false,
        message: "Chequera no encontrada",
      });
    }

    res.json({
      success: true,
      data: chequera,
    });
  } catch (error) {
    console.error("Error al obtener chequera:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Actualizar chequera
export const updateChequera = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, banco, numeroCuenta, titular, cuit, isActive } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const chequera = await Chequera.findOne({ _id: id, companyId });

    if (!chequera) {
      return res.status(404).json({
        success: false,
        message: "Chequera no encontrada",
      });
    }

    // Verificar nombre único si se está cambiando
    if (nombre && nombre.trim() !== chequera.nombre) {
      const existingChequera = await Chequera.findOne({
        nombre: nombre.trim(),
        companyId,
        isActive: true,
        _id: { $ne: id },
      });

      if (existingChequera) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una chequera activa con ese nombre",
        });
      }
    }

    // Actualizar campos
    if (nombre) chequera.nombre = nombre.trim();
    if (banco) chequera.banco = banco.trim();
    if (numeroCuenta !== undefined) chequera.numeroCuenta = numeroCuenta?.trim();
    if (titular) chequera.titular = titular.trim();
    if (cuit !== undefined) chequera.cuit = cuit?.trim();
    if (isActive !== undefined) chequera.isActive = isActive;
    chequera.lastModifiedBy = userId;

    await chequera.save();

    await chequera.populate([
      { path: "createdBy", select: "name email" },
      { path: "lastModifiedBy", select: "name email" },
    ]);

    res.json({
      success: true,
      message: "Chequera actualizada exitosamente",
      data: chequera,
    });
  } catch (error) {
    console.error("Error al actualizar chequera:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Emitir cheque propio
export const emitirCheque = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      monto,
      fechaVencimiento,
      fechaEmision,
      cliente,
      concepto,
      observaciones,
      movementId,
    } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    // Validar datos requeridos
    if (!monto || !fechaVencimiento) {
      return res.status(400).json({
        success: false,
        message: "Monto y fecha de vencimiento son requeridos",
      });
    }

    if (monto <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto debe ser mayor a 0",
      });
    }

    const chequera = await Chequera.findOne({
      _id: id,
      companyId,
      isActive: true,
    });

    if (!chequera) {
      return res.status(404).json({
        success: false,
        message: "Chequera no encontrada o inactiva",
      });
    }

    if (chequera.tipo !== "propia") {
      return res.status(400).json({
        success: false,
        message: "Solo se pueden emitir cheques en chequeras propias",
      });
    }

    const chequeData = {
      monto: parseFloat(monto),
      fechaEmision: fechaEmision ? new Date(fechaEmision) : new Date(),
      fechaVencimiento: new Date(fechaVencimiento),
      cliente: {
        nombre: cliente?.nombre?.trim(),
        cuit: cliente?.cuit?.trim(),
        telefono: cliente?.telefono?.trim(),
        email: cliente?.email?.trim(),
        direccion: cliente?.direccion?.trim(),
      },
      concepto: concepto?.trim(),
      observaciones: observaciones?.trim(),
      movementId,
    };

    try {
      const resultado = chequera.emitirChequePropio(chequeData, userId);
      await chequera.save();

      res.status(201).json({
        success: true,
        message: "Cheque emitido exitosamente",
        data: {
          cheque: resultado.cheque,
          movimiento: resultado.movimiento,
          proximoCheque: chequera.proximoCheque,
          resumen: chequera.getResumen(),
        },
      });
    } catch (chequeError) {
      return res.status(400).json({
        success: false,
        message: chequeError.message,
      });
    }
  } catch (error) {
    console.error("Error al emitir cheque:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Agregar cheque de terceros
export const agregarChequeTerceros = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numero,
      monto,
      fechaEmision,
      fechaVencimiento,
      estado,
      cliente,
      emisor,
      concepto,
      observaciones,
      movementId,
    } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    // Validar datos requeridos
    if (!numero || !monto || !fechaEmision || !fechaVencimiento || !emisor) {
      return res.status(400).json({
        success: false,
        message: "Número, monto, fechas y datos del emisor son requeridos",
      });
    }

    if (monto <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto debe ser mayor a 0",
      });
    }

    const chequera = await Chequera.findOne({
      _id: id,
      companyId,
      isActive: true,
    });

    if (!chequera) {
      return res.status(404).json({
        success: false,
        message: "Chequera no encontrada o inactiva",
      });
    }

    if (chequera.tipo !== "terceros") {
      return res.status(400).json({
        success: false,
        message: "Esta operación solo es válida para chequeras de terceros",
      });
    }

    const chequeData = {
      numero: numero.toString(),
      monto: parseFloat(monto),
      fechaEmision: new Date(fechaEmision),
      fechaVencimiento: new Date(fechaVencimiento),
      estado: estado || "disponible",
      cliente: {
        nombre: cliente?.nombre?.trim(),
        cuit: cliente?.cuit?.trim(),
        telefono: cliente?.telefono?.trim(),
        email: cliente?.email?.trim(),
        direccion: cliente?.direccion?.trim(),
      },
      emisor: {
        nombre: emisor?.nombre?.trim(),
        cuit: emisor?.cuit?.trim(),
        banco: emisor?.banco?.trim(),
        numeroCuenta: emisor?.numeroCuenta?.trim(),
        sucursal: emisor?.sucursal?.trim(),
        telefono: emisor?.telefono?.trim(),
      },
      concepto: concepto?.trim(),
      observaciones: observaciones?.trim(),
      movementId,
    };

    try {
      const resultado = chequera.agregarChequeTerceros(chequeData, userId);
      await chequera.save();

      res.status(201).json({
        success: true,
        message: "Cheque de terceros agregado exitosamente",
        data: {
          cheque: resultado.cheque,
          movimiento: resultado.movimiento,
          resumen: chequera.getResumen(),
        },
      });
    } catch (chequeError) {
      return res.status(400).json({
        success: false,
        message: chequeError.message,
      });
    }
  } catch (error) {
    console.error("Error al agregar cheque de terceros:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener cheques de una chequera
export const getCheques = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 20,
      estado,
      tipo,
      dateFrom,
      dateTo,
      emisorCuit,
      clienteCuit,
    } = req.query;
    const companyId = req.user.company.id;

    const chequera = await Chequera.findOne({ _id: id, companyId }).populate(
      "chequesDisponibles.createdBy",
      "name email"
    );

    if (!chequera) {
      return res.status(404).json({
        success: false,
        message: "Chequera no encontrada",
      });
    }

    let cheques = chequera.chequesDisponibles;

    // Aplicar filtros
    if (estado) {
      cheques = cheques.filter((cheque) => cheque.estado === estado);
    }

    if (tipo) {
      cheques = cheques.filter((cheque) => cheque.tipo === tipo);
    }

    if (emisorCuit && chequera.tipo === "terceros") {
      cheques = cheques.filter(
        (cheque) => cheque.emisor && cheque.emisor.cuit === emisorCuit
      );
    }

    if (clienteCuit) {
      cheques = cheques.filter(
        (cheque) => cheque.cliente && cheque.cliente.cuit === clienteCuit
      );
    }

    if (dateFrom || dateTo) {
      cheques = cheques.filter((cheque) => {
        const fechaEmision = new Date(cheque.fechaEmision);
        let incluir = true;

        if (dateFrom) {
          incluir = incluir && fechaEmision >= new Date(dateFrom);
        }

        if (dateTo) {
          incluir = incluir && fechaEmision <= new Date(dateTo);
        }

        return incluir;
      });
    }

    // Ordenar por fecha de emisión descendente
    cheques.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision));

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCheques = cheques.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        cheques: paginatedCheques,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(cheques.length / limit),
          totalItems: cheques.length,
          hasNextPage: endIndex < cheques.length,
          hasPrevPage: page > 1,
        },
        chequeraInfo: {
          id: chequera.id,
          nombre: chequera.nombre,
          tipo: chequera.tipo,
          banco: chequera.banco,
          proximoCheque: chequera.proximoCheque,
        },
        resumen: chequera.getResumen(),
      },
    });
  } catch (error) {
    console.error("Error al obtener cheques:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Cambiar estado de un cheque
export const cambiarEstadoCheque = async (req, res) => {
  try {
    const { id, chequeId } = req.params;
    const { estado, motivo } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    if (!estado) {
      return res.status(400).json({
        success: false,
        message: "El estado es requerido",
      });
    }

    const chequera = await Chequera.findOne({ _id: id, companyId });

    if (!chequera) {
      return res.status(404).json({
        success: false,
        message: "Chequera no encontrada",
      });
    }

    try {
      const cheque = chequera.cambiarEstadoCheque(chequeId, estado, motivo, userId);
      await chequera.save();

      res.json({
        success: true,
        message: "Estado del cheque actualizado exitosamente",
        data: {
          cheque,
          resumen: chequera.getResumen(),
        },
      });
    } catch (chequeError) {
      return res.status(400).json({
        success: false,
        message: chequeError.message,
      });
    }
  } catch (error) {
    console.error("Error al cambiar estado del cheque:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Eliminar chequera (soft delete)
export const deleteChequera = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const chequera = await Chequera.findOne({ _id: id, companyId });

    if (!chequera) {
      return res.status(404).json({
        success: false,
        message: "Chequera no encontrada",
      });
    }

    // Verificar que no tenga cheques emitidos pendientes
    const chequesEmitidos = chequera.chequesDisponibles.filter(
      (cheque) => cheque.estado === "emitido"
    );

    if (chequesEmitidos.length > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar una chequera con cheques emitidos pendientes",
      });
    }

    chequera.isActive = false;
    chequera.lastModifiedBy = userId;
    await chequera.save();

    res.json({
      success: true,
      message: "Chequera desactivada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar chequera:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener resumen de chequeras
export const getChequerasResumen = async (req, res) => {
  try {
    const companyId = req.user.company.id;

    const chequeras = await Chequera.find({ companyId, isActive: true });

    const resumen = {
      totalChequeras: chequeras.length,
      chequerasPropias: 0,
      chequerasTerceros: 0,
      totalCheques: 0,
      totalMovimientos: 0,
      totalIngresos: 0,
      totalEgresos: 0,
      chequesPorEstado: {
        disponible: 0,
        emitido: 0,
        cobrado: 0,
        rechazado: 0,
        vencido: 0,
        anulado: 0,
        depositado: 0,
        endosado: 0,
      },
      chequesPorTipo: {
        propio: 0,
        tercero: 0,
      },
      chequeras: [],
    };

    chequeras.forEach((chequera) => {
      const chequeraResumen = chequera.getResumen();
      
      if (chequera.tipo === "propia") {
        resumen.chequerasPropias++;
      } else {
        resumen.chequerasTerceros++;
      }

      resumen.totalCheques += chequeraResumen.totalCheques;
      resumen.totalMovimientos += chequeraResumen.totalMovimientos;
      resumen.totalIngresos += chequeraResumen.totalIngresos;
      resumen.totalEgresos += chequeraResumen.totalEgresos;

      // Sumar cheques por estado
      Object.keys(chequeraResumen.chequesPorEstado).forEach(estado => {
        resumen.chequesPorEstado[estado] += chequeraResumen.chequesPorEstado[estado];
      });

      // Sumar cheques por tipo
      resumen.chequesPorTipo.propio += chequeraResumen.chequesPropios;
      resumen.chequesPorTipo.tercero += chequeraResumen.chequesTerceros;

      resumen.chequeras.push({
        id: chequera.id,
        nombre: chequera.nombre,
        tipo: chequera.tipo,
        banco: chequera.banco,
        proximoCheque: chequera.proximoCheque,
        resumen: chequeraResumen,
      });
    });

    // Calcular saldo total
    resumen.saldoTotal = resumen.totalIngresos - resumen.totalEgresos;

    res.json({
      success: true,
      data: resumen,
    });
  } catch (error) {
    console.error("Error al obtener resumen de chequeras:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};