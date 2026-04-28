const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: String, enum: ['super', 'moderator', 'finance'], default: 'moderator' },
  permissions: {
    manageUsers: { type: Boolean, default: false },
    manageSellers: { type: Boolean, default: false },
    manageProducts: { type: Boolean, default: false },
    manageFinances: { type: Boolean, default: false },
    manageSettings: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
