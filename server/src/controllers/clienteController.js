import Cliente from "../models/Cliente.js";
import User from "../models/User.js";
import Counter from "../models/Counter.js";
import CashBox from "../models/CashBox.js";

// Crear nuevo cliente
export const createCliente = async (req, res) => {
  try {
    const {
      tipoPersona,
      nombreCompleto,
      razonSocial,
      dni,
      fechaNacimiento,
      nacionalidad,
      estadoCivil,
      profesion,
      datosFiscales,
      contacto,
      direccionFiscal,
      direccionComercial,
      configuracionComercial,
    } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    // Validar datos requeridos
    if (!nombreCompleto || !tipoPersona) {
      return res.status(400).json({
        success: false,
        message: "Nombre completo y tipo de persona son requeridos",
      });
    }

    // Validar DNI para personas físicas
    if (tipoPersona === "fisica" && !dni) {
      return res.status(400).json({
        success: false,
        message: "DNI es requerido para personas físicas",
      });
    }

    // Validar razón social para personas jurídicas
    if (tipoPersona === "juridica" && !razonSocial) {
      return res.status(400).json({
        success: false,
        message: "Razón social es requerida para personas jurídicas",
      });
    }

    // Verificar que no exista un cliente con el mismo DNI o CUIT
    const existingCliente = await Cliente.findOne({
      companyId,
      $or: [
        { dni: dni?.trim() },
        { "datosFiscales.cuit": datosFiscales?.cuit?.trim() },
      ],
    });

    if (existingCliente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un cliente con ese DNI o CUIT",
      });
    }

    const clienteData = {
      tipoPersona,
      nombreCompleto: nombreCompleto.trim(),
      razonSocial: razonSocial?.trim(),
      dni: dni?.trim(),
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
      nacionalidad: nacionalidad?.trim() || "Argentina",
      estadoCivil,
      profesion: profesion?.trim(),
      datosFiscales,
      contacto,
      direccionFiscal,
      direccionComercial,
      configuracionComercial,
      companyId,
      userId,
      createdBy: userId,
    };

    const cliente = new Cliente(clienteData);
    await cliente.save();

    // Poblar información del usuario creador
    await cliente.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      data: cliente,
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener todos los clientes de la empresa
export const getClientes = async (req, res) => {
  try {
    const companyId = req.user.company.id;
    const { page = 1, limit = 10, estado, search, tipoPersona } = req.query;

    const filter = { companyId };

    if (estado) {
      filter.estado = estado;
    }

    if (tipoPersona) {
      filter.tipoPersona = tipoPersona;
    }

    if (search) {
      filter.$or = [
        { nombreCompleto: { $regex: search, $options: "i" } },
        { razonSocial: { $regex: search, $options: "i" } },
        { dni: { $regex: search, $options: "i" } },
        { "datosFiscales.cuit": { $regex: search, $options: "i" } },
        { "contacto.email": { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "createdBy", select: "name email" },
        { path: "lastModifiedBy", select: "name email" },
        {
          path: "configuracionComercial.vendedorAsignado",
          select: "name email",
        },
      ],
    };

    const clientes = await Cliente.find(filter)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit);

    const total = await Cliente.countDocuments(filter);

    res.json({
      success: true,
      data: {
        clientes,
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
    console.error("Error al obtener clientes:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId })
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .populate("configuracionComercial.vendedorAsignado", "name email")
      .populate("facturas.createdBy", "name email")
      .populate("presupuestos.createdBy", "name email")
      .populate("cuentaCorriente.createdBy", "name email")
      .populate("pagosEfectivo.createdBy", "name email")
      .populate("pagosBancarios.createdBy", "name email")
      .populate("pagosCheques.createdBy", "name email");

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        cliente,
        resumen: cliente.getResumen(),
        estadoCrediticio: cliente.getEstadoCrediticio(),
      },
    });
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombreCompleto,
      razonSocial,
      dni,
      fechaNacimiento,
      nacionalidad,
      estadoCivil,
      profesion,
      datosFiscales,
      contacto,
      direccionFiscal,
      direccionComercial,
      configuracionComercial,
      estado,
    } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    // Verificar DNI/CUIT único si se está cambiando
    if (dni && dni.trim() !== cliente.dni) {
      const existingCliente = await Cliente.findOne({
        dni: dni.trim(),
        companyId,
        _id: { $ne: id },
      });

      if (existingCliente) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un cliente con ese DNI",
        });
      }
    }

    if (
      datosFiscales?.cuit &&
      datosFiscales.cuit.trim() !== cliente.datosFiscales?.cuit
    ) {
      const existingCliente = await Cliente.findOne({
        "datosFiscales.cuit": datosFiscales.cuit.trim(),
        companyId,
        _id: { $ne: id },
      });

      if (existingCliente) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un cliente con ese CUIT",
        });
      }
    }

    // Actualizar campos
    if (nombreCompleto) cliente.nombreCompleto = nombreCompleto.trim();
    if (razonSocial !== undefined) cliente.razonSocial = razonSocial?.trim();
    if (dni !== undefined) cliente.dni = dni?.trim();
    if (fechaNacimiento) cliente.fechaNacimiento = new Date(fechaNacimiento);
    if (nacionalidad) cliente.nacionalidad = nacionalidad.trim();
    if (estadoCivil) cliente.estadoCivil = estadoCivil;
    if (profesion !== undefined) cliente.profesion = profesion?.trim();
    if (datosFiscales)
      cliente.datosFiscales = { ...cliente.datosFiscales, ...datosFiscales };
    if (contacto) cliente.contacto = { ...cliente.contacto, ...contacto };
    if (direccionFiscal)
      cliente.direccionFiscal = {
        ...cliente.direccionFiscal,
        ...direccionFiscal,
      };
    if (direccionComercial)
      cliente.direccionComercial = {
        ...cliente.direccionComercial,
        ...direccionComercial,
      };
    if (configuracionComercial)
      cliente.configuracionComercial = {
        ...cliente.configuracionComercial,
        ...configuracionComercial,
      };
    if (estado) cliente.estado = estado;
    cliente.lastModifiedBy = userId;

    await cliente.save();

    await cliente.populate([
      { path: "createdBy", select: "name email" },
      { path: "lastModifiedBy", select: "name email" },
      { path: "configuracionComercial.vendedorAsignado", select: "name email" },
    ]);

    res.json({
      success: true,
      message: "Cliente actualizado exitosamente",
      data: cliente,
    });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Agregar factura
