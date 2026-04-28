const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.applySeller = async (req, res) => {
  try {
    const { storeName, description, businessAddress, bankDetails } = req.body;
    let seller = await Seller.findOne({ user: req.user._id });
    if (seller) return res.status(400).json({ success: false, message: 'Already applied' });

    seller = await Seller.create({
      user: req.user._id,
      storeName,
      description,
      businessAddress,
      bankDetails
    });
    
    res.status(201).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSellerDashboard = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) return res.status(404).json({ success: false, message: 'Seller profile not found' });
    
    // Quick stats
    const totalProducts = await Product.countDocuments({ seller: seller._id });
    const orders = await Order.find({ seller: seller._id });
    
    const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'processing').length;

    res.json({
      success: true,
      stats: {
        totalSales: revenue,
        totalOrders: orders.length,
        totalProducts,
        pendingOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
