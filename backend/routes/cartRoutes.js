const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon } = require('../controllers/cartController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('user'));
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:itemId', updateCartItem);
router.delete('/remove/:itemId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/coupon', applyCoupon);

module.exports = router;
