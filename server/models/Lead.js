const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // Facebook Lead Data
  leadId: {
    type: String,
    required: true,
    unique: true
  },
  formId: {
    type: String,
    required: true
  },
  formName: String,
  
  // Customer Information
  customerName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  
  // Additional Fields (dynamic)
  customFields: {
    type: Map,
    of: String
  },
  
  // Status Management
  status: {
    type: String,
    enum: ['yangi', 'korildi', 'jarayonda', 'yetkazildi', 'bekor', 'rad_etildi'],
    default: 'yangi'
  },
  
  // Integration Status
  sentToExternalAPI: {
    type: Boolean,
    default: false
  },
  externalAPIResponse: {
    success: Boolean,
    message: String,
    timestamp: Date
  },
  
  // Metadata
  source: {
    type: String,
    default: 'facebook_lead_ads'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ leadId: 1 });

module.exports = mongoose.model('Lead', leadSchema);
