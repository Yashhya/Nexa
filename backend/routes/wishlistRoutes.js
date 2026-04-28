const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/wishlist
router.get('/', protect, authorize('user'), async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price thumbnail ratings category brand discount');
  res.json({ success: true, wishlist: user.wishlist });
});

// POST /api/wishlist/toggle/:productId
router.post('/toggle/:productId', protect, authorize('user'), async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index = user.wishlist.indexOf(productId);
  let added = false;
  if (index === -1) { user.wishlist.push(productId); added = true; }
  else { user.wishlist.splice(index, 1); }
  await user.save();
  res.json({ success: true, added, message: added ? 'Added to wishlist' : 'Removed from wishlist' });
});

module.exports = router;
