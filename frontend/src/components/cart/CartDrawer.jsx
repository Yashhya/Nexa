import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { setCartOpen } from '../../store/slices/uiSlice';
import { removeFromCart, updateCartItem } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/helpers';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen } = useSelector(s => s.ui);
  const { cart, isLoading } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);

  const items = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  const discount = cart?.discount || 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + (subtotal > 0 ? shipping : 0);

  const handleCheckout = () => {
    dispatch(setCartOpen(false));
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setCartOpen(false))}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: 'linear-gradient(180deg, #0a0a15 0%, #050508 100%)', borderLeft: '1px solid rgba(168,85,247,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                  <ShoppingCart size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Your Cart</h2>
                  <p className="text-slate-400 text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button onClick={() => dispatch(setCartOpen(false))} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <ShoppingCart size={32} className="text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Your cart is empty</p>
                    <p className="text-slate-400 text-sm mt-1">Add some amazing products!</p>
                  </div>
                  <Link to="/shop" onClick={() => dispatch(setCartOpen(false))}>
                    <button className="btn-primary">Browse Products</button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="glass rounded-xl p-3 flex gap-3"
                  >
                    <Link to={`/product/${item.product?._id}`} onClick={() => dispatch(setCartOpen(false))}>
                      <img
                        src={item.product?.thumbnail || `https://placehold.co/80x80/1e1b4b/a855f7?text=${encodeURIComponent(item.product?.name || 'Product')}`}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-xl border border-white/5"
                        onError={(e) => e.target.src = `https://placehold.co/80x80/1e1b4b/a855f7?text=${encodeURIComponent(item.product?.name || 'Product')}`}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.product?.name}</p>
                      <p className="text-purple-400 text-sm font-bold mt-0.5">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-purple-500/30 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-purple-500/30 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                        >
                          <Plus size={12} />
                        </button>
                        <span className="text-slate-500 text-xs ml-auto">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all self-start"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="p-4 border-t border-purple-500/10 space-y-3">
                {discount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <Tag size={14} className="text-green-400" />
                    <span className="text-green-400 text-sm">Coupon applied! You save {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Discount</span><span className="text-green-400">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-base border-t border-purple-500/10 pt-2">
                    <span>Total</span><span className="gradient-text">{formatPrice(total)}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                <Link to="/cart" onClick={() => dispatch(setCartOpen(false))} className="block text-center text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
