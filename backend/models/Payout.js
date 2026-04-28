const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  method: { type: String, enum: ['bank_transfer', 'upi', 'paypal'], default: 'bank_transfer' },
  referenceId: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
