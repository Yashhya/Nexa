const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// GET /api/cart
const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price thumbnail stock isActive');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  // Filter out inactive products
  cart.items = cart.items.filter(i => i.product && i.product.isActive);
  res.json({ success: true, cart });
};

// POST /api/cart/add
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Product not found' });
  if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existingItem = cart.items.find(i => i.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
    existingItem.price = product.price;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }
  cart.calcTotals();
  await cart.save();
  await cart.populate('items.product', 'name price thumbnail stock');
  res.json({ success: true, cart });
};

// PUT /api/cart/update/:itemId
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  const product = await Product.findById(item.product);
  if (quantity > product.stock) return res.status(400).json({ success: false, message: 'Insufficient stock' });
  if (quantity <= 0) {
    cart.items.pull(req.params.itemId);
  } else {
    item.quantity = quantity;
  }
  cart.calcTotals();
  await cart.save();
  await cart.populate('items.product', 'name price thumbnail stock');
  res.json({ success: true, cart });
};

// DELETE /api/cart/remove/:itemId
const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  cart.items.pull(req.params.itemId);
  cart.calcTotals();
  await cart.save();
  res.json({ success: true, cart });
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) { cart.items = []; cart.totalPrice = 0; cart.totalItems = 0; cart.coupon = ''; cart.discount = 0; await cart.save(); }
  res.json({ success: true, message: 'Cart cleared' });
};

// POST /api/cart/coupon
const applyCoupon = async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  if (new Date() > coupon.validUntil) return res.status(400).json({ success: false, message: 'Coupon expired' });
  if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  if (coupon.usedBy.includes(req.user._id)) return res.status(400).json({ success: false, message: 'Coupon already used' });

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart is empty' });
  if (cart.totalPrice < coupon.minOrderAmount) return res.status(400).json({ success: false, message: `Minimum order ₹${coupon.minOrderAmount} required` });

  let discount = coupon.discountType === 'percentage'
    ? (cart.totalPrice * coupon.discountValue) / 100
    : coupon.discountValue;
  if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.round(discount);

  cart.coupon = coupon.code;
  cart.discount = discount;
  await cart.save();

  res.json({ success: true, discount, coupon: { code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue } });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon };
