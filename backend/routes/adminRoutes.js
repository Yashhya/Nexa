const express = require('express');
const router = express.Router();
const { getDashboard, getUsers, toggleUser, deleteUser, getSellers, updateSellerStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUser);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/sellers', getSellers);
router.put('/sellers/:id/status', updateSellerStatus);

module.exports = router;
