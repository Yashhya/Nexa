import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Package, Heart, Gift, ArrowRight, Sparkles, Star, Clock, CheckCircle } from 'lucide-react';
import { fetchFeatured } from '../../store/slices/productSlice';
import ProductCard from '../../components/products/ProductCard';

const RECENT_ORDERS = [
  { id: '#NEX-1024', name: 'Sony WH-1000XM5', status: 'delivered', date: 'Apr 24', amount: 24990, img: 'https://placehold.co/60x60/1e1b4b/a855f7?text=Sony' },
  { id: '#NEX-1019', name: 'Leather Biker Jacket', status: 'shipped', date: 'Apr 21', amount: 8999, img: 'https://placehold.co/60x60/1e1b4b/a855f7?text=Jacket' },
  { id: '#NEX-1011', name: 'Air Jordan 1 Retro', status: 'delivered', date: 'Apr 15', amount: 12499, img: 'https://placehold.co/60x60/1e1b4b/a855f7?text=Jordan' },
];

const statusColors = {
  delivered: 'bg-green-500/10 text-green-400',
  shipped: 'bg-blue-500/10 text-blue-400',
  processing: 'bg-yellow-500/10 text-yellow-400',
  placed: 'bg-slate-500/10 text-slate-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

export default function UserDashboard() {
  const { user } = useSelector(s => s.auth);
  const { featured, isLoading } = useSelector(s => s.products);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(fetchFeatured()); }, [dispatch]);

  return (
    <div className="space-y-8">
      <Helmet><title>My Account – NEXA</title></Helmet>

      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-7"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(6,182,212,0.15) 100%)', border: '1px solid rgba(168,85,247,0.2)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/10" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#a855f7] uppercase tracking-widest flex items-center gap-1 mb-2">
              <Sparkles size={10} /> Member since {new Date(user?.createdAt).getFullYear() || '2024'}
            </span>
            <h1 className="text-white text-2xl sm:text-3xl font-black">Welcome, {user?.name?.split(' ')[0] || 'Shopper'} 👋</h1>
            <p className="text-slate-400 mt-1">You have <span className="text-[#a855f7] font-bold">3 new</span> recommendations and <span className="text-[#06b6d4] font-bold">1 pending order</span>.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/shop" className="flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg">
              Browse Shop <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Orders', value: 14, icon: Package, color: 'text-[#a855f7]', bg: 'bg-[#7c3aed]/10', to: '/account/orders' },
          { label: 'Wishlist', value: 8, icon: Heart, color: 'text-[#ec4899]', bg: 'bg-[#ec4899]/10', to: '/account/wishlist' },
          { label: 'Rewards', value: '420 pts', icon: Gift, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10', to: '/account/rewards' },
          { label: 'Reviews', value: 5, icon: Star, color: 'text-[#10b981]', bg: 'bg-[#10b981]/10', to: '/account/reviews' },
        ].map(({ label, value, icon: Icon, color, bg, to }) => (
          <Link key={label} to={to}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-[#0d0d17]/80 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <p className="text-white text-xl font-black">{value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0d0d17]/80 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold flex items-center gap-2"><Clock size={16} className="text-[#a855f7]" /> Recent Orders</h2>
          <Link to="/account/orders" className="text-[#a855f7] text-xs hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-3">
          {RECENT_ORDERS.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`}>
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                <img src={order.img} alt={order.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{order.name}</p>
                  <p className="text-slate-500 text-xs">{order.id} · {order.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white text-sm font-bold">₹{order.amount.toLocaleString()}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Products */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold flex items-center gap-2"><Sparkles size={16} className="text-[#a855f7]" /> Recommended for You</h2>
          <Link to="/shop" className="text-[#a855f7] text-xs hover:underline flex items-center gap-1">
            See all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array(4).fill(0).map((_, i) => <div key={i} className="h-64 rounded-2xl bg-[#0d0d17] animate-pulse" />)
            : featured.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
          }
        </div>
      </div>
    </div>
  );
}
