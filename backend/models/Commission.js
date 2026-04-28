const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  orderTotal: { type: Number, required: true },
  commissionRate: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  sellerEarnings: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'cleared', 'refunded'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Commission', commissionSchema);
