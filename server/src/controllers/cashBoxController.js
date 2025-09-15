import CashBox from "../models/CashBox.js";
import User from "../models/User.js";

// Crear nueva caja
export const createCashBox = async (req, res) => {
  console.log(req);
  try {
    const { name, description, initialBalance, currency } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    // Validar datos requeridos
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la caja es requerido",
      });
    }

    // Verificar que no exista una caja con el mismo nombre para la empresa
    const existingCashBox = await CashBox.findOne({
      name: name.trim(),
      companyId,
      isActive: true,
    });

    if (existingCashBox) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una caja activa con ese nombre",
      });
    }

    const cashBoxData = {
      name: name.trim(),
      description: description?.trim(),
      initialBalance: initialBalance || 0,
      currentBalance: initialBalance || 0,
      previousBalance: 0,
      currency: currency || "ARS",
      companyId,
      userId,
      createdBy: userId,
    };

    const cashBox = new CashBox(cashBoxData);
    await cashBox.save();

    // Poblar información del usuario creador
    await cashBox.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Caja creada exitosamente",
      data: cashBox,
    });
  } catch (error) {
    console.error("Error al crear caja:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener todas las cajas de la empresa
export const getCashBoxes = async (req, res) => {
  try {
    const companyId = req.user.company.id;
    const { page = 1, limit = 10, isActive, search } = req.query;

    const filter = { companyId };

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
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

    const cashBoxes = await CashBox.find(filter)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit);

    const total = await CashBox.countDocuments(filter);

    res.json({
      success: true,
      data: {
        cashBoxes,
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
    console.error("Error al obtener cajas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener caja por ID
export const getCashBoxById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.company.id;

    const cashBox = await CashBox.findOne({ _id: id, companyId })
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .populate("movements.createdBy", "name email");

    if (!cashBox) {
      return res.status(404).json({
        success: false,
        message: "Caja no encontrada",
      });
    }

    res.json({
      success: true,
      data: cashBox,
    });
  } catch (error) {
    console.error("Error al obtener caja:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Actualizar caja
export const updateCashBox = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, currency } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cashBox = await CashBox.findOne({ _id: id, companyId });

    if (!cashBox) {
      return res.status(404).json({
        success: false,
        message: "Caja no encontrada",
      });
    }

    // Verificar nombre único si se está cambiando
    if (name && name.trim() !== cashBox.name) {
      const existingCashBox = await CashBox.findOne({
        name: name.trim(),
        companyId,
        isActive: true,
        _id: { $ne: id },
      });

      if (existingCashBox) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una caja activa con ese nombre",
        });
      }
    }

    // Actualizar campos
    if (name) cashBox.name = name.trim();
    if (description !== undefined) cashBox.description = description?.trim();
    if (isActive !== undefined) cashBox.isActive = isActive;
    if (currency) cashBox.currency = currency;
    cashBox.lastModifiedBy = userId;

    await cashBox.save();

    await cashBox.populate([
      { path: "createdBy", select: "name email" },
      { path: "lastModifiedBy", select: "name email" },
    ]);

    res.json({
      success: true,
      message: "Caja actualizada exitosamente",
      data: cashBox,
    });
  } catch (error) {
    console.error("Error al actualizar caja:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Agregar movimiento a la caja
export const addMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      amount,
      description,
      reference,
      category,
      paymentMethod,
      relatedCashBoxId,
    } = req.body;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    // Validar datos requeridos
    if (!type || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: "Tipo, monto y descripción son requeridos",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto debe ser mayor a 0",
      });
    }

    const cashBox = await CashBox.findOne({
      _id: id,
      companyId,
      isActive: true,
    });

    if (!cashBox) {
      return res.status(404).json({
        success: false,
        message: "Caja no encontrada o inactiva",
      });
    }

    // Validar transferencia
    if (type === "transferencia") {
      if (!relatedCashBoxId) {
        return res.status(400).json({
          success: false,
          message: "La caja destino es requerida para transferencias",
        });
      }

      const destinationCashBox = await CashBox.findOne({
        _id: relatedCashBoxId,
        companyId,
        isActive: true,
      });

      if (!destinationCashBox) {
        return res.status(404).json({
          success: false,
          message: "Caja destino no encontrada o inactiva",
        });
      }

      if (relatedCashBoxId === id) {
        return res.status(400).json({
          success: false,
          message: "No se puede transferir a la misma caja",
        });
      }
    }

    const movementData = {
      type,
      amount: parseFloat(amount),
      description: description.trim(),
      reference: reference?.trim(),
      category: category?.trim(),
      paymentMethod,
      relatedCashBoxId,
    };

    try {
      // Agregar movimiento a la caja origen
      const movement = cashBox.addMovement(movementData, userId);
      await cashBox.save();

      // Si es transferencia, agregar movimiento de ingreso a la caja destino
      if (type === "transferencia") {
        const destinationCashBox = await CashBox.findById(relatedCashBoxId);
        const incomingMovementData = {
          type: "ingreso",
          amount: parseFloat(amount),
          description: `Transferencia desde ${
            cashBox.name
          }: ${description.trim()}`,
          reference: reference?.trim(),
          category: category?.trim(),
          paymentMethod: "transferencia",
          relatedCashBoxId: id,
        };

        destinationCashBox.addMovement(incomingMovementData, userId);
        await destinationCashBox.save();
      }

      // Poblar información del usuario
      await cashBox.populate("movements.createdBy", "name email");

      res.status(201).json({
        success: true,
        message: "Movimiento agregado exitosamente",
        data: {
          movement,
          currentBalance: cashBox.currentBalance,
          previousBalance: cashBox.previousBalance,
        },
      });
    } catch (movementError) {
      return res.status(400).json({
        success: false,
        message: movementError.message,
      });
    }
  } catch (error) {
    console.error("Error al agregar movimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener movimientos de una caja
export const getMovements = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 20,
      type,
      dateFrom,
      dateTo,
      category,
    } = req.query;
    const companyId = req.user.company.id;

    const cashBox = await CashBox.findOne({ _id: id, companyId }).populate(
      "movements.createdBy",
      "name email"
    );

    if (!cashBox) {
      return res.status(404).json({
        success: false,
        message: "Caja no encontrada",
      });
    }

    const filters = {};
    if (type) filters.type = type;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (category) filters.category = category;

    const result = cashBox.getMovements(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      data: result,
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

// Obtener resumen de la caja
export const getCashBoxSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;
    const companyId = req.user.company.id;

    const cashBox = await CashBox.findOne({ _id: id, companyId });

    if (!cashBox) {
      return res.status(404).json({
        success: false,
        message: "Caja no encontrada",
      });
    }

    const summary = cashBox.getSummary(dateFrom, dateTo);

    res.json({
      success: true,
      data: {
        cashBoxInfo: {
          id: cashBox.id,
          name: cashBox.name,
          description: cashBox.description,
          currency: cashBox.currency,
          isActive: cashBox.isActive,
        },
        summary,
      },
    });
  } catch (error) {
    console.error("Error al obtener resumen:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Eliminar caja (soft delete)
export const deleteCashBox = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const companyId = req.user.company.id;

    const cashBox = await CashBox.findOne({ _id: id, companyId });

    if (!cashBox) {
      return res.status(404).json({
        success: false,
        message: "Caja no encontrada",
      });
    }

    // Verificar que la caja no tenga saldo
    if (cashBox.currentBalance > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar una caja con saldo positivo",
      });
    }

    cashBox.isActive = false;
    cashBox.lastModifiedBy = userId;
    await cashBox.save();

    res.json({
      success: true,
      message: "Caja desactivada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar caja:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener resumen general de todas las cajas
export const getGeneralSummary = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { dateFrom, dateTo } = req.query;

    const cashBoxes = await CashBox.find({ companyId, isActive: true });

    const generalSummary = {
      totalCashBoxes: cashBoxes.length,
      totalBalance: 0,
      totalIngresos: 0,
      totalEgresos: 0,
      totalTransferencias: 0,
      cashBoxesSummary: [],
    };

    cashBoxes.forEach((cashBox) => {
      const summary = cashBox.getSummary(dateFrom, dateTo);

      generalSummary.totalBalance += cashBox.currentBalance;
      generalSummary.totalIngresos += summary.totalIngresos;
      generalSummary.totalEgresos += summary.totalEgresos;
      generalSummary.totalTransferencias += summary.totalTransferenciasOut;

      generalSummary.cashBoxesSummary.push({
        id: cashBox.id,
        name: cashBox.name,
        currentBalance: cashBox.currentBalance,
        currency: cashBox.currency,
        summary,
      });
    });

    res.json({
      success: true,
      data: generalSummary,
    });
  } catch (error) {
    console.error("Error al obtener resumen general:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
