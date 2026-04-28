import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle, XCircle, Clock, ChevronRight, Store, User, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const statusColors = {
  approved: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.2)' },
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  blocked: { bg: 'rgba(220,38,38,0.1)', text: '#dc2626', border: 'rgba(220,38,38,0.2)' },
};

export default function AdminSellers() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem('nexaToken');
      const res = await axios.get('http://localhost:5000/api/admin/sellers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.sellers);
    } catch (error) {
      toast.error('Failed to fetch sellers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filtered = data.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter;
    const matchSearch = s.storeName?.toLowerCase().includes(search.toLowerCase()) || 
                        s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                        s.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('nexaToken');
      await axios.put(`http://localhost:5000/api/admin/sellers/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => prev.map(s => s._id === id ? { ...s, status } : s));
      toast.success(`Seller status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Seller Management – NEXA Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900 }}>Seller Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Manage seller applications and stores</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[{ l: 'Pending', v: data.filter(s => s.status === 'pending').length, c: '#f59e0b', bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.2)' }].map(({ l, v, c, bg, border }) => (
            <div key={l} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: 16,
              padding: '0.75rem 1.25rem', textAlign: 'center'
            }}>
              <p style={{ color: c, fontSize: '1.5rem', fontWeight: 900 }}>{v}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, marginTop: 2 }}>{l} Review</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: 12, padding: '0.6rem 1rem', flex: 1, minWidth: 250, maxWidth: 400
        }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sellers..." style={{
            background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', flex: 1
          }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'pending', 'approved', 'blocked'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '0.5rem 1rem', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize',
              border: filter === s ? '1px solid transparent' : '1px solid var(--border-color)',
              background: filter === s ? '#a855f7' : 'var(--bg-card)',
              color: filter === s ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250,
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20
        }}>
          <Loader size={32} className="animate-spin text-[#a855f7]" />
        </div>
      ) : (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Store</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Products</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applied</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((seller) => {
                const { bg, text, border } = statusColors[seller.status];
                return (
                  <motion.tr
                    key={seller._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, background: 'rgba(6,182,212,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Store size={16} color="#06b6d4" />
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{seller.storeName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{seller.user?.name || 'Unknown'}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 2 }}>{seller.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 800, textTransform: 'capitalize', padding: '0.25rem 0.6rem', borderRadius: 99,
                        background: bg, color: text, border: `1px solid ${border}`
                      }}>
                        {seller.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>{seller.metrics?.totalProducts || 0}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.85rem' }}>{seller.metrics?.totalSales > 0 ? `₹${seller.metrics.totalSales.toLocaleString()}` : '—'}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(seller.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', itemsCenter: 'center', gap: 8 }}>
                        {seller.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(seller._id, 'approved')} style={{
                              display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 700,
                              background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)',
                              padding: '0.35rem 0.75rem', borderRadius: 8, cursor: 'pointer'
                            }}>
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button onClick={() => updateStatus(seller._id, 'rejected')} style={{
                              display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 700,
                              background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
                              padding: '0.35rem 0.75rem', borderRadius: 8, cursor: 'pointer'
                            }}>
                              <XCircle size={12} /> Reject
                            </button>
                          </>
                        )}
                        {seller.status === 'approved' && (
                          <button onClick={() => updateStatus(seller._id, 'blocked')} style={{
                            display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 700,
                            background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)',
                            padding: '0.35rem 0.75rem', borderRadius: 8, cursor: 'pointer'
                          }}>
                            Block
                          </button>
                        )}
                        {seller.status === 'blocked' && (
                          <button onClick={() => updateStatus(seller._id, 'approved')} style={{
                            display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 700,
                            background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)',
                            padding: '0.35rem 0.75rem', borderRadius: 8, cursor: 'pointer'
                          }}>
                            Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
              <Store size={40} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>No sellers found.</p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
