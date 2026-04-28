import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, ShoppingBag, Home } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate(`/orders/${id}`), 8000);
    return () => clearTimeout(t);
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <Helmet>
        <title>Order Confirmed! – NEXA</title>
      </Helmet>

      {/* 3D stars bg */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={2000} factor={4} fade speed={0.5} />
        </Canvas>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: 'spring' }}
        className="relative z-10 text-center max-w-md mx-auto">
        {/* Success Icon */}
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} className="text-green-400" />
        </motion.div>

        <h1 className="text-4xl font-black text-white mb-3">Order Confirmed! 🎉</h1>
        <p className="text-slate-400 text-lg mb-2">Your order has been placed successfully.</p>
        <p className="text-slate-500 text-sm mb-8">Order ID: <span className="text-purple-400 font-mono">#{id?.slice(-8).toUpperCase()}</span></p>

        <div className="glass rounded-2xl p-6 border border-green-500/20 mb-8 text-left">
          {[
            { step: '1', label: 'Order Confirmed', desc: 'We\'ve received your order', done: true },
            { step: '2', label: 'Processing', desc: 'Packing your items', done: false },
            { step: '3', label: 'Shipped', desc: 'On the way to you', done: false },
            { step: '4', label: 'Delivered', desc: 'Enjoy your purchase!', done: false },
          ].map((s, i) => (
            <div key={i} className={`flex items-start gap-3 ${i < 3 ? 'mb-4' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${s.done ? 'bg-green-500 text-white' : 'bg-purple-500/20 border border-purple-500/30 text-purple-400'}`}>
                {s.done ? '✓' : s.step}
              </div>
              <div>
                <p className={`font-semibold text-sm ${s.done ? 'text-white' : 'text-slate-400'}`}>{s.label}</p>
                <p className="text-slate-500 text-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-slate-500 text-xs mb-6">Redirecting to order details in 8s...</p>

        <div className="flex gap-3 justify-center">
          <Link to={`/orders/${id}`}>
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary flex items-center gap-2">
              <Package size={16} /> Track Order
            </motion.button>
          </Link>
          <Link to="/shop">
            <button className="btn-outline flex items-center gap-2">
              <ShoppingBag size={16} /> Continue Shopping
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
