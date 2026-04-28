import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  Star, ShoppingCart, Heart, Truck, Shield, RefreshCw, Minus, Plus,
  ChevronRight, CheckCircle2, Flame, Award,
  Box, ShieldCheck, ShoppingBag, MessageSquare, Zap, CreditCard
} from 'lucide-react';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice, getDiscountPercent } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { validMockProducts } from '../utils/mockData';
import ModelViewer, { SpinViewer } from '../components/common/ModelViewer';

const TABS = ['description', 'specifications', 'reviews', 'shipping'];

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, isLoading } = useSelector(s => s.products);
  const { isAuthenticated } = useSelector(s => s.auth);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [viewMode, setViewMode] = useState('image');

  useEffect(() => { dispatch(fetchProduct(id)); window.scrollTo(0, 0); }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/login'); return; }
    try { await dispatch(addToCart({ productId: id, quantity: qty })).unwrap(); toast.success('Added to cart! 🛒'); }
    catch (err) { toast.error(err || 'Failed'); }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/login'); return; }
    try { await dispatch(addToCart({ productId: id, quantity: qty })).unwrap(); navigate('/checkout'); }
    catch (err) { toast.error(err || 'Failed'); }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    try { const r = await api.post(`/wishlist/toggle/${id}`); setWishlisted(r.data.added); toast.success(r.data.message); }
    catch { toast.error('Failed to update wishlist'); }
  };

  if (isLoading) return (
    <div className="min-h-screen pt-24 px-4 bg-[#050508]">
      <div className="container grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 shimmer rounded-2xl" style={{ height: 450 }} />
        <div className="lg:col-span-5 space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="shimmer rounded-xl" style={{ height: 40 }} />)}</div>
        <div className="lg:col-span-3 space-y-4"><div className="shimmer rounded-2xl" style={{ height: 200 }} /><div className="shimmer rounded-2xl" style={{ height: 150 }} /></div>
      </div>
    </div>
  );

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.thumbnail || `https://placehold.co/800x600/1e1b4b/a855f7?text=${encodeURIComponent(product.name)}`];
  const discount = product.discount || getDiscountPercent(product.price, product.originalPrice);
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.ratings || 4.5));
  const specs = product.specifications instanceof Map ? Object.fromEntries(product.specifications) : (product.specifications || {});
  const suggestedProducts = validMockProducts.filter(p => p._id !== id && p.category === product.category).slice(0, 5);

  const viewTabs = [
    { id: 'image', label: '📷 Images' },
    { id: '3d', label: '🔲 3D / 360°' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#050508] text-white">
      <Helmet>
        <title>{product.name} – NEXA</title>
        <meta name="description" content={product.description?.substring(0, 155)} />
      </Helmet>

      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/shop?category=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-slate-300 truncate">{product.name}</span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

          {/* LEFT: Media viewer */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* View mode tabs */}
            <div className="flex bg-[#0d0d17] p-1 rounded-xl border border-white/5 w-fit gap-1">
              {viewTabs.map(t => (
                <button key={t.id} onClick={() => setViewMode(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === t.id ? 'bg-[#a855f7] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Media area */}
            <div className="flex-1" style={{ minHeight: 380 }}>
              {viewMode === 'image' && (
                <>
                  <div className="relative rounded-2xl overflow-hidden bg-[#0d0d17] border border-white/5 aspect-[4/5] group shadow-[0_0_40px_rgba(168,85,247,0.05)]">
                    <img src={images[activeImg]} alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => { e.target.src = `https://placehold.co/800x600/1e1b4b/a855f7?text=${encodeURIComponent(product.name)}`; }} />
                    {discount > 0 && <div className="absolute top-4 left-4 bg-[#a855f7] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">-{discount}% OFF</div>}
                    {product.isTrending && <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"><Flame size={11} />Trending</div>}
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
                      {images.map((img, i) => (
                        <button key={i} onClick={() => setActiveImg(i)}
                          className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#a855f7]' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                          <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = `https://placehold.co/100x100/1e1b4b/a855f7?text=IMG`; }} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {viewMode === '3d' && (
                <div style={{ height: 420 }}>
                  <ModelViewer url={product.model3d} fallbackImage={images[0]} productName={product.name} />
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE: Product details */}
          <div className="lg:col-span-5 flex flex-col bg-[#050508]/40 border border-white/5 rounded-2xl p-6">
            <p className="text-[#a855f7] text-xs font-bold uppercase tracking-widest mb-2">{product.brand || 'NEXA'}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">{stars.map((f, i) => <Star key={i} size={14} className={f ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-slate-600'} />)}</div>
              <span className="text-slate-400 text-sm">{(product.ratings || 4.5).toFixed(1)} ({product.numReviews || 312} reviews)</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 text-sm">{product.sold || 0} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-[#a855f7]">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && <span className="text-slate-500 text-lg line-through">{formatPrice(product.originalPrice)}</span>}
              {discount > 0 && <span className="bg-[#a855f7]/20 text-[#c084fc] text-xs font-bold px-2 py-1 rounded">{discount}% OFF</span>}
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-5">{product.description}</p>

            {/* Short description bullets */}
            {product.shortDescription && (
              <ul className="space-y-1.5 mb-5">
                {product.shortDescription.split('·').map((b, i) => b.trim() && (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <ShieldCheck size={13} className="text-[#a855f7] shrink-0" />
                    <span>{b.trim()}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0
                ? <span className="bg-[#064e3b]/40 text-[#34d399] text-xs font-bold px-2.5 py-1.5 rounded-md inline-flex items-center gap-1"><CheckCircle2 size={12} />In Stock ({product.stock} units) · Ships within 24 hrs</span>
                : <span className="bg-red-900/40 text-red-400 text-xs font-bold px-2.5 py-1.5 rounded-md">Out of Stock</span>}
            </div>

            {/* Qty + Cart + Wishlist */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center bg-[#0d0d17] border border-white/10 rounded-lg p-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"><Minus size={14} /></button>
                <span className="text-white font-bold text-sm w-8 text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"><Plus size={14} /></button>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 bg-[#0d0d17] border border-[#a855f7]/40 hover:border-[#a855f7] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                <ShoppingCart size={16} />Add to Cart
              </button>
              <button onClick={handleWishlist}
                className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all bg-[#0d0d17] ${wishlisted ? 'border-[#ec4899] text-[#ec4899]' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Buy Now */}
            <button onClick={handleBuyNow} disabled={product.stock === 0}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:from-[#4f46e5] hover:to-[#9333ea] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(168,85,247,0.35)] disabled:opacity-50 mb-6">
              <Zap size={16} />Buy Now
            </button>

            {/* Trust perks */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
              {[
                { icon: Truck, label: 'Fast Delivery', sub: '2-3 Days', color: '#a855f7' },
                { icon: ShieldCheck, label: 'Secure Pay', sub: '100% Safe', color: '#10b981' },
                { icon: RefreshCw, label: '7-Day Return', sub: 'Easy Policy', color: '#a855f7' },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={18} style={{ color }} />
                  <div><p className="text-white text-xs font-semibold">{label}</p><p className="text-slate-500 text-[10px]">{sub}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Product highlights */}
            <div className="bg-[#0f172a]/60 border border-[#1e293b] rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><Award size={15} className="text-[#a855f7]" />Product Highlights</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2"><Box size={13} className="text-slate-500 mt-0.5 shrink-0" /><span><strong className="text-slate-400 font-medium">Brand:</strong> {product.brand || 'NEXA'}</span></li>
                <li className="flex items-start gap-2"><Box size={13} className="text-slate-500 mt-0.5 shrink-0" /><span><strong className="text-slate-400 font-medium">Category:</strong> {product.category}</span></li>
                {product.freeShipping && <li className="flex items-start gap-2"><Truck size={13} className="text-green-500 mt-0.5 shrink-0" /><span className="text-green-400">Free Shipping</span></li>}
                {Object.entries(specs).slice(0, 4).map(([k, v]) => (
                  <li key={k} className="flex items-start gap-2"><Box size={13} className="text-[#a855f7] mt-0.5 shrink-0" /><span><strong className="text-slate-400 font-medium">{k}:</strong> {v}</span></li>
                ))}
                <li className="flex items-start gap-2"><Box size={13} className="text-slate-500 mt-0.5 shrink-0" /><span><strong className="text-slate-400 font-medium">Stock:</strong> {product.stock} units</span></li>
              </ul>
            </div>

            {/* Payment */}
            <div className="bg-[#0f172a]/60 border border-[#1e293b] rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2"><CreditCard size={15} className="text-slate-400" />Secure Checkout</h3>
              <p className="text-slate-400 text-xs mb-3">Your payment info is encrypted and safe.</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-white px-2 py-1 rounded text-[#1a1f36] text-[10px] font-black italic">VISA</div>
                <div className="bg-white px-2 py-1 rounded flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full -mr-1 opacity-80" /><div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80" /></div>
                <div className="bg-white px-2 py-1 rounded text-[#1a1f36] text-[10px] font-bold">UPI</div>
                <div className="bg-white px-2 py-1 rounded text-[#1a1f36] text-[10px] font-bold">RuPay</div>
              </div>
            </div>

            {/* 3D / 360 promo */}
            <div className="bg-gradient-to-br from-[#6366f1]/10 to-[#a855f7]/10 border border-[#a855f7]/20 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">🔲</div>
              <p className="text-white font-semibold text-sm">3D &amp; 360° View</p>
              <p className="text-slate-400 text-xs mt-1">Explore this product from every angle</p>
              <button onClick={() => setViewMode('3d')} className="mt-3 w-full bg-[#a855f7] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#9333ea] transition-colors">
                Open Interactive View
              </button>
            </div>
          </div>
        </div>

        {/* ── Trust Stats Banner ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 bg-[#0d0d17]/80 border border-white/5 rounded-2xl mb-8 overflow-hidden divide-x divide-y lg:divide-y-0 divide-white/5">
          {[
            { icon: Flame, val: '50K+', sub: 'Happy Customers', color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { icon: ShoppingBag, val: '10K+', sub: 'Products', color: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10' },
            { icon: Star, val: '4.9', sub: 'Customer Rating', color: 'text-yellow-500', bg: 'bg-yellow-500/10', fill: true },
            { icon: Box, val: 'Free', sub: 'Shipping ₹999+', color: 'text-[#6366f1]', bg: 'bg-[#6366f1]/10' },
            { icon: MessageSquare, val: '24/7', sub: 'Support', color: 'text-[#ec4899]', bg: 'bg-[#ec4899]/10' },
          ].map(({ icon: Icon, val, sub, color, bg, fill }) => (
            <div key={sub} className="group flex flex-col items-center justify-center gap-3 p-6 cursor-pointer hover:bg-white/5 transition-all">
              <div className={`p-3 rounded-full ${bg} group-hover:scale-110 transition-all`}>
                <Icon size={28} className={`${color} ${fill ? 'fill-current' : ''}`} />
              </div>
              <div className="text-center">
                <p className="text-white font-black text-xl">{val}</p>
                <p className="text-slate-400 text-xs font-semibold">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-5 bg-[#0d0d17]/80 border border-white/5 rounded-2xl p-6">
            {/* Tab bar */}
            <div className="flex gap-4 border-b border-white/10 mb-6 overflow-x-auto hide-scrollbar">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors capitalize whitespace-nowrap relative ${activeTab === tab ? 'text-[#a855f7]' : 'text-slate-400 hover:text-white'}`}>
                  {tab === 'reviews' ? `Reviews (${product.numReviews || 0})` : tab === 'shipping' ? 'Shipping & Returns' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && <motion.div layoutId="pdp-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a855f7]" />}
                </button>
              ))}
            </div>

            <div className="text-sm text-slate-400 leading-relaxed">
              {activeTab === 'description' && <p>{product.description}</p>}

              {activeTab === 'specifications' && (
                Object.keys(specs).length > 0
                  ? <table className="w-full text-left">
                      <tbody className="divide-y divide-white/5">
                        {Object.entries(specs).map(([k, v]) => (
                          <tr key={k}>
                            <td className="py-2 pr-4 text-slate-500 font-medium w-1/3">{k}</td>
                            <td className="py-2 text-slate-200">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  : <p className="text-slate-500">No specifications listed for this product.</p>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="text-5xl font-black text-white">{(product.ratings || 4.5).toFixed(1)}</div>
                    <div>
                      <div className="flex gap-1 mb-1">{stars.map((f, i) => <Star key={i} size={16} className={f ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-slate-600'} />)}</div>
                      <p className="text-slate-400 text-xs">Based on {product.numReviews || 312} reviews</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs">Customer reviews will appear here after purchase.</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <ul className="space-y-3">
                  {[
                    { icon: Truck, t: 'Standard Delivery', d: '2-3 business days · Free on orders ₹999+' },
                    { icon: Zap, t: 'Express Delivery', d: 'Next day delivery available in major cities' },
                    { icon: RefreshCw, t: '7-Day Returns', d: 'Easy no-questions-asked return policy' },
                    { icon: Shield, t: 'Warranty', d: 'Manufacturer warranty included' },
                  ].map(({ icon: Icon, t, d }) => (
                    <li key={t} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                      <Icon size={16} className="text-[#a855f7] mt-0.5 shrink-0" />
                      <div><p className="text-slate-200 font-medium">{t}</p><p className="text-slate-500 text-xs mt-0.5">{d}</p></div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* You May Also Like */}
          <div className="lg:col-span-7 bg-[#0d0d17]/80 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">You May Also Like</h2>
              <Link to={`/shop?category=${product.category}`} className="text-xs text-slate-400 hover:text-white transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(suggestedProducts.length ? suggestedProducts : validMockProducts.slice(0, 4)).map(item => {
                const d = getDiscountPercent(item.price, item.originalPrice);
                return (
                  <Link key={item._id} to={`/product/${item._id}`}
                    className="group block bg-[#050508] border border-white/5 rounded-xl overflow-hidden hover:border-[#a855f7]/40 transition-all">
                    <div className="relative aspect-square bg-[#0d0d17] overflow-hidden">
                      <img src={item.thumbnail} alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.src = `https://placehold.co/200x200/1e1b4b/a855f7?text=${encodeURIComponent(item.name.split(' ')[0])}`; }} />
                      {d > 0 && <span className="absolute top-2 left-2 bg-[#a855f7] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">-{d}%</span>}
                    </div>
                    <div className="p-3">
                      <p className="text-slate-300 text-xs font-medium truncate mb-1">{item.name}</p>
                      <p className="text-white font-bold text-sm">{formatPrice(item.price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
