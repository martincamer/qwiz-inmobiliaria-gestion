import Tenant from "../models/Tenant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Función auxiliar para generar token JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// @desc    Crear nuevo inquilino
// @route   POST /api/inquilinos
// @access  Privado (solo inmobiliarias)
export const crearInquilino = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      telefono,
      numeroDocumento,
      propietario,
      propiedad,
      contrato,
      contactoEmergencia,
      notas,
    } = req.body;

    // Verificar si el email ya existe
    const inquilinoExistente = await Tenant.findOne({ email });
    if (inquilinoExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: "Ya existe un inquilino con este email",
      });
    }

    // Verificar si el número de documento ya existe
    const documentoExistente = await Tenant.findOne({ 
      idNumber: numeroDocumento 
    });
    if (documentoExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: "Ya existe un inquilino con este número de documento",
      });
    }

    // Obtener información de la inmobiliaria del usuario autenticado
    const inmobiliaria = {
      companyId: req.user.companyId || req.user._id,
      companyName: req.user.companyName || req.user.name,
      agentId: req.user._id,
      agentName: req.user.name,
    };

    // Crear el inquilino
    const inquilino = await Tenant.create({
      name: nombre,
      email,
      password,
      phone: telefono,
      idNumber: numeroDocumento,
      owner: propietario,
      property: propiedad,
      contract: contrato,
      emergencyContact: contactoEmergencia,
      realEstate: inmobiliaria,
      notes: notas,
    });

    // Generar pagos mensuales automáticamente si se especifica
    if (contrato && contrato.startDate && contrato.endDate) {
      const mesesContrato = Math.ceil(
        (new Date(contrato.endDate) - new Date(contrato.startDate)) / 
        (1000 * 60 * 60 * 24 * 30)
      );
      inquilino.generateMonthlyPayments(mesesContrato);
      await inquilino.save();
    }

    res.status(201).json({
      exito: true,
      mensaje: "Inquilino creado exitosamente",
      datos: {
        inquilino: inquilino.getPublicProfile(),
        token: generarToken(inquilino._id),
      },
    });
  } catch (error) {
    console.error("Error al crear inquilino:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener todos los inquilinos de una inmobiliaria
// @route   GET /api/inquilinos
// @access  Privado
export const obtenerInquilinos = async (req, res) => {
  try {
    const { 
      pagina = 1, 
      limite = 10, 
      estado, 
      busqueda,
      ordenarPor = "createdAt",
      orden = "desc"
    } = req.query;

    // Construir filtros
    const filtros = {
      "realEstate.companyId": req.user.companyId || req.user._id,
    };

    if (estado) {
      filtros.status = estado;
    }

    if (busqueda) {
      filtros.$or = [
        { name: { $regex: busqueda, $options: "i" } },
        { email: { $regex: busqueda, $options: "i" } },
        { phone: { $regex: busqueda, $options: "i" } },
        { idNumber: { $regex: busqueda, $options: "i" } },
        { "property.address": { $regex: busqueda, $options: "i" } },
      ];
    }

    // Configurar paginación
    const opciones = {
      page: parseInt(pagina),
      limit: parseInt(limite),
      sort: { [ordenarPor]: orden === "desc" ? -1 : 1 },
      select: "-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken",
    };

    const inquilinos = await Tenant.paginate(filtros, opciones);

    res.status(200).json({
      exito: true,
      datos: {
        inquilinos: inquilinos.docs,
        paginacion: {
          paginaActual: inquilinos.page,
          totalPaginas: inquilinos.totalPages,
          totalInquilinos: inquilinos.totalDocs,
          limite: inquilinos.limit,
          tienePaginaAnterior: inquilinos.hasPrevPage,
          tienePaginaSiguiente: inquilinos.hasNextPage,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener inquilinos:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener inquilino por ID
// @route   GET /api/inquilinos/:id
// @access  Privado
export const obtenerInquilinoPorId = async (req, res) => {
  try {
    const inquilino = await Tenant.findOne({
      _id: req.params.id,
      "realEstate.companyId": req.user.companyId || req.user._id,
    }).select("-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken");

    if (!inquilino) {
      return res.status(404).json({
        exito: false,
        mensaje: "Inquilino no encontrado",
      });
    }

    res.status(200).json({
      exito: true,
      datos: {
        inquilino,
        contratoActivo: inquilino.isContractActive(),
        diasRestantesContrato: inquilino.getContractDaysRemaining(),
        tienePagosVencidos: inquilino.hasOverduePayments(),
        proximoPago: inquilino.getNextPaymentDue(),
        totalAdeudado: inquilino.getTotalOwed(),
      },
    });
  } catch (error) {
    console.error("Error al obtener inquilino:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Actualizar inquilino
// @route   PUT /api/inquilinos/:id
// @access  Privado
export const actualizarInquilino = async (req, res) => {
  try {
    const inquilino = await Tenant.findOne({
      _id: req.params.id,
      "realEstate.companyId": req.user.companyId || req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        exito: false,
        mensaje: "Inquilino no encontrado",
      });
    }

    // Campos que se pueden actualizar
    const camposPermitidos = [
      "name",
      "email", 
      "phone",
      "idNumber",
      "owner",
      "property",
      "contract",
      "status",
      "emergencyContact",
      "reminders",
      "notes",
    ];

    // Actualizar solo los campos permitidos
    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        inquilino[campo] = req.body[campo];
      }
    });

    // Si se actualiza la contraseña, hashearla
    if (req.body.password) {
      const salt = await bcrypt.genSalt(12);
      inquilino.password = await bcrypt.hash(req.body.password, salt);
    }

    await inquilino.save();

    res.status(200).json({
      exito: true,
      mensaje: "Inquilino actualizado exitosamente",
      datos: {
        inquilino: inquilino.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error("Error al actualizar inquilino:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Eliminar inquilino
// @route   DELETE /api/inquilinos/:id
// @access  Privado
export const eliminarInquilino = async (req, res) => {
  try {
    const inquilino = await Tenant.findOne({
      _id: req.params.id,
      "realEstate.companyId": req.user.companyId || req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        exito: false,
        mensaje: "Inquilino no encontrado",
      });
    }

    await inquilino.deleteOne();

    res.status(200).json({
      exito: true,
      mensaje: "Inquilino eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar inquilino:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Agregar pago a inquilino
// @route   POST /api/inquilinos/:id/pagos
// @access  Privado
export const agregarPago = async (req, res) => {
  try {
    const inquilino = await Tenant.findOne({
      _id: req.params.id,
      "realEstate.companyId": req.user.companyId || req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        exito: false,
        mensaje: "Inquilino no encontrado",
      });
    }

    const {
      monto,
      moneda,
      fechaPago,
      fechaVencimiento,
      metodoPago,
      estado,
      concepto,
      notas,
      recibo,
    } = req.body;

    inquilino.addPayment({
      amount: monto,
      currency: moneda,
      paymentDate: fechaPago,
      dueDate: fechaVencimiento,
      paymentMethod: metodoPago,
      status: estado,
      concept: concepto,
      notes: notas,
      receipt: recibo,
    });

    await inquilino.save();

    res.status(201).json({
      exito: true,
      mensaje: "Pago agregado exitosamente",
      datos: {
        historialPagos: inquilino.paymentHistory,
      },
    });
  } catch (error) {
    console.error("Error al agregar pago:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Marcar pago como pagado
// @route   PUT /api/inquilinos/:id/pagos/:pagoId/pagar
// @access  Privado
export const marcarPagoComoPagado = async (req, res) => {
  try {
    const inquilino = await Tenant.findOne({
      _id: req.params.id,
      "realEstate.companyId": req.user.companyId || req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        exito: false,
        mensaje: "Inquilino no encontrado",
      });
    }

    const pago = inquilino.markPaymentAsPaid(req.params.pagoId, req.body);

    if (!pago) {
      return res.status(404).json({
        exito: false,
        mensaje: "Pago no encontrado",
      });
    }

    await inquilino.save();

    res.status(200).json({
      exito: true,
      mensaje: "Pago marcado como pagado exitosamente",
      datos: {
        pago,
        totalAdeudado: inquilino.getTotalOwed(),
      },
    });
  } catch (error) {
    console.error("Error al marcar pago como pagado:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener historial de pagos de un inquilino
// @route   GET /api/inquilinos/:id/pagos
// @access  Privado
export const obtenerHistorialPagos = async (req, res) => {
  try {
    const { estado, concepto, fechaDesde, fechaHasta } = req.query;

    const inquilino = await Tenant.findOne({
      _id: req.params.id,
      "realEstate.companyId": req.user.companyId || req.user._id,
    }).select("paymentHistory name email");

    if (!inquilino) {
      return res.status(404).json({
        exito: false,
        mensaje: "Inquilino no encontrado",
      });
    }

    let historialPagos = inquilino.paymentHistory;

    // Aplicar filtros
    if (estado) {
      historialPagos = historialPagos.filter(pago => pago.status === estado);
    }

    if (concepto) {
      historialPagos = historialPagos.filter(pago => pago.concept === concepto);
    }

    if (fechaDesde) {
      historialPagos = historialPagos.filter(
        pago => pago.dueDate >= new Date(fechaDesde)
      );
    }

    if (fechaHasta) {
      historialPagos = historialPagos.filter(
        pago => pago.dueDate <= new Date(fechaHasta)
      );
    }

    // Ordenar por fecha de vencimiento (más reciente primero)
    historialPagos.sort((a, b) => b.dueDate - a.dueDate);

    res.status(200).json({
      exito: true,
      datos: {
        inquilino: {
          id: inquilino._id,
          nombre: inquilino.name,
          email: inquilino.email,
        },
        historialPagos,
        resumen: {
          totalPagos: historialPagos.length,
          totalPagado: historialPagos
            .filter(p => p.status === "pagado")
            .reduce((sum, p) => sum + p.amount, 0),
          totalPendiente: historialPagos
            .filter(p => p.status === "pendiente")
            .reduce((sum, p) => sum + p.amount, 0),
          totalVencido: historialPagos
            .filter(p => p.status === "vencido")
            .reduce((sum, p) => sum + p.amount, 0),
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener historial de pagos:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Generar pagos mensuales para un inquilino
// @route   POST /api/inquilinos/:id/generar-pagos
// @access  Privado
export const generarPagosMensuales = async (req, res) => {
  try {
    const { meses = 12 } = req.body;

    const inquilino = await Tenant.findOne({
      _id: req.params.id,
      "realEstate.companyId": req.user.companyId || req.user._id,
    });

    if (!inquilino) {
      return res.status(404).json({
        exito: false,
        mensaje: "Inquilino no encontrado",
      });
    }

    const pagosAnteriores = inquilino.paymentHistory.length;
    inquilino.generateMonthlyPayments(meses);
    await inquilino.save();

    const pagosNuevos = inquilino.paymentHistory.length - pagosAnteriores;

    res.status(200).json({
      exito: true,
      mensaje: `Se generaron ${pagosNuevos} pagos mensuales exitosamente`,
      datos: {
        pagosGenerados: pagosNuevos,
        totalPagos: inquilino.paymentHistory.length,
      },
    });
  } catch (error) {
    console.error("Error al generar pagos mensuales:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener inquilinos con pagos vencidos
// @route   GET /api/inquilinos/pagos-vencidos
// @access  Privado
export const obtenerInquilinosConPagosVencidos = async (req, res) => {
  try {
    const inquilinos = await Tenant.find({
      "realEstate.companyId": req.user.companyId || req.user._id,
      status: "activo",
    }).select("name email phone paymentHistory property.address");

    const inquilinosConPagosVencidos = inquilinos.filter(inquilino => 
      inquilino.hasOverduePayments()
    );

    const resumen = inquilinosConPagosVencidos.map(inquilino => ({
      id: inquilino._id,
      nombre: inquilino.name,
      email: inquilino.email,
      telefono: inquilino.phone,
      direccionPropiedad: inquilino.property.address,
      totalAdeudado: inquilino.getTotalOwed(),
      proximoPago: inquilino.getNextPaymentDue(),
    }));

    res.status(200).json({
      exito: true,
      datos: {
        inquilinosConPagosVencidos: resumen,
        total: resumen.length,
        montoTotalAdeudado: resumen.reduce(
          (total, inquilino) => total + inquilino.totalAdeudado, 
          0
        ),
      },
    });
  } catch (error) {
    console.error("Error al obtener inquilinos con pagos vencidos:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener estadísticas de inquilinos
// @route   GET /api/inquilinos/estadisticas
// @access  Privado
export const obtenerEstadisticasInquilinos = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;

    const [
      totalInquilinos,
      inquilinosActivos,
      inquilinosInactivos,
      contratosVencidos,
      pagosVencidos,
    ] = await Promise.all([
      Tenant.countDocuments({ "realEstate.companyId": companyId }),
      Tenant.countDocuments({ 
        "realEstate.companyId": companyId, 
        status: "activo" 
      }),
      Tenant.countDocuments({ 
        "realEstate.companyId": companyId, 
        status: "inactivo" 
      }),
      Tenant.countDocuments({ 
        "realEstate.companyId": companyId, 
        status: "vencido" 
      }),
      Tenant.find({ 
        "realEstate.companyId": companyId,
        status: "activo"
      }).select("paymentHistory"),
    ]);

    const inquilinosConPagosVencidos = pagosVencidos.filter(inquilino => 
      inquilino.hasOverduePayments()
    ).length;

    const montoTotalAdeudado = pagosVencidos.reduce(
      (total, inquilino) => total + inquilino.getTotalOwed(), 
      0
    );

    res.status(200).json({
      exito: true,
      datos: {
        totalInquilinos,
        inquilinosActivos,
        inquilinosInactivos,
        contratosVencidos,
        inquilinosConPagosVencidos,
        montoTotalAdeudado,
        porcentajeOcupacion: totalInquilinos > 0 
          ? Math.round((inquilinosActivos / totalInquilinos) * 100) 
          : 0,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};