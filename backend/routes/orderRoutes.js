const express = require('express');
const router = express.Router();
const { createRazorpayOrder, createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('user'));
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
