import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Search, Edit2, Trash2, Eye, CheckCircle, XCircle, Clock, X, AlertCircle, Box } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Sony WH-1000XM5 Headphones', sku: 'EL-SONY-001', category: 'Electronics', price: 24990, stock: 80, status: 'approved', sales: 48, model3d: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/headphones/model.gltf', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=60&q=80' },
  { id: 'p2', name: 'Premium Biker Leather Jacket', sku: 'FA-LBJ-001', category: 'Fashion', price: 9999, stock: 40, status: 'approved', sales: 23, model3d: '', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=60&q=80' },
  { id: 'p3', name: 'Nike Air Max 270 React', sku: 'SH-NIKE-001', category: 'Shoes', price: 12995, stock: 100, status: 'pending', sales: 0, model3d: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shoe-draco/model.gltf', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&q=80' },
  { id: 'p4', name: 'Ray-Ban Aviator Classic', sku: 'AC-RB-001', category: 'Accessories', price: 9500, stock: 120, status: 'approved', sales: 67, model3d: '', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=60&q=80' },
  { id: 'p5', name: 'Rolex Submariner Homage', sku: 'WA-SUB-001', category: 'Watches', price: 15999, stock: 30, status: 'rejected', sales: 0, model3d: '', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=60&q=80' },
];

const EMPTY_FORM = { name: '', category: '', brand: '', price: '', originalPrice: '', description: '', shortDescription: '', stock: '', thumbnail: '', model3d: '' };

const statusConfig = {
  approved: { bg: 'rgba(34,197,94,0.1)',  text: '#22c55e', icon: CheckCircle },
  pending:  { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', icon: Clock },
  rejected: { bg: 'rgba(239,68,68,0.1)',  text: '#ef4444', icon: XCircle },
};

const Field = ({ label, name, type = 'text', form, onChange, required, placeholder, as, options }) => {
  const base = { background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '0.55rem 0.85rem', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%', outline: 'none', fontFamily: 'inherit' };
  return (
    <div>
      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {as === 'textarea'
        ? <textarea name={name} value={form[name]} onChange={onChange} required={required} placeholder={placeholder} rows={3} style={{ ...base, resize: 'vertical' }} />
        : as === 'select'
        ? <select name={name} value={form[name]} onChange={onChange} required={required} style={base}>
            <option value="">Select category…</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        : <input type={type} name={name} value={form[name]} onChange={onChange} required={required} placeholder={placeholder} style={base} />
      }
    </div>
  );
};

export default function SellerProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const { isDark } = useTheme();

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleChange = e => { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })); setErrors(er => ({ ...er, [name]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Product name is required';
    if (!form.category)           e.category    = 'Category is required';
    if (!form.brand.trim())       e.brand       = 'Brand is required';
    if (!form.price || +form.price <= 0)  e.price = 'Valid price is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.thumbnail.trim())   e.thumbnail   = 'Thumbnail image URL is required';
    if (form.stock === '' || +form.stock < 0) e.stock = 'Valid stock quantity is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Please fix the highlighted fields'); return; }
    const newProduct = {
      id: 'p' + Date.now(),
      name: form.name, sku: 'SKU-' + Date.now(),
      category: form.category, price: +form.price,
      stock: +form.stock, status: 'pending', sales: 0,
      model3d: form.model3d || '',
      img: form.thumbnail,
    };
    setProducts(prev => [newProduct, ...prev]);
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
    toast.success('Product submitted for approval!');
  };

  const deleteProduct = (id) => { if (window.confirm('Delete this product?')) setProducts(prev => prev.filter(p => p.id !== id)); };

  const inputStyle = { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '0.6rem 1rem', flex: 1, minWidth: 250, maxWidth: 400 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>My Products – NEXA Seller</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={26} color="#06b6d4" /> My Products
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>{products.length} total products in your store</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(to right, #0891b2, #059669)', color: 'white', fontSize: '0.85rem', fontWeight: 600, padding: '0.6rem 1.2rem', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(8,145,178,0.25)' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Products', value: products.length, color: 'var(--text-primary)' },
          { label: 'Approved',       value: products.filter(p => p.status === 'approved').length, color: '#22c55e' },
          { label: 'Pending',        value: products.filter(p => p.status === 'pending').length,  color: '#f59e0b' },
          { label: 'With 3D Model',  value: products.filter(p => p.model3d).length, color: '#a855f7' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color, fontSize: '2rem', fontWeight: 900 }}>{value}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginTop: 4 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={inputStyle}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'approved', 'pending', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.5rem 1rem', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize', border: filter === s ? '1px solid transparent' : '1px solid var(--border-color)', background: filter === s ? '#06b6d4' : 'var(--bg-card)', color: filter === s ? 'white' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                {['Product', 'SKU', 'Category', 'Price', 'Stock', '3D Model', 'Status', 'Sales', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const { bg, text, icon: Icon } = statusConfig[product.status];
                return (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={product.img} alt={product.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} onError={e => { e.target.src = 'https://placehold.co/40x40/1e1b4b/a855f7?text=P'; }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{product.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{product.sku}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{product.category}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-primary)', fontWeight: 800 }}>₹{product.price.toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.25rem', color: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '#22c55e', fontWeight: 800 }}>{product.stock}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {product.model3d
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(168,85,247,0.1)', color: '#a855f7', padding: '3px 8px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700 }}><Box size={11} />3D</span>
                        : <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: bg, color: text, padding: '0.3rem 0.6rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>
                        <Icon size={12} />{product.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{product.sales}</td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        {[{ Icon: Eye, bg: 'var(--bg-input)', border: 'var(--border-color)', color: 'var(--text-secondary)', fn: () => {} },
                          { Icon: Edit2, bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', color: '#06b6d4', fn: () => {} },
                          { Icon: Trash2, bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', color: '#ef4444', fn: () => deleteProduct(product.id) },
                        ].map(({ Icon, bg, border, color, fn }, i) => (
                          <button key={i} onClick={fn} style={{ width: 32, height: 32, borderRadius: 8, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, cursor: 'pointer' }}><Icon size={14} /></button>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
              <ShoppingBag size={40} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>No products found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Product Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 24, padding: '2rem', width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: 900 }}>Add New Product</h2>
                <button onClick={() => setShowModal(false)} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={16} /></button>
              </div>

              {/* Validation note */}
              <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: 8 }}>
                <AlertCircle size={16} style={{ color: '#a855f7', flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: '#c084fc', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  All required fields must be filled. Adding a <strong>3D Model URL</strong> is highly recommended for a premium product experience. Incomplete products will not be published.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}><Field label="Product Name" name="name" form={form} onChange={handleChange} required placeholder="e.g. Sony WH-1000XM5" /></div>
                  {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: -8 }}>{errors.name}</p>}
                  <Field label="Category" name="category" form={form} onChange={handleChange} required as="select" options={CATEGORIES.map(c => c.name)} />
                  <Field label="Brand" name="brand" form={form} onChange={handleChange} required placeholder="e.g. Sony" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <Field label="Price (₹)" name="price" type="number" form={form} onChange={handleChange} required placeholder="24990" />
                  <Field label="Original Price (₹)" name="originalPrice" type="number" form={form} onChange={handleChange} placeholder="34990" />
                  <Field label="Stock Qty" name="stock" type="number" form={form} onChange={handleChange} required placeholder="80" />
                </div>

                <Field label="Description" name="description" form={form} onChange={handleChange} required as="textarea" placeholder="Detailed product description…" />
                <Field label="Short Description" name="shortDescription" form={form} onChange={handleChange} placeholder="Key features (separate with ·)" />
                <Field label="Thumbnail Image URL" name="thumbnail" form={form} onChange={handleChange} required placeholder="https://images.unsplash.com/…" />

                {/* 3D Model field */}
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    3D Model URL (.gltf / .glb) <span style={{ color: '#a855f7', fontSize: '0.65rem', fontWeight: 600, textTransform: 'none' }}>— Recommended</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input name="model3d" value={form.model3d} onChange={handleChange} placeholder="https://… model.gltf or model.glb"
                      style={{ background: 'var(--bg-input)', border: form.model3d ? '1px solid rgba(168,85,247,0.5)' : '1px solid var(--border-color)', borderRadius: 10, padding: '0.55rem 2.5rem 0.55rem 0.85rem', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%', outline: 'none', fontFamily: 'inherit' }} />
                    {form.model3d && <Box size={15} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#a855f7' }} />}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 4 }}>Products with 3D models get 3× more engagement. Use .glb for best performance.</p>
                </div>

                {/* Error summary */}
                {Object.keys(errors).length > 0 && (
                  <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.75rem 1rem' }}>
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>Please fix: {Object.values(errors).join(' · ')}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '0.75rem', borderRadius: 12, background: 'linear-gradient(to right,#6366f1,#a855f7)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', border: 'none', boxShadow: '0 4px 16px rgba(168,85,247,0.35)' }}>
                    Submit for Review
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
