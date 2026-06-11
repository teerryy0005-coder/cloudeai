const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['facebook', 'snayper', 'fraink', 'custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
    default: 'inactive'
  },
  config: {
    apiKey: String,
    apiSecret: String,
    webhookUrl: String,
    accessToken: String,
    additionalSettings: Map
  },
  statistics: {
    totalLeads: { type: Number, default: 0 },
    successfulLeads: { type: Number, default: 0 },
    failedLeads: { type: Number, default: 0 },
    lastSync: Date
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

module.exports = mongoose.model('Integration', integrationSchema);
