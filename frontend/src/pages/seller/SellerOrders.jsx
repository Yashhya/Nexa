import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Package, Search, TruckIcon, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MOCK_ORDERS = [
  { id: '#NEX-982', customer: 'Arjun Mehta', product: 'Sony WH-1000XM5', amount: 24990, status: 'new', date: 'Apr 26, 2025 10:22 AM', qty: 1 },
  { id: '#NEX-979', customer: 'Priya Sharma', product: 'Air Jordan 1 Retro', amount: 12499, status: 'new', date: 'Apr 25, 2025 8:44 PM', qty: 1 },
  { id: '#NEX-971', customer: 'Rohan Das', product: 'Leather Biker Jacket', amount: 8999, status: 'shipped', date: 'Apr 23, 2025 3:10 PM', qty: 1 },
  { id: '#NEX-964', customer: 'Neha Gupta', product: 'Premium Sunglasses', amount: 3499, status: 'delivered', date: 'Apr 20, 2025 11:05 AM', qty: 2 },
  { id: '#NEX-950', customer: 'Vikram Joshi', product: 'Slim Fit Chinos', amount: 2199, status: 'cancelled', date: 'Apr 18, 2025 6:30 PM', qty: 1 },
];

const statusConfig = {
  new:       { bg: 'rgba(14,165,233,0.1)', text: '#0ea5e9', border: 'rgba(14,165,233,0.2)', label: 'New Order',  next: 'processing' },
  processing:{ bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)', label: 'Processing', next: 'shipped' },
  shipped:   { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', border: 'rgba(168,85,247,0.2)', label: 'Shipped',    next: 'delivered' },
  delivered: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.2)', label: 'Delivered',  next: null },
  cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)', label: 'Cancelled',  next: null },
};

export default function SellerOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { isDark } = useTheme();

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateStatus = (id, nextStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>My Orders – NEXA Seller</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={26} color="#06b6d4" /> Manage Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>{orders.filter(o => o.status === 'new').length} new orders need action</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'New', count: orders.filter(o => o.status === 'new').length, color: '#0ea5e9', bg: 'rgba(14,165,233,0.05)', border: 'rgba(14,165,233,0.2)' },
          { label: 'Processing', count: orders.filter(o => o.status === 'processing').length, color: '#f59e0b', bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.2)' },
          { label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: '#a855f7', bg: 'rgba(168,85,247,0.05)', border: 'rgba(168,85,247,0.2)' },
          { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: '#22c55e', bg: 'rgba(34,197,94,0.05)', border: 'rgba(34,197,94,0.2)' },
        ].map(({ label, count, color, bg, border }) => (
          <div key={label} style={{
            background: bg, border: `1px solid ${border}`, borderRadius: 16,
            padding: '1.5rem', textAlign: 'center'
          }}>
            <p style={{ color, fontSize: '2.25rem', fontWeight: 900 }}>{count}</p>
            <p style={{ color, fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: 12, padding: '0.6rem 1rem', flex: 1, minWidth: 250, maxWidth: 400
        }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." style={{
            background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', flex: 1
          }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'new', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '0.5rem 1rem', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize',
              border: filter === s ? '1px solid transparent' : '1px solid var(--border-color)',
              background: filter === s ? '#06b6d4' : 'var(--bg-card)',
              color: filter === s ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((order, i) => {
          const { bg, text, border, label, next } = statusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.25rem',
                display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-card)', transition: 'border-color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = text}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Package size={24} color="#06b6d4" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>{order.id}</span>
                  <span style={{
                    fontSize: '0.65rem', padding: '0.15rem 0.6rem', borderRadius: 99, border: `1px solid ${border}`,
                    fontWeight: 800, background: bg, color: text, textTransform: 'uppercase'
                  }}>{label}</span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                  {order.product} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>×{order.qty}</span>
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>{order.customer} · {order.date}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.1rem' }}>₹{order.amount.toLocaleString()}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                  {order.status === 'new' && (
                    <>
                      <button onClick={() => updateStatus(order.id, 'processing')} style={{
                        fontSize: '0.75rem', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)',
                        padding: '0.4rem 0.8rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <CheckCircle size={12} /> Accept
                      </button>
                      <button onClick={() => updateStatus(order.id, 'cancelled')} style={{
                        fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
                        padding: '0.4rem 0.8rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer'
                      }}>
                        Reject
                      </button>
                    </>
                  )}
                  {next && order.status !== 'new' && (
                    <button onClick={() => updateStatus(order.id, next)} style={{
                      fontSize: '0.75rem', background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)',
                      padding: '0.4rem 0.8rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                    }}>
                      <TruckIcon size={12} /> Mark {next}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <Package size={40} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
