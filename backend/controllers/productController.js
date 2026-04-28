const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  const { keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12, brand, freeShipping } = req.query;
  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (freeShipping === 'true') query.freeShipping = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.ratings = { $gte: Number(rating) };

  let sortOpts = { createdAt: -1 };
  if (sort === 'price_asc') sortOpts = { price: 1 };
  else if (sort === 'price_desc') sortOpts = { price: -1 };
  else if (sort === 'rating') sortOpts = { ratings: -1 };
  else if (sort === 'popular') sortOpts = { sold: -1 };
  else if (sort === 'newest') sortOpts = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortOpts).skip(skip).limit(Number(limit)).select('-reviews');

  res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// GET /api/products/featured
const getFeatured = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8).select('-reviews');
  res.json({ success: true, products });
};

// GET /api/products/trending
const getTrending = async (req, res) => {
  const products = await Product.find({ isTrending: true, isActive: true }).limit(10).select('-reviews');
  res.json({ success: true, products });
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

// GET /api/products/slug/:slug
const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

// POST /api/products (admin)
const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

// DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  product.isActive = false;
  await product.save();
  res.json({ success: true, message: 'Product removed' });
};

// POST /api/products/:id/reviews
const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Product already reviewed' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
};

// GET /api/products/related/:category
const getRelated = async (req, res) => {
  const products = await Product.find({ category: req.params.category, isActive: true, _id: { $ne: req.query.exclude } }).limit(6).select('-reviews');
  res.json({ success: true, products });
};

module.exports = { getProducts, getFeatured, getTrending, getProduct, getProductBySlug, createProduct, updateProduct, deleteProduct, addReview, getRelated };
