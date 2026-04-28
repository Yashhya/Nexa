const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, default: '' },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  applicableCategories: [String],
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
