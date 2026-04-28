const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  dailyRevenue: { type: Number, default: 0 },
  dailyOrders: { type: Number, default: 0 },
  newUsers: { type: Number, default: 0 },
  newSellers: { type: Number, default: 0 },
  topProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
