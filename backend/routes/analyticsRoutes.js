const express = require('express');
const router = express.Router();

// Stub routes for analytics and reviews
router.get('/', (req, res) => res.json({ success: true, data: {} }));

module.exports = router;
