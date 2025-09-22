import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Información básica
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },

  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },

  // Tipo de propiedad
  type: {
    type: String,
    required: [true, 'El tipo de propiedad es obligatorio'],
    enum: {
      values: ['Casa', 'Departamento', 'Local', 'Terreno', 'Oficina', 'Pozo', 'Otro'],
      message: 'Tipo de propiedad no válido'
    }
  },

  // Estado de la propiedad
  status: {
    type: String,
    required: [true, 'El estado es obligatorio'],
    enum: {
      values: ['Venta', 'Alquiler', 'Alquilado', 'Vendido', 'Reservado'],
      message: 'Estado no válido'
    },
    default: 'Venta'
  },

  // Referencia al propietario
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: [true, 'El propietario es obligatorio']
  },

  // Ubicación
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
    maxlength: [200, 'La dirección no puede exceder 200 caracteres']
  },

  neighborhood: {
    type: String,
    trim: true,
    maxlength: [100, 'El barrio no puede exceder 100 caracteres']
  },

  city: {
    type: String,
    required: [true, 'La ciudad es obligatoria'],
    trim: true,
    maxlength: [100, 'La ciudad no puede exceder 100 caracteres']
  },

  province: {
    type: String,
    required: [true, 'La provincia es obligatoria'],
    trim: true,
    maxlength: [100, 'La provincia no puede exceder 100 caracteres']
  },

  postalCode: {
    type: String,
    trim: true,
    maxlength: [10, 'El código postal no puede exceder 10 caracteres']
  },

  // Coordenadas geográficas
  coordinates: {
    latitude: {
      type: Number,
      min: [-90, 'La latitud debe estar entre -90 y 90'],
      max: [90, 'La latitud debe estar entre -90 y 90']
    },
    longitude: {
      type: Number,
      min: [-180, 'La longitud debe estar entre -180 y 180'],
      max: [180, 'La longitud debe estar entre -180 y 180']
    }
  },

  // Características de la propiedad
  characteristics: {
    bedrooms: {
      type: Number,
      min: [0, 'El número de dormitorios no puede ser negativo'],
      default: 0
    },
    bathrooms: {
      type: Number,
      min: [0, 'El número de baños no puede ser negativo'],
      default: 0
    },
    garages: {
      type: Number,
      min: [0, 'El número de garajes no puede ser negativo'],
      default: 0
    },
    totalArea: {
      type: Number,
      min: [0, 'El área total no puede ser negativa']
    },
    coveredArea: {
      type: Number,
      min: [0, 'El área cubierta no puede ser negativa']
    },
    lotArea: {
      type: Number,
      min: [0, 'El área del lote no puede ser negativa']
    },
    floors: {
      type: Number,
      min: [0, 'El número de pisos no puede ser negativo'],
      default: 1
    },
    antiquity: {
      type: Number,
      min: [0, 'La antigüedad no puede ser negativa']
    }
  },

  // Precios
  pricing: {
    salePrice: {
      type: Number,
      min: [0, 'El precio de venta no puede ser negativo']
    },
    rentPrice: {
      type: Number,
      min: [0, 'El precio de alquiler no puede ser negativo']
    },
    currency: {
      type: String,
      enum: ['ARS', 'USD', 'EUR'],
      default: 'ARS'
    },
    expenses: {
      type: Number,
      min: [0, 'Las expensas no pueden ser negativas'],
      default: 0
    }
  },

  // Servicios y amenities
  services: {
    electricity: { type: Boolean, default: false },
    gas: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
    sewer: { type: Boolean, default: false },
    internet: { type: Boolean, default: false },
    cable: { type: Boolean, default: false },
    phone: { type: Boolean, default: false }
  },

  amenities: {
    pool: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    terrace: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    airConditioning: { type: Boolean, default: false },
    heating: { type: Boolean, default: false },
    fireplace: { type: Boolean, default: false }
  },

  // Imágenes
  images: [{
    url: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: [200, 'La descripción de la imagen no puede exceder 200 caracteres']
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],

  // Videos
  videos: [{
    url: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: [200, 'La descripción del video no puede exceder 200 caracteres']
    }
  }],

  // Documentos
  documents: [{
    name: {
      type: String,
      required: true,
      maxlength: [100, 'El nombre del documento no puede exceder 100 caracteres']
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['escritura', 'plano', 'certificado', 'otro'],
      default: 'otro'
    }
  }],

  // Información adicional
  featured: {
    type: Boolean,
    default: false
  },

  published: {
    type: Boolean,
    default: true
  },

  views: {
    type: Number,
    default: 0
  },

  favorites: {
    type: Number,
    default: 0
  },

  // Inquilino actual (si está alquilada)
  currentTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  },

  // Historial de contratos
  contractHistory: [{
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant'
    },
    startDate: Date,
    endDate: Date,
    monthlyRent: Number,
    deposit: Number,
    status: {
      type: String,
      enum: ['activo', 'finalizado', 'rescindido'],
      default: 'activo'
    }
  }],

  // Notas internas
  notes: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },

  // Fechas de auditoría
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Usuario que creó/modificó
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Índices para mejorar el rendimiento
propertySchema.index({ owner: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ city: 1, neighborhood: 1 });
propertySchema.index({ 'pricing.salePrice': 1 });
propertySchema.index({ 'pricing.rentPrice': 1 });
propertySchema.index({ featured: 1, published: 1 });
propertySchema.index({ createdAt: -1 });

