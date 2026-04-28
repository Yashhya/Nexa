const express = require('express');
const router = express.Router();
const { applySeller, getSellerDashboard } = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public or User routes
router.post('/apply', protect, applySeller);

// Seller protected routes
router.use(protect, authorize('seller'));
router.get('/dashboard', getSellerDashboard);

module.exports = router;
