import Sale from '../models/Sale.js';
import Property from '../models/Property.js';
import Owner from '../models/Owner.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Crear una nueva venta
export const createSale = async (req, res) => {
  try {
    const {
      property,
      prospect,
      pricing,
      notes,
      expectedClosingDate,
      paymentMethod,
      commission
    } = req.body;

    // Verificar que la propiedad existe y está disponible
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada'
      });
    }

    if (propertyDoc.status !== 'disponible') {
      return res.status(400).json({
        success: false,
        message: 'La propiedad no está disponible para venta'
      });
    }

    // Verificar que el prospecto existe
    const prospectDoc = await User.findById(prospect);
    if (!prospectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Prospecto no encontrado'
      });
    }

    // Calcular monto de seña
    const depositAmount = (pricing.totalPrice * pricing.depositPercentage) / 100;

    const saleData = {
      property,
      owner: propertyDoc.owner,
      prospect,
      pricing: {
        ...pricing,
        depositAmount,
        paymentMethod: paymentMethod || 'transferencia'
      },
      notes,
      createdBy: req.user.id
    };

    if (expectedClosingDate) {
      saleData.dates = { expectedClosingDate: new Date(expectedClosingDate) };
    }

    if (commission) {
      saleData.commission = {
        ...commission,
        agentId: req.user.id
      };
    }

    const sale = new Sale(saleData);
    await sale.save();

    // Poblar los datos para la respuesta
    await sale.populate([
      { path: 'property', select: 'title address type characteristics pricing' },
      { path: 'owner', select: 'name email phone' },
      { path: 'prospect', select: 'name email phone' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: sale
    });

  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todas las ventas con filtros y paginación
export const getSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      property,
      prospect,
      owner,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filtros
    if (status) query.status = status;
    if (property) query.property = property;
    if (prospect) query.prospect = prospect;
    if (owner) query.owner = owner;

    if (startDate || endDate) {
      query['dates.saleDate'] = {};
      if (startDate) query['dates.saleDate'].$gte = new Date(startDate);
      if (endDate) query['dates.saleDate'].$lte = new Date(endDate);
    }

    if (minPrice || maxPrice) {
      query['pricing.totalPrice'] = {};
      if (minPrice) query['pricing.totalPrice'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.totalPrice'].$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [sales, total] = await Promise.all([
      Sale.find(query)
        .populate('property', 'title address type characteristics pricing')
        .populate('owner', 'name email phone')
        .populate('prospect', 'name email phone')
        .populate('createdBy', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Sale.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: sales,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: Number(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener una venta por ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de venta inválido'
      });
    }

    const sale = await Sale.findById(id)
      .populate('property', 'title address type characteristics pricing media')
      .populate('owner', 'name email phone address')
      .populate('prospect', 'name email phone address')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('commission.agentId', 'name email');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    res.json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar una venta
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de venta inválido'
      });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    // No permitir actualizar ventas escrituradas
    if (sale.status === 'escriturada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar una venta escriturada'
      });
    }

    // Actualizar campos permitidos
    const allowedFields = [
      'pricing', 'notes', 'dates', 'commission', 'additionalInfo'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'dates' && updateData[field]) {
          sale.dates = { ...sale.dates.toObject(), ...updateData[field] };
        } else if (field === 'pricing' && updateData[field]) {
          sale.pricing = { ...sale.pricing.toObject(), ...updateData[field] };
        } else if (field === 'commission' && updateData[field]) {
          sale.commission = { ...sale.commission.toObject(), ...updateData[field] };
        } else if (field === 'additionalInfo' && updateData[field]) {
          sale.additionalInfo = { ...sale.additionalInfo.toObject(), ...updateData[field] };
        } else {
          sale[field] = updateData[field];
        }
      }
    });

    sale.updatedBy = req.user.id;
    await sale.save();

    await sale.populate([
      { path: 'property', select: 'title address type characteristics pricing' },
      { path: 'owner', select: 'name email phone' },
      { path: 'prospect', select: 'name email phone' },
      { path: 'updatedBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Venta actualizada exitosamente',
      data: sale
    });

  } catch (error) {
    console.error('Error al actualizar venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar estado de una venta
export const updateSaleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de venta inválido'
      });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    await sale.updateStatus(status, reason, req.user.id);

    // Si la venta se escritura, actualizar el estado de la propiedad
    if (status === 'escriturada') {
      await Property.findByIdAndUpdate(sale.property, { 
        status: 'vendida',
        soldDate: new Date(),
        soldPrice: sale.pricing.totalPrice
      });
    }

    await sale.populate([
      { path: 'property', select: 'title address type' },
      { path: 'prospect', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      message: `Estado de venta actualizado a ${status}`,
      data: sale
    });

  } catch (error) {
    console.error('Error al actualizar estado de venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar una venta
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de venta inválido'
      });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    // No permitir eliminar ventas escrituradas
    if (sale.status === 'escriturada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar una venta escriturada'
      });
    }

    // Eliminar documentos asociados
    const documentCategories = ['escritura', 'titulo', 'planos', 'recibos', 'contrato', 'otros'];
    
    for (const category of documentCategories) {
      if (sale.documents[category] && sale.documents[category].length > 0) {
        for (const doc of sale.documents[category]) {
          try {
            await fs.unlink(doc.path);
          } catch (error) {
            console.warn(`No se pudo eliminar el archivo: ${doc.path}`);
          }
        }
      }
    }

    await Sale.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Venta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Agregar documento a una venta (usando URL de Cloudinary)
