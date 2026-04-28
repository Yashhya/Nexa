const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updateProfile, changePassword, addAddress, deleteAddress } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);

module.exports = router;
