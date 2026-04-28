import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setItems(res.data.wishlist?.products || []);
    } catch { toast.error('Failed to load wishlist'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId) => {
    try {
      await api.post(`/wishlist/toggle/${productId}`);
      setItems(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  const handleMoveToCart = async (product) => {
    try {
      await dispatch(addToCart({ productId: product._id })).unwrap();
      await handleRemove(product._id);
      toast.success('Moved to cart! 🛒');
    } catch { toast.error('Failed to move to cart'); }
  };

  if (isLoading) return (
    <div className="min-h-screen pt-28 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => <div key={i} className="shimmer rounded-2xl" style={{ height: '280px' }} />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <Helmet>
        <title>Wishlist – NEXA</title>
        <meta name="description" content="Your saved products on NEXA." />
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <Heart className="text-pink-400 fill-pink-400" /> My Wishlist
          <span className="text-lg text-slate-400 font-normal">({items.length} items)</span>
        </h1>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Heart size={80} className="text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">Your wishlist is empty</h2>
            <p className="text-slate-400 mb-8">Save your favourite products and shop later!</p>
            <Link to="/shop"><button className="btn-primary">Browse Products</button></Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product, i) => (
              <motion.div key={product._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl overflow-hidden border border-purple-500/15 group hover:border-purple-500/40 transition-all">
                <Link to={`/product/${product._id}`}>
                  <div className="relative overflow-hidden" style={{ height: '180px' }}>
                    <img src={product.thumbnail || product.images?.[0] || `https://placehold.co/300x200/1e1b4b/a855f7?text=${encodeURIComponent(product.name)}`}
                      alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => e.target.src = `https://placehold.co/300x200/1e1b4b/a855f7?text=${encodeURIComponent(product.name)}`} />
                  </div>
                  <div className="p-3">
                    <p className="text-slate-500 text-xs mb-1">{product.brand || product.category}</p>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">{product.name}</h3>
                    <p className="text-white font-bold">{formatPrice(product.price)}</p>
                  </div>
                </Link>
                <div className="px-3 pb-3 flex gap-2">
                  <button onClick={() => handleMoveToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 hover:border-transparent text-xs font-semibold transition-all">
                    <ShoppingCart size={13} /> Move to Cart
                  </button>
                  <button onClick={() => handleRemove(product._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
