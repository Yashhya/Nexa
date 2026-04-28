const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
  totalItems: { type: Number, default: 0 },
  coupon: { type: String, default: '' },
  discount: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.methods.calcTotals = function () {
  this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
