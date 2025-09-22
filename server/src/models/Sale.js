import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  // Información básica de la venta
  saleNumber: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'VTA-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
  },

  // Referencias a otros modelos
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true
  },
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
    index: true
  },
  
  prospect: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Información financiera
  pricing: {
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['ARS', 'USD', 'EUR'],
      default: 'ARS'
    },
    depositPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 10
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['efectivo', 'transferencia', 'cheque', 'credito_hipotecario', 'mixto'],
      default: 'transferencia'
    }
  },

  // Estado de la venta
  status: {
    type: String,
    enum: ['borrador', 'pendiente', 'señada', 'escriturada', 'cancelada', 'suspendida'],
    default: 'borrador',
    index: true
  },

  // Fechas importantes
  dates: {
    saleDate: {
      type: Date,
      default: Date.now
    },
    depositDate: {
      type: Date
    },
    expectedClosingDate: {
      type: Date
    },
    actualClosingDate: {
      type: Date
    },
    contractSignDate: {
      type: Date
    }
  },

  // Documentos de la venta (URLs de Cloudinary)
  documents: {
    escritura: [{
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    titulo: [{
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    planos: [{
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    recibos: [{
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    contrato: [{
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    otros: [{
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Comisiones
  commission: {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 3
    },
    amount: {
      type: Number,
      min: 0
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: Date
  },

  // Notas y observaciones
  notes: {
    type: String,
    maxlength: 2000
  },

  // Información adicional
  additionalInfo: {
    financingRequired: {
      type: Boolean,
      default: false
    },
    bankApproval: {
      type: Boolean,
      default: false
    },
    legalReview: {
      type: Boolean,
      default: false
    },
    inspectionCompleted: {
      type: Boolean,
      default: false
    }
  },

  // Historial de cambios de estado
  statusHistory: [{
    status: {
      type: String,
      enum: ['borrador', 'pendiente', 'señada', 'escriturada', 'cancelada', 'suspendida']
    },
    date: {
      type: Date,
      default: Date.now
    },
    reason: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Metadatos
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para optimizar consultas
saleSchema.index({ property: 1, status: 1 });
saleSchema.index({ prospect: 1, 'dates.saleDate': -1 });
saleSchema.index({ owner: 1, status: 1 });
saleSchema.index({ 'dates.saleDate': -1 });
saleSchema.index({ status: 1, 'dates.expectedClosingDate': 1 });

// Virtuals
saleSchema.virtual('totalDocuments').get(function() {
  const docs = this.documents;
  return (docs.escritura?.length || 0) + 
         (docs.titulo?.length || 0) + 
         (docs.planos?.length || 0) + 
         (docs.recibos?.length || 0) + 
         (docs.contrato?.length || 0) + 
         (docs.otros?.length || 0);
});

saleSchema.virtual('daysToClosing').get(function() {
  if (!this.dates.expectedClosingDate) return null;
  const today = new Date();
  const closingDate = new Date(this.dates.expectedClosingDate);
  const diffTime = closingDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

saleSchema.virtual('isOverdue').get(function() {
  if (!this.dates.expectedClosingDate || this.status === 'escriturada' || this.status === 'cancelada') {
    return false;
  }
  return new Date() > new Date(this.dates.expectedClosingDate);
});

// Middleware pre-save
saleSchema.pre('save', function(next) {
  // Calcular monto restante
  if (this.pricing.totalPrice && this.pricing.depositAmount) {
    this.pricing.remainingAmount = this.pricing.totalPrice - this.pricing.depositAmount;
  }

  // Calcular comisión
  if (this.pricing.totalPrice && this.commission.percentage) {
    this.commission.amount = (this.pricing.totalPrice * this.commission.percentage) / 100;
  }

  // Agregar al historial de estado si cambió
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      changedBy: this.updatedBy
    });
  }

  next();
});

// Métodos de instancia
saleSchema.methods.addDocument = function(category, documentData) {
  if (!this.documents[category]) {
    throw new Error(`Categoría de documento inválida: ${category}`);
  }
  
  this.documents[category].push(documentData);
  return this.save();
};

saleSchema.methods.removeDocument = function(category, documentId) {
  if (!this.documents[category]) {
    throw new Error(`Categoría de documento inválida: ${category}`);
  }
  
  this.documents[category].id(documentId).remove();
  return this.save();
};

saleSchema.methods.updateStatus = function(newStatus, reason, userId) {
  this.status = newStatus;
  this.updatedBy = userId;
  
  // Actualizar fechas específicas según el estado
  if (newStatus === 'señada' && !this.dates.depositDate) {
    this.dates.depositDate = new Date();
  } else if (newStatus === 'escriturada' && !this.dates.actualClosingDate) {
    this.dates.actualClosingDate = new Date();
  }
  
  return this.save();
};

saleSchema.methods.calculateProgress = function() {
  const steps = ['borrador', 'pendiente', 'señada', 'escriturada'];
  const currentIndex = steps.indexOf(this.status);
  
  if (currentIndex === -1) return 0;
  return ((currentIndex + 1) / steps.length) * 100;
};

// Métodos estáticos
saleSchema.statics.findByStatus = function(status) {
  return this.find({ status })
    .populate('property', 'title address type')
    .populate('owner', 'name email phone')
    .populate('prospect', 'name email phone')
    .sort({ 'dates.saleDate': -1 });
};

saleSchema.statics.findOverdue = function() {
  return this.find({
    'dates.expectedClosingDate': { $lt: new Date() },
    status: { $nin: ['escriturada', 'cancelada'] }
  })
    .populate('property', 'title address')
    .populate('prospect', 'name email phone')
    .sort({ 'dates.expectedClosingDate': 1 });
};

saleSchema.statics.getSalesStats = function(startDate, endDate) {
  const matchStage = {};
  
  if (startDate || endDate) {
    matchStage['dates.saleDate'] = {};
    if (startDate) matchStage['dates.saleDate'].$gte = new Date(startDate);
    if (endDate) matchStage['dates.saleDate'].$lte = new Date(endDate);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$pricing.totalPrice' },
        avgValue: { $avg: '$pricing.totalPrice' }
      }
    },
    {
      $group: {
        _id: null,
        statusBreakdown: {
          $push: {
            status: '$_id',
            count: '$count',
            totalValue: '$totalValue',
            avgValue: '$avgValue'
          }
        },
        totalSales: { $sum: '$count' },
        totalRevenue: { $sum: '$totalValue' }
      }
    }
  ]);
};

saleSchema.statics.findSimilarSales = function(propertyType, priceRange, location) {
  const query = {};
  
  if (propertyType) {
    query['property.type'] = propertyType;
  }
  
  if (priceRange && priceRange.min && priceRange.max) {
    query['pricing.totalPrice'] = {
      $gte: priceRange.min,
      $lte: priceRange.max
    };
  }
  
  return this.find(query)
    .populate('property', 'title address type characteristics')
    .populate('prospect', 'name')
    .sort({ 'dates.saleDate': -1 })
    .limit(10);
};

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;