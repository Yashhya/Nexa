import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, ArrowLeft, MapPin, CreditCard, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch { toast.error('Failed to load order'); navigate('/orders'); }
      finally { setIsLoading(false); }
    })();
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      setOrder(res.data.order);
      toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
    finally { setCancelling(false); }
  };

  if (isLoading) return (
    <div className="min-h-screen pt-28 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {Array(3).fill(0).map((_, i) => <div key={i} className="shimmer rounded-2xl" style={{ height: '120px' }} />)}
      </div>
    </div>
  );
  if (!order) return null;

  const color = getOrderStatusColor(order.orderStatus || order.status);
  const stepIdx = STEPS.indexOf(order.orderStatus || order.status);
  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus || order.status);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <Helmet><title>Order #{id?.slice(-8).toUpperCase()} – NEXA</title></Helmet>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> My Orders
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Order #{id?.slice(-8).toUpperCase()}</h1>
            <p className="text-slate-400 text-sm mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge text-${color}-400 bg-${color}-500/10 border-${color}-500/30 text-sm px-3 py-1.5`}>
              {getOrderStatusLabel(order.orderStatus || order.status)}
            </span>
            {canCancel && (
              <button onClick={handleCancel} disabled={cancelling}
                className="text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1">
                {cancelling ? <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <XCircle size={14} />}
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Progress tracker */}
        {order.orderStatus !== 'cancelled' && (
          <div className="glass rounded-2xl p-6 border border-purple-500/15 mb-6">
            <h2 className="text-white font-bold mb-5 flex items-center gap-2"><Truck size={18} className="text-purple-400" /> Order Tracking</h2>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {STEPS.slice(0, -1).map((step, i) => {
                const done = i < stepIdx;
                const active = i === stepIdx;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex flex-col items-center flex-shrink-0 ${i === STEPS.length - 2 ? '' : 'flex-1'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-green-500 border-green-500' : active ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700 bg-slate-800'}`}>
                        {done ? <CheckCircle size={16} className="text-white" /> : <Clock size={12} className={active ? 'text-purple-400' : 'text-slate-600'} />}
                      </div>
                      <p className={`text-xs mt-1.5 whitespace-nowrap ${done ? 'text-green-400' : active ? 'text-purple-400 font-semibold' : 'text-slate-600'}`}>
                        {getOrderStatusLabel(step)}
                      </p>
                    </div>
                    {i < STEPS.length - 2 && (
                      <div className={`h-0.5 flex-1 transition-all ${done ? 'bg-green-500' : 'bg-slate-700'}`} style={{ minWidth: '20px' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-5 border border-purple-500/15">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Package size={18} className="text-purple-400" /> Items ({order.items?.length})</h2>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center py-3 border-b border-purple-500/10 last:border-0">
                    <img src={item.product?.thumbnail || `https://placehold.co/80x80/1e1b4b/a855f7?text=${encodeURIComponent(item.product?.name || 'Product')}`}
                      alt={item.product?.name} className="w-16 h-16 rounded-xl object-cover shrink-0"
                      onError={e => e.target.src = `https://placehold.co/80x80/1e1b4b/a855f7?text=${encodeURIComponent(item.product?.name || 'Product')}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm line-clamp-1">{item.product?.name}</p>
                      <p className="text-slate-500 text-xs">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <p className="text-white font-bold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="glass rounded-2xl p-5 border border-purple-500/15">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><MapPin size={18} className="text-cyan-400" /> Shipping Address</h2>
              <div className="text-slate-400 text-sm space-y-1">
                <p className="text-white font-medium">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
                <p>📞 {order.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass rounded-2xl p-5 border border-purple-500/15 h-fit">
            <h2 className="text-white font-bold mb-4">Payment Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>{formatPrice(order.subtotal || 0)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between text-slate-400"><span>Shipping</span><span className={(order.shippingCharge || order.shippingCost) === 0 ? 'text-green-400' : ''}>{(order.shippingCharge || order.shippingCost) === 0 ? 'FREE' : formatPrice(order.shippingCharge || order.shippingCost || 99)}</span></div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-purple-500/20">
                <span>Total</span><span className="gradient-text">{formatPrice(order.totalAmount || order.total || order.totalPrice || 0)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center gap-2 text-slate-400 text-sm">
              <CreditCard size={14} />
              <span className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'COD'}</span>
              {order.isPaid && <span className="ml-auto badge badge-green text-xs">Paid</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
