const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// POST /api/payments/order
const createPaymentOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  try {
    const razorpay = getRazorpay();
    const paymentOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100), // paise
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      notes: { orderId: orderId.toString(), userId: req.user._id.toString() }
    });
    order.razorpayOrderId = paymentOrder.id;
    await order.save();
    res.json({ success: true, razorpayOrder: paymentOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment gateway error: ' + err.message });
  }
};

// POST /api/payments/verify
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(sign).digest('hex');

  if (expectedSign !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.paymentStatus = 'paid';
  order.paymentId = razorpay_payment_id;
  order.orderStatus = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', message: 'Payment received' });
  await order.save();

  res.json({ success: true, message: 'Payment verified', order });
};

module.exports = { createPaymentOrder, verifyPayment };
