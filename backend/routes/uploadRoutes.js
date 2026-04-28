const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/upload (Cloudinary upload)
router.post('/', protect, authorize('admin', 'seller'), async (req, res) => {
  try {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const { image } = req.body; // base64
    if (!image) return res.status(400).json({ success: false, message: 'No image provided' });
    const result = await cloudinary.uploader.upload(image, { folder: 'nexa', quality: 'auto', fetch_format: 'auto' });
    res.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