export const agregarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const facturaData = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    try {
      // Generar número automático de factura si no se proporciona
      if (!facturaData.numero) {
        const tipoFactura = `factura_${facturaData.tipo || "A"}`;
        const numeroData = await Counter.getNextNumber(
          companyId,
          tipoFactura,
          userId
        );
        facturaData.numero = numeroData.numero;
      }

      const resultado = cliente.agregarFactura(facturaData, userId);
      await cliente.save();

      res.status(201).json({
        success: true,
        message: "Factura agregada exitosamente",
        data: {
          factura: resultado.factura,
          movimiento: resultado.movimiento,
          resumen: cliente.getResumen(),
        },
      });
    } catch (facturaError) {
      return res.status(400).json({
        success: false,
        message: facturaError.message,
      });
    }
  } catch (error) {
    console.error("Error al agregar factura:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Agregar presupuesto
export const agregarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const presupuestoData = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    try {
      // Generar número automático de presupuesto si no se proporciona
      if (!presupuestoData.numero) {
        const numeroData = await Counter.getNextNumber(
          companyId,
          "presupuesto",
          userId
        );
        presupuestoData.numero = numeroData.numero;
      }

      const presupuesto = cliente.agregarPresupuesto(presupuestoData, userId);
      await cliente.save();

      res.status(201).json({
        success: true,
        message: "Presupuesto agregado exitosamente",
        data: {
          presupuesto,
          resumen: cliente.getResumen(),
        },
      });
    } catch (presupuestoError) {
      return res.status(400).json({
        success: false,
        message: presupuestoError.message,
      });
    }
  } catch (error) {
    console.error("Error al agregar presupuesto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Registrar pago en efectivo
export const registrarPagoEfectivo = async (req, res) => {
  try {
    const { id } = req.params;
    const pagoData = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    try {
      // Validar que la caja exista si se proporciona
      if (pagoData.caja && pagoData.caja.id) {
        const caja = await CashBox.findOne({
          _id: pagoData.caja.id,
          companyId,
        });

        if (!caja) {
          return res.status(400).json({
            success: false,
            message: "La caja especificada no existe",
          });
        }

        // Actualizar el nombre de la caja en los datos del pago
        pagoData.caja.nombre = caja.name;
      }

      // Generar número automático de recibo si no se proporciona
      if (!pagoData.recibo || !pagoData.recibo.numero) {
        const numeroData = await Counter.getNextNumber(
          companyId,
          "recibo_efectivo",
          userId
        );
        if (!pagoData.recibo) pagoData.recibo = {};
        pagoData.recibo.numero = numeroData.numero;
      }

      const resultado = await cliente.registrarPagoEfectivo(pagoData, userId);
      await cliente.save();

      res.status(201).json({
        success: true,
        message: "Pago en efectivo registrado exitosamente",
        data: {
          pago: resultado.pago,
          movimiento: resultado.movimiento,
          movimientoCaja: resultado.movimientoCaja,
          resumen: cliente.getResumen(),
        },
      });
    } catch (pagoError) {
      return res.status(400).json({
        success: false,
        message: pagoError.message,
      });
    }
  } catch (error) {
    console.error("Error al registrar pago en efectivo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Registrar pago bancario
export const registrarPagoBancario = async (req, res) => {
  try {
    const { id } = req.params;
    const pagoData = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    try {
      // Generar número automático de comprobante si no se proporciona
      if (!pagoData.comprobante || !pagoData.comprobante.numero) {
        const numeroData = await Counter.getNextNumber(
          companyId,
          "comprobante_bancario",
          userId
        );
        if (!pagoData.comprobante) pagoData.comprobante = {};
        pagoData.comprobante.numero = numeroData.numero;
      }

      const resultado = cliente.registrarPagoBancario(pagoData, userId);
      await cliente.save();

      res.status(201).json({
        success: true,
        message: "Pago bancario registrado exitosamente",
        data: {
          pago: resultado.pago,
          movimiento: resultado.movimiento,
          resumen: cliente.getResumen(),
        },
      });
    } catch (pagoError) {
      return res.status(400).json({
        success: false,
        message: pagoError.message,
      });
    }
  } catch (error) {
    console.error("Error al registrar pago bancario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Registrar pago con cheque
export const registrarPagoCheque = async (req, res) => {
  try {
    const { id } = req.params;
    const pagoData = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    try {
      // Generar número automático de cheque si no se proporciona
      if (!pagoData.numero) {
        const numeroData = await Counter.getNextNumber(
          companyId,
          "cheque",
          userId
        );
        pagoData.numero = numeroData.numero;
      }

      const resultado = cliente.registrarPagoCheque(pagoData, userId);
      await cliente.save();

      res.status(201).json({
        success: true,
        message: "Pago con cheque registrado exitosamente",
        data: {
          pago: resultado.pago,
          movimiento: resultado.movimiento,
          resumen: cliente.getResumen(),
        },
      });
    } catch (pagoError) {
      return res.status(400).json({
        success: false,
        message: pagoError.message,
      });
    }
  } catch (error) {
    console.error("Error al registrar pago con cheque:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener cuenta corriente de un cliente
export const getCuentaCorriente = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, tipo, fechaDesde, fechaHasta } = req.query;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId }).populate(
      "cuentaCorriente.createdBy",
      "name email"
    );

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    let movimientos = [...cliente.cuentaCorriente];

    // Filtrar por tipo si se especifica
    if (tipo && ["debe", "haber"].includes(tipo)) {
      movimientos = movimientos.filter((mov) => mov.tipo === tipo);
    }

    // Filtrar por fechas si se especifican
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      movimientos = movimientos.filter((mov) => new Date(mov.fecha) >= desde);
    }

    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999); // Incluir todo el día
      movimientos = movimientos.filter((mov) => new Date(mov.fecha) <= hasta);
    }

    // Ordenar por fecha (más recientes primero)
    movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const movimientosPaginados = movimientos.slice(startIndex, endIndex);

    // Calcular totales
    const totalDebe = movimientos
      .filter((mov) => mov.tipo === "debe")
      .reduce((sum, mov) => sum + mov.monto, 0);

    const totalHaber = movimientos
      .filter((mov) => mov.tipo === "haber")
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
          totalDebe,
          totalHaber,
          saldo: totalDebe - totalHaber,
          saldoActual: cliente.saldoActual,
        },
        clienteInfo: {
          id: cliente._id,
          nombre: cliente.nombreCompleto,
          razonSocial: cliente.razonSocial,
          tipoPersona: cliente.tipoPersona,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener cuenta corriente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Función getFacturas eliminada - Los datos se obtienen directamente del cliente en getClienteById

// Eliminar cliente (soft delete)
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cliente = await Cliente.findOne({ _id: id, companyId });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    // Verificar que no tenga facturas pendientes
    const facturasPendientes = cliente.facturas.filter(
      (factura) => factura.estado === "pendiente"
    );

    if (facturasPendientes.length > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar un cliente con facturas pendientes",
      });
    }

    cliente.estado = "inactivo";
    cliente.lastModifiedBy = userId;
    await cliente.save();

    res.json({
      success: true,
      message: "Cliente desactivado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener resumen de clientes
export const getClientesResumen = async (req, res) => {
  try {
    const companyId = req.user.company.id;

    const clientes = await Cliente.find({ companyId });

    const resumen = {
      totalClientes: clientes.length,
      clientesActivos: 0,
      clientesInactivos: 0,
      clientesSuspendidos: 0,
      clientesMorosos: 0,
      personasFisicas: 0,
      personasJuridicas: 0,
      totalFacturas: 0,
      totalPresupuestos: 0,
      totalSaldoDeudor: 0,
      totalSaldoAcreedor: 0,
      facturasPendientes: 0,
      facturasVencidas: 0,
      clientes: [],
    };

    clientes.forEach((cliente) => {
      const clienteResumen = cliente.getResumen();
      const estadoCrediticio = cliente.getEstadoCrediticio();

      // Contadores por estado
      switch (cliente.estado) {
        case "activo":
          resumen.clientesActivos++;
          break;
        case "inactivo":
          resumen.clientesInactivos++;
          break;
        case "suspendido":
          resumen.clientesSuspendidos++;
          break;
        case "moroso":
          resumen.clientesMorosos++;
          break;
      }

      // Contadores por tipo de persona
      if (cliente.tipoPersona === "fisica") {
        resumen.personasFisicas++;
      } else {
        resumen.personasJuridicas++;
      }

      // Totales
      resumen.totalFacturas += clienteResumen.cantidadFacturas;
      resumen.totalPresupuestos += clienteResumen.cantidadPresupuestos;
      resumen.facturasPendientes += clienteResumen.facturasPendientes;
      resumen.facturasVencidas += clienteResumen.facturasVencidas;

      // Saldos
      if (cliente.saldoActual > 0) {
        resumen.totalSaldoDeudor += cliente.saldoActual;
      } else {
        resumen.totalSaldoAcreedor += Math.abs(cliente.saldoActual);
      }

      resumen.clientes.push({
        id: cliente.id,
        nombre: cliente.nombreCompleto,
        razonSocial: cliente.razonSocial,
        tipoPersona: cliente.tipoPersona,
        estado: cliente.estado,
        saldoActual: cliente.saldoActual,
        resumen: clienteResumen,
        estadoCrediticio,
      });
    });

    // Calcular saldo neto
    resumen.saldoNeto = resumen.totalSaldoDeudor - resumen.totalSaldoAcreedor;

    res.json({
      success: true,
      data: resumen,
    });
  } catch (error) {
    console.error("Error al obtener resumen de clientes:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
