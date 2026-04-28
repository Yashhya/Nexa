const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeName: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'blocked'], default: 'pending' },
  metrics: {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
  },
  commissionRate: { type: Number, default: 10 } // Admin takes 10% by default
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
