const express = require('express');
const router = express.Router();
const { getProducts, getFeatured, getTrending, getProduct, getProductBySlug, createProduct, updateProduct, deleteProduct, addReview, getRelated } = require('../controllers/productController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/trending', getTrending);
router.get('/related/:category', getRelated);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin', 'seller'), createProduct);
router.put('/:id', protect, authorize('admin', 'seller'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'seller'), deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
