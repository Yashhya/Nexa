import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { MapPin, CreditCard, Smartphone, Building2, ChevronRight, Shield, Truck } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { clearCart } from '../store/slices/cartSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const [step, setStep] = useState(1);
  const [isPlacing, setIsPlacing] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = cart?.discount || 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.pincode) {
      return toast.error('Please fill all required shipping fields');
    }
    
    setIsPlacing(true);
    try {
      if (paymentMethod !== 'cod') {
        // Create Razorpay Order
        const rzpRes = await api.post('/orders/create-razorpay-order', { amount: total });
        
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
          amount: rzpRes.data.order.amount,
          currency: 'INR',
          name: 'NEXA',
          description: 'Payment for your order',
          order_id: rzpRes.data.order.id,
          handler: async function (response) {
            // Place final order after successful payment
            await submitFinalOrder({
              ...address,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: address.phone
          },
          theme: { color: '#7c3aed' },
          modal: {
             ondismiss: function() {
               setIsPlacing(false);
               toast.error('Payment cancelled');
             }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // COD
        await submitFinalOrder(address);
      }
    } catch (err) {
      setIsPlacing(false);
      toast.error(err.response?.data?.message || 'Payment initiation failed.');
    }
  };

  const submitFinalOrder = async (finalAddress) => {
    try {
      const res = await api.post('/orders', {
        shippingAddress: finalAddress,
        paymentMethod,
        couponCode: cart?.coupon,
      });
      await dispatch(clearCart());
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  const paymentOptions = [
    { val: 'cod', label: 'Cash on Delivery', icon: Truck, desc: 'Pay when your order arrives' },
    { val: 'upi', label: 'UPI Payment', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
    { val: 'card', label: 'Card Payment', icon: CreditCard, desc: 'Debit / Credit Card' },
    { val: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <Helmet>
        <title>Checkout – NEXA</title>
        <meta name="description" content="Complete your order on NEXA with secure checkout." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                step >= s ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white' : 'glass text-slate-500 border border-purple-500/20'}`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">{s}</span>
                {s === 1 ? 'Shipping' : 'Payment'}
              </div>
              {s < 2 && <ChevronRight size={16} className="text-slate-600" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><MapPin size={20} className="text-purple-400" /> Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', colSpan: true },
                    { key: 'phone', label: 'Phone Number', placeholder: '9876543210', colSpan: false },
                    { key: 'street', label: 'Street Address', placeholder: '123 Main St, Apt 4B', colSpan: true },
                    { key: 'city', label: 'City', placeholder: 'Mumbai', colSpan: false },
                    { key: 'state', label: 'State', placeholder: 'Maharashtra', colSpan: false },
                    { key: 'pincode', label: 'PIN Code', placeholder: '400001', colSpan: false },
                  ].map(f => (
                    <div key={f.key} className={f.colSpan ? 'sm:col-span-2' : ''}>
                      <label className="text-slate-300 text-sm font-medium block mb-1.5">{f.label}</label>
                      <input type="text" placeholder={f.placeholder} value={address[f.key]}
                        onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                        className="input-field" required />
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={() => {
                    if (!address.fullName || !address.phone || !address.street || !address.city || !address.pincode)
                      return toast.error('Please fill all required fields');
                    setStep(2);
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2">
                  Continue to Payment <ChevronRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><CreditCard size={20} className="text-purple-400" /> Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {paymentOptions.map(opt => (
                    <label key={opt.val} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === opt.val ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500/20 hover:border-purple-500/40'}`}>
                      <input type="radio" name="payment" value={opt.val} checked={paymentMethod === opt.val}
                        onChange={() => setPaymentMethod(opt.val)} className="sr-only" />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === opt.val ? 'bg-purple-500/30' : 'bg-white/5'}`}>
                        <opt.icon size={20} className={paymentMethod === opt.val ? 'text-purple-300' : 'text-slate-500'} />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{opt.label}</p>
                        <p className="text-slate-500 text-xs">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">← Back</button>
                  <motion.button onClick={handlePlaceOrder} disabled={isPlacing}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="btn-primary flex-2 flex-1 py-3 flex items-center justify-center gap-2">
                    {isPlacing
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Shield size={18} /> Place Order – {formatPrice(total)}</>}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-purple-500/20 h-fit">
            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item._id} className="flex gap-3 items-center">
                  <img src={item.product?.thumbnail || `https://placehold.co/60x60/1e1b4b/a855f7?text=${encodeURIComponent(item.product?.name || 'Product')}`}
                    className="w-14 h-14 object-cover rounded-lg"
                    onError={e => e.target.src = `https://placehold.co/60x60/1e1b4b/a855f7?text=${encodeURIComponent(item.product?.name || 'Product')}`} alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium line-clamp-1">{item.product?.name}</p>
                    <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-white text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-purple-500/20 pt-4 space-y-2">
              <div className="flex justify-between text-slate-400 text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-400 text-sm"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Shipping</span><span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-purple-500/20">
                <span>Total</span><span className="gradient-text">{formatPrice(total)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
