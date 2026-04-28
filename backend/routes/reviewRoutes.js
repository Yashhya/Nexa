const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// GET /api/reviews - admin get unapproved reviews
router.get('/', protect, authorize('admin'), async (req, res) => {
  const products = await Product.find({ 'reviews.0': { $exists: true } }).select('name reviews').populate('reviews.user', 'name');
  const allReviews = products.flatMap(p => p.reviews.map(r => ({ ...r.toObject(), productName: p.name, productId: p._id })));
  res.json({ success: true, reviews: allReviews });
});

// PUT /api/reviews/:productId/:reviewId/approve
router.put('/:productId/:reviewId/approve', protect, authorize('admin'), async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const review = product.reviews.id(req.params.reviewId);
  if (review) { review.isApproved = true; await product.save(); }
  res.json({ success: true, message: 'Review approved' });
});

module.exports = router;
