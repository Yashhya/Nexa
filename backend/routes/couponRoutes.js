const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, coupon });
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = router;
