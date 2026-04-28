import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, Plus, Pencil, Trash2, Search, X, Save, Image, Loader } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { CATEGORIES } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const emptyForm = {
  name: '', description: '', price: '', originalPrice: '', category: 'Electronics',
  brand: '', stock: '', thumbnail: '', isFeatured: false, isTrending: false, freeShipping: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { isDark } = useTheme();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/products', { params: { keyword: search, limit: 100 } });
      setProducts(res.data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, description: p.description || '', price: p.price, originalPrice: p.originalPrice || '', category: p.category, brand: p.brand || '', stock: p.stock, thumbnail: p.thumbnail || '', isFeatured: p.isFeatured || false, isTrending: p.isTrending || false, freeShipping: p.freeShipping || false });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const res = await api.put(`/products/${editId}`, form);
        setProducts(prev => prev.map(p => p._id === editId ? res.data.product : p));
        toast.success('Product updated!');
      } else {
        const res = await api.post('/products', form);
        setProducts(prev => [res.data.product, ...prev]);
        toast.success('Product created!');
      }
      setShowModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Deleted!');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Admin – Products | NEXA</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={26} color="#a855f7" /> Products
            <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 600 }}>({products.length})</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Manage inventory and listings</p>
        </div>
        <motion.button onClick={openAdd} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: 'white', fontSize: '0.9rem', fontWeight: 700, padding: '0.75rem 1.25rem', borderRadius: 12,
          border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(124,58,237,0.25)'
        }}>
          <Plus size={16} /> Add Product
        </motion.button>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
        borderRadius: 12, padding: '0.75rem 1rem', maxWidth: 400, position: 'relative'
      }}>
        <Search size={16} style={{ color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{
          background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', flex: 1
        }} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={14} /></button>}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', height: 250, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20 }}>
          <Loader size={32} className="animate-spin" color="#a855f7" />
        </div>
      ) : (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.thumbnail || `https://placehold.co/48x48/1e1b4b/a855f7?text=${encodeURIComponent(p.name)}`} alt={p.name}
                        style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                        onError={e => e.target.src = `https://placehold.co/48x48/1e1b4b/a855f7?text=${encodeURIComponent(p.name)}`} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 250 }}>{p.name}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 2 }}>{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{p.category}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.9rem' }}>{formatPrice(p.price)}</span>
                    {p.originalPrice > p.price && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'line-through', marginLeft: 8 }}>{formatPrice(p.originalPrice)}</span>}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: p.stock < 5 ? '#ef4444' : p.stock < 20 ? '#f59e0b' : '#22c55e' }}>{p.stock}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.isFeatured && <span style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Featured</span>}
                      {p.isTrending && <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Trending</span>}
                      {!p.isFeatured && !p.isTrending && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{
                        width: 32, height: 32, borderRadius: 8, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
                        display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#a855f7', cursor: 'pointer'
                      }}><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(p._id)} style={{
                        width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer'
                      }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
             <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
               <Package size={40} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>No products found.</p>
             </div>
          )}
        </div>
      </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
            }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 24,
                width: '100%', maxWidth: 650, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{editId ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Product Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Apple iPhone 15 Pro"
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="99999"
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Original Price (₹)</label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="129999"
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Category *</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}>
                      {CATEGORIES.map(c => <option key={c.slug} value={c.name} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Brand</label>
                    <input type="text" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Apple"
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Stock *</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required placeholder="100"
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Thumbnail URL</label>
                    <input type="url" value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} placeholder="https://..."
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Product description..."
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                      { key: 'isFeatured', label: 'Featured' },
                      { key: 'isTrending', label: 'Trending' },
                      { key: 'freeShipping', label: 'Free Shipping' },
                    ].map(({ key, label }) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#a855f7' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{
                    flex: 1, padding: '0.85rem', borderRadius: 12, background: 'var(--bg-input)', color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
                  }}>Cancel</button>
                  <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                    flex: 1, padding: '0.85rem', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white',
                    border: 'none', fontSize: '0.9rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}>
                    {saving ? <Loader size={18} className="animate-spin" /> : <><Save size={18} /> {editId ? 'Update' : 'Create'}</>}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
