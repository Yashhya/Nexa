const express = require('express');
const router = express.Router();
const { aiChat, getRecommendations } = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/chat', optionalAuth, aiChat);
router.get('/recommendations', optionalAuth, getRecommendations);

module.exports = router;
