const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, orders, revenueData] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.find({ paymentStatus: 'paid' }).select('totalAmount createdAt'),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ])
  ]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const todayRevenue = orders.filter(o => {
    const d = new Date(o.createdAt); const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).reduce((acc, o) => acc + o.totalAmount, 0);

  const lowStock = await Product.find({ stock: { $lt: 10 }, isActive: true }).select('name stock category');
  const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10);
  const categoryData = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 }, totalSold: { $sum: '$sold' } } }
  ]);

  res.json({
    success: true,
    stats: { totalUsers, totalProducts, totalOrders, totalRevenue: Math.round(totalRevenue), todayRevenue: Math.round(todayRevenue) },
    revenueData: revenueData.reverse(),
    lowStock,
    recentOrders,
    categoryData
  });
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = search ? { $or: [{ name: /search/i }, { email: /search/i }] } : {};
  const total = await User.countDocuments(query);
  const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.json({ success: true, users, total });
};

// PUT /api/admin/users/:id/toggle
const toggleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, user });
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
};

// GET /api/admin/sellers
const getSellers = async (req, res) => {
  try {
    const sellers = await require('../models/Seller').find().populate('user', 'name email');
    res.json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/sellers/:id/status
const updateSellerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const seller = await require('../models/Seller').findById(req.params.id);
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    
    seller.status = status;
    await seller.save();
    
    if (status === 'approved') {
       await User.findByIdAndUpdate(seller.user, { role: 'seller' });
    } else if (status === 'blocked' || status === 'rejected') {
       await User.findByIdAndUpdate(seller.user, { role: 'user' });
    }
    
    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getUsers, toggleUser, deleteUser, getSellers, updateSellerStatus };
