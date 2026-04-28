import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const statusIcon = (status) => {
  if (status === 'delivered') return <CheckCircle size={16} className="text-green-400" />;
  if (status === 'cancelled') return <XCircle size={16} className="text-red-400" />;
  if (status === 'shipped' || status === 'out_for_delivery') return <Truck size={16} className="text-purple-400" />;
  return <Clock size={16} className="text-cyan-400" />;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data.orders || []);
      } catch { toast.error('Failed to load orders'); }
      finally { setIsLoading(false); }
    })();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen pt-28 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="shimmer rounded-2xl" style={{ height: '100px' }} />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <Helmet>
        <title>My Orders – NEXA</title>
        <meta name="description" content="Track and manage your orders on NEXA." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <Package className="text-purple-400" /> My Orders
          <span className="text-lg text-slate-400 font-normal">({orders.length})</span>
        </h1>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Package size={80} className="text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">No orders yet</h2>
            <p className="text-slate-400 mb-8">Start shopping to see your orders here.</p>
            <Link to="/shop"><button className="btn-primary">Start Shopping</button></Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const color = getOrderStatusColor(order.status);
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <Link to={`/orders/${order._id}`}>
                    <div className="glass rounded-2xl p-5 border border-purple-500/15 hover:border-purple-500/40 hover:glow-purple transition-all group">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={order.items?.[0]?.product?.thumbnail || `https://placehold.co/60x60/1e1b4b/a855f7?text=${encodeURIComponent(order.items?.[0]?.product?.name || 'Order')}`}
                              alt="Product" className="w-full h-full object-cover"
                              onError={e => e.target.src = `https://placehold.co/60x60/1e1b4b/a855f7?text=${encodeURIComponent(order.items?.[0]?.product?.name || 'Order')}`} />
                          </div>
                          <div>
                            <p className="text-white font-bold mb-0.5">Order #{order._id?.slice(-8).toUpperCase()}</p>
                            <p className="text-slate-500 text-xs mb-1.5">{formatDate(order.createdAt)} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                            <div className="flex items-center gap-1.5">
                              {statusIcon(order.orderStatus || order.status)}
                              <span className={`text-xs font-semibold text-${getOrderStatusColor(order.orderStatus || order.status)}-400`}>{getOrderStatusLabel(order.orderStatus || order.status)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-slate-400 text-xs mb-0.5">Total</p>
                            <p className="text-white font-bold text-lg">{formatPrice(order.totalAmount || order.total || order.totalPrice || 0)}</p>
                          </div>
                          <ChevronRight size={20} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
