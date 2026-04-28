const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin', 'seller'], default: 'user' },
  sellerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