// Índice de texto para búsqueda
propertySchema.index({
  title: 'text',
  description: 'text',
  address: 'text',
  neighborhood: 'text'
});

// Índice geoespacial para búsquedas por ubicación
propertySchema.index({ 'coordinates': '2dsphere' });

// Virtual para obtener el precio principal según el estado
propertySchema.virtual('mainPrice').get(function() {
  if (this.status === 'Venta' || this.status === 'Vendido') {
    return this.pricing.salePrice;
  } else {
    return this.pricing.rentPrice;
  }
});

// Virtual para obtener la imagen principal
propertySchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || this.images[0];
});

// Middleware para actualizar updatedAt
propertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para incrementar vistas
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Método para alternar favorito
propertySchema.methods.toggleFavorite = function(increment = true) {
  if (increment) {
    this.favorites += 1;
  } else {
    this.favorites = Math.max(0, this.favorites - 1);
  }
  return this.save();
};

// Método para obtener propiedades similares
propertySchema.methods.getSimilarProperties = function(limit = 5) {
  return this.constructor.find({
    _id: { $ne: this._id },
    type: this.type,
    city: this.city,
    status: this.status,
    published: true
  })
  .populate('owner', 'nombre apellido')
  .limit(limit)
  .sort({ createdAt: -1 });
};

// Método para verificar disponibilidad
propertySchema.methods.isAvailable = function() {
  return ['Venta', 'Alquiler'].includes(this.status);
};

// Método estático para búsqueda avanzada
propertySchema.statics.advancedSearch = function(filters) {
  const query = { published: true };

  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.city) query.city = new RegExp(filters.city, 'i');
  if (filters.neighborhood) query.neighborhood = new RegExp(filters.neighborhood, 'i');
  
  if (filters.minPrice || filters.maxPrice) {
    const priceField = filters.status === 'Venta' ? 'pricing.salePrice' : 'pricing.rentPrice';
    query[priceField] = {};
    if (filters.minPrice) query[priceField].$gte = filters.minPrice;
    if (filters.maxPrice) query[priceField].$lte = filters.maxPrice;
  }

  if (filters.bedrooms) query['characteristics.bedrooms'] = { $gte: filters.bedrooms };
  if (filters.bathrooms) query['characteristics.bathrooms'] = { $gte: filters.bathrooms };

  return this.find(query)
    .populate('owner', 'nombre apellido telefono email')
    .sort({ featured: -1, createdAt: -1 });
};

const Property = mongoose.model('Property', propertySchema);

export default Property;