import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { removeFromCart, updateCartItem, applyCoupon } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isLoading } = useSelector(s => s.cart);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = cart?.discount || 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleQty = (itemId, qty) => {
    if (qty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: qty }));
  };

  const handleRemove = async (itemId) => {
    await dispatch(removeFromCart(itemId));
    toast.success('Item removed');
  };

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      await dispatch(applyCoupon(couponCode)).unwrap();
      toast.success('Coupon applied! 🎉');
    } catch (err) {
      toast.error(err || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Helmet><title>Cart – NEXA</title></Helmet>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <ShoppingBag size={80} className="text-slate-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
          <p className="text-slate-400 mb-8">Add some amazing products to get started!</p>
          <Link to="/shop">
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary flex items-center gap-2 mx-auto">
              <ShoppingCart size={18} /> Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <Helmet>
        <title>Cart ({items.length}) – NEXA</title>
        <meta name="description" content="Review your cart and proceed to checkout on NEXA." />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <ShoppingCart className="text-purple-400" /> My Cart
          <span className="text-lg text-slate-400 font-normal">({items.length} items)</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-4 border border-purple-500/15 flex gap-4"
                >
                  <Link to={`/product/${item.product?._id}`}>
                    <img
                      src={item.product?.thumbnail || item.product?.images?.[0] || `https://placehold.co/100x100/1e1b4b/a855f7?text=${encodeURIComponent(item.product?.name || 'Product')}`}
                      alt={item.product?.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0"
                      onError={e => e.target.src = `https://placehold.co/100x100/1e1b4b/a855f7?text=${encodeURIComponent(item.product?.name || 'Product')}`}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product?._id}`}>
                      <h3 className="text-white font-semibold text-sm leading-snug hover:text-purple-300 transition-colors line-clamp-2 mb-1">
                        {item.product?.name}
                      </h3>
                    </Link>
                    <p className="text-slate-500 text-xs mb-3">{item.product?.brand || item.product?.category}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 glass-light rounded-lg p-1 border border-purple-500/20">
                        <button onClick={() => handleQty(item._id, item.quantity - 1)}
                          className="w-7 h-7 rounded-md hover:bg-purple-500/30 flex items-center justify-center text-white transition-colors">
                          <Minus size={13} />
                        </button>
                        <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => handleQty(item._id, item.quantity + 1)}
                          className="w-7 h-7 rounded-md hover:bg-purple-500/30 flex items-center justify-center text-white transition-colors">
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold">{formatPrice(item.price * item.quantity)}</span>
                        <button onClick={() => handleRemove(item._id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-purple-500/20 h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="text-slate-400 text-sm mb-2 block">Have a coupon?</label>
              <div className="flex gap-2">
                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="NEXA20" className="input-field text-sm py-2 flex-1" />
                <button onClick={handleCoupon} disabled={couponLoading}
                  className="btn-outline text-sm px-4 py-2 flex items-center gap-1 whitespace-nowrap">
                  <Tag size={14} /> Apply
                </button>
              </div>
              {cart?.coupon && (
                <p className="text-green-400 text-xs mt-2">✅ Coupon "{cart.coupon}" applied!</p>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-3 pb-4 border-b border-purple-500/20">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400 text-sm">
                  <span>Discount</span><span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="flex justify-between text-white font-bold text-lg mt-4 mb-6">
              <span>Total</span><span className="gradient-text">{formatPrice(total)}</span>
            </div>

            {shipping > 0 && (
              <p className="text-slate-500 text-xs mb-4 text-center">
                Add {formatPrice(999 - subtotal)} more for free shipping!
              </p>
            )}

            <motion.button onClick={() => navigate('/checkout')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              Proceed to Checkout <ArrowRight size={18} />
            </motion.button>

            <Link to="/shop">
              <button className="w-full mt-3 text-slate-400 hover:text-white text-sm text-center transition-colors py-2">
                Continue Shopping →
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
