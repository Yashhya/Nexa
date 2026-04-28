const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, categories });
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json({ success: true, category: cat });
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, category: cat });
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = router;
