import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Search, X, Loader } from 'lucide-react';
import { formatPrice, formatDate, getOrderStatusLabel } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const STATUS_OPTIONS = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState(null);
  const { isDark } = useTheme();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/orders', { params: { status: filterStatus } });
      setOrders(res.data.orders || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [search, filterStatus]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Status updated`);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Admin – Orders | NEXA</title></Helmet>

      <div>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingBag size={26} color="#a855f7" /> Orders
          <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 600 }}>({orders.length})</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Manage and track customer orders</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: 12, padding: '0.75rem 1rem', flex: 1, minWidth: 250, maxWidth: 400, position: 'relative'
        }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} style={{
            background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', flex: 1
          }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={14} /></button>}
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{
          padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12,
          color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', minWidth: 180
        }}>
          <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{getOrderStatusLabel(s)}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20 }}>
          <Loader size={32} className="animate-spin" color="#a855f7" />
        </div>
      ) : (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Update'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>No orders found</td></tr>
              ) : orders.map((order, i) => (
                <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#a855f7', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700 }}>
                      #{order._id?.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{order.user?.name || 'Guest'}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 2 }}>{order.user?.email}</p>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.9rem' }}>{formatPrice(order.totalAmount || order.total || 0)}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {formatDate(order.createdAt)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: 99, fontWeight: 700,
                      background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)'
                    }}>
                      {getOrderStatusLabel(order.orderStatus || order.status)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ position: 'relative', width: 'fit-content' }}>
                      <select
                        value={order.orderStatus || order.status}
                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updating === order._id}
                        style={{
                          padding: '0.4rem 0.75rem', paddingRight: '2rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                          borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none', cursor: 'pointer',
                          minWidth: 140, fontWeight: 600, appearance: 'none'
                        }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{getOrderStatusLabel(s)}</option>
                        ))}
                      </select>
                      {updating === order._id ? (
                        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                          <Loader size={12} className="animate-spin" color="#a855f7" />
                        </div>
                      ) : (
                        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                          ▼
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminOrders;
