const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('user'));
router.post('/order', createPaymentOrder);
router.post('/verify', verifyPayment);

module.exports = router;
