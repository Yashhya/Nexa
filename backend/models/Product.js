const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [String],
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  thumbnail: { type: String, default: '' },
  model3d: { type: String, default: '' },
  stock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  specifications: { type: Map, of: String },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  isTrending: { type: Boolean, default: false },
  freeShipping: { type: Boolean, default: false },
  weight: { type: Number, default: 0 },
  sku: { type: String, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  if (this.originalPrice > 0 && this.price < this.originalPrice) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1, ratings: -1 });

module.exports = mongoose.model('Product', productSchema);
