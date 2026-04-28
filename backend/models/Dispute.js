const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'investigating', 'resolved_buyer', 'resolved_seller', 'closed'], default: 'open' },
  adminNotes: { type: String },
  messages: [{
    sender: { type: String, enum: ['user', 'seller', 'admin'] },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
