const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// POST /api/orders/create-razorpay-order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890',
      key_secret: process.env.RAZORPAY_SECRET || 'secret123'
    });
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_order_" + Date.now()
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Razorpay Error', error });
  }
};

const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, coupon } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ success: false, message: 'Cart is empty' });

  // Verify stock
  for (const item of cart.items) {
    if (!item.product || item.product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${item.product?.name || 'a product'}` });
    }
  }

  const subtotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingCharge = subtotal > 999 ? 0 : 99;
  const discount = cart.discount || 0;
  const totalAmount = subtotal + shippingCharge - discount;

  const orderItems = cart.items.map(i => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.thumbnail,
    price: i.price,
    quantity: i.quantity
  }));

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    subtotal,
    shippingCharge,
    discount,
    totalAmount,
    coupon: cart.coupon || '',
    estimatedDelivery,
    trackingNumber: 'NEXA' + Date.now(),
    statusHistory: [{ status: 'placed', message: 'Order placed successfully' }]
  });

  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity, sold: item.quantity } });
  }

  // Update coupon usage
  if (cart.coupon) {
    await Coupon.findOneAndUpdate({ code: cart.coupon }, { $inc: { usedCount: 1 }, $push: { usedBy: req.user._id } });
  }

  // Clear cart
  cart.items = []; cart.totalPrice = 0; cart.totalItems = 0; cart.coupon = ''; cart.discount = 0;
  await cart.save();

  res.status(201).json({ success: true, order });
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product', 'name thumbnail');
  res.json({ success: true, orders });
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone').populate('items.product', 'name thumbnail price');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  res.json({ success: true, order });
};

// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Access denied' });
  if (!['placed', 'confirmed'].includes(order.orderStatus)) {
    return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
  }

  order.orderStatus = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', message: 'Order cancelled by customer' });
  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, sold: -item.quantity } });
  }
  await order.save();
  res.json({ success: true, order });
};

// Admin: GET /api/orders
const getAllOrders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, orders, total });
};

// Admin: PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { status, message } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.orderStatus = status;
  order.statusHistory.push({ status, message: message || `Order ${status}` });
  if (status === 'delivered') { order.deliveredAt = new Date(); order.paymentStatus = 'paid'; }
  await order.save();
  res.json({ success: true, order });
};

module.exports = { createRazorpayOrder, createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus };
