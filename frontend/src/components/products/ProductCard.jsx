import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Zap, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const { isLoading } = useSelector(s => s.cart);

  const discount = product.discount || getDiscountPercent(product.price, product.originalPrice);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return; }
    try {
      await dispatch(addToCart({ productId: product._id })).unwrap();
      toast.success(`${product.name.substring(0, 20)}... added to cart!`);
    } catch (err) {
      toast.error(err || 'Failed to add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    try {
      const res = await api.post(`/wishlist/toggle/${product._id}`);
      setIsWishlisted(res.data.added);
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.ratings || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden group flex flex-col h-full hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-300"
    >
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Image Container - Fixed Ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
          <img
            src={imgError ? `https://placehold.co/400x300/1e1b4b/a855f7?text=${encodeURIComponent(product?.name || 'Product')}` : (product.thumbnail || product.images?.[0] || `https://placehold.co/400x300/1e1b4b/a855f7?text=${encodeURIComponent(product?.name || 'Product')}`)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">{discount}% OFF</span>}
            {product.isTrending && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">🔥 HOT</span>}
          </div>

          {/* Quick action overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-x-4 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-lg ${isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-pink-500 hover:text-white'}`}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-cyan-500 hover:text-white transition-all shadow-lg"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Content Container - Flex Grow to push button to bottom */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{product.brand || product.category}</p>
            {/* Rating */}
            <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-semibold">{product.ratings || '4.5'}</span>
            </div>
          </div>
          
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-purple-400 transition-colors mb-3">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-auto pt-2 flex items-end gap-2 mb-4">
            <span className="text-white font-black text-xl tracking-tight">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-slate-500 text-sm line-through mb-0.5 font-medium">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
            bg-white/5 border border-white/10 text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 hover:border-transparent hover:shadow-lg hover:shadow-purple-500/25
            disabled:opacity-50 disabled:cursor-not-allowed z-10 relative"
          >
            {product.stock === 0 ? 'Out of Stock' : (<><ShoppingCart size={16} /> Add to Cart</>)}
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