export const addDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, url, name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de venta inválido'
      });
    }

    if (!url || !category || !name) {
      return res.status(400).json({
        success: false,
        message: 'URL, categoría y nombre del documento son requeridos'
      });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    const validCategories = ['escritura', 'titulo', 'planos', 'recibos', 'contrato', 'otros'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Categoría de documento inválida'
      });
    }

    const documentData = {
      name,
      url,
      description: description || '',
      uploadedAt: new Date()
    };

    await sale.addDocument(category, documentData);

    res.json({
      success: true,
      message: 'Documento agregado exitosamente',
      data: {
        document: documentData,
        totalDocuments: sale.totalDocuments
      }
    });

  } catch (error) {
    console.error('Error al agregar documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar documento de una venta
export const removeDocument = async (req, res) => {
  try {
    const { id, category, documentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de venta inválido'
      });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    const document = sale.documents[category].id(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    await sale.removeDocument(category, documentId);

    res.json({
      success: true,
      message: 'Documento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estadísticas de ventas
export const getSalesStats = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;

    const stats = await Sale.getSalesStats(startDate, endDate);

    // Estadísticas adicionales
    const [overdueSales, recentSales] = await Promise.all([
      Sale.findOverdue(),
      Sale.find({ status: { $ne: 'cancelada' } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('property', 'title address')
        .populate('prospect', 'name')
    ]);

    res.json({
      success: true,
      data: {
        summary: stats[0] || {
          statusBreakdown: [],
          totalSales: 0,
          totalRevenue: 0
        },
        overdueSales: overdueSales.length,
        recentSales
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Buscar ventas similares
export const findSimilarSales = async (req, res) => {
  try {
    const { propertyType, minPrice, maxPrice, location } = req.query;

    const priceRange = {};
    if (minPrice) priceRange.min = Number(minPrice);
    if (maxPrice) priceRange.max = Number(maxPrice);

    const similarSales = await Sale.findSimilarSales(
      propertyType,
      Object.keys(priceRange).length > 0 ? priceRange : null,
      location
    );

    res.json({
      success: true,
      data: similarSales
    });

  } catch (error) {
    console.error('Error al buscar ventas similares:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener ventas vencidas
export const getOverdueSales = async (req, res) => {
  try {
    const overdueSales = await Sale.findOverdue();

    res.json({
      success: true,
      data: overdueSales
    });

  } catch (error) {
    console.error('Error al obtener ventas vencidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};