import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  DollarSign, ShoppingBag, Package, Star, TrendingUp,
  ArrowUpRight, AlertTriangle, Plus, BarChart3, Eye
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const weekData = [
  { day: 'Mon', sales: 12400, orders: 8 },
  { day: 'Tue', sales: 19800, orders: 15 },
  { day: 'Wed', sales: 9200, orders: 7 },
  { day: 'Thu', sales: 28500, orders: 22 },
  { day: 'Fri', sales: 35700, orders: 29 },
  { day: 'Sat', sales: 41200, orders: 33 },
  { day: 'Sun', sales: 22400, orders: 18 },
];

const StatCard = ({ label, value, icon: Icon, color, bgAccent, change, prefix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    style={{
      background: 'var(--bg-card)', borderRadius: 16, padding: '1.5rem',
      border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)',
      transition: 'all 0.3s'
    }}
    whileHover={{ y: -4, borderColor: '#06b6d4' }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ padding: '0.75rem', borderRadius: 12, background: bgAccent, color: color }}>
        <Icon size={24} />
      </div>
      {change && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600,
          padding: '0.25rem 0.6rem', borderRadius: 99,
          background: change > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          color: change > 0 ? '#22c55e' : '#ef4444'
        }}>
          <ArrowUpRight size={12} style={{ transform: change < 0 ? 'rotate(180deg)' : 'none' }} />
          {Math.abs(change)}%
        </span>
      )}
    </div>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</p>
    <p style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 800 }}>{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
  </motion.div>
);

const recentOrders = [
  { id: '#NEX-982', product: 'Sony WH-1000XM5', amount: 24990, status: 'new', customer: 'Arjun M.' },
  { id: '#NEX-981', product: 'iPhone 15 Pro Case', amount: 899, status: 'shipped', customer: 'Neha K.' },
  { id: '#NEX-980', product: 'Leather Jacket', amount: 8999, status: 'delivered', customer: 'Rohan D.' },
  { id: '#NEX-979', product: 'Air Jordan 1 Retro', amount: 12499, status: 'new', customer: 'Priya S.' },
];

const lowStockItems = [
  { name: 'Sony WH-1000XM5', stock: 2, sku: 'EL-SONY-001' },
  { name: 'Slim Fit Jeans - 32', stock: 3, sku: 'FA-JEANS-032' },
  { name: 'Air Max 90 - Size 9', stock: 1, sku: 'FW-AIRM-09' },
];

const statusColors = {
  new: { bg: 'rgba(14,165,233,0.1)', text: '#0ea5e9' },
  shipped: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
  delivered: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
};

export default function SellerDashboard() {
  const { user } = useSelector(s => s.auth);
  const { isDark } = useTheme();

  const chartAxisColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.15)';
  const tooltipColor = isDark ? '#f8fafc' : '#0f172a';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Seller Dashboard – NEXA</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900 }}>Welcome back, {user?.name?.split(' ')[0] || 'Seller'} 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Here's your store performance today</p>
        </div>
        <Link to="/seller/products/new" style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(to right, #0891b2, #059669)',
          color: 'white', fontSize: '0.85rem', fontWeight: 600, padding: '0.6rem 1.2rem', borderRadius: 12,
          textDecoration: 'none', boxShadow: '0 8px 16px rgba(8,145,178,0.25)', transition: 'all 0.2s'
        }} onMouseOver={e => e.currentTarget.style.opacity = 0.9} onMouseOut={e => e.currentTarget.style.opacity = 1}>
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div style={{
          background: isDark ? 'rgba(245,158,11,0.05)' : 'rgba(245,158,11,0.05)',
          border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 16, padding: '1.25rem',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <AlertTriangle size={20} color="#f59e0b" />
          <p style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600 }}>
            <span style={{ fontWeight: 800 }}>{lowStockItems.length} products</span> are running low on stock.
            <Link to="/seller/inventory" style={{ marginLeft: 8, color: '#f59e0b', textDecoration: 'underline' }}>Manage inventory →</Link>
          </p>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard label="Revenue Today" value={41200} prefix="₹" icon={DollarSign} color="#10b981" bgAccent="rgba(16,185,129,0.15)" change={22} />
        <StatCard label="Total Orders" value={33} icon={Package} color="#06b6d4" bgAccent="rgba(6,182,212,0.15)" change={8} />
        <StatCard label="Active Products" value={47} icon={ShoppingBag} color="#a855f7" bgAccent="rgba(168,85,247,0.15)" change={3} />
        <StatCard label="Avg. Rating" value="4.7" icon={Star} color="#f59e0b" bgAccent="rgba(245,158,11,0.15)" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>Weekly Sales</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>Revenue and orders per day</p>
            </div>
            <span style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 800 }}>₹1.69L this week</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sellerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis dataKey="day" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: tooltipColor, fontSize: 12, fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                formatter={(v) => [`₹${v.toLocaleString()}`, 'Sales']}
              />
              <Area type="monotone" dataKey="sales" stroke="#06b6d4" strokeWidth={3} fill="url(#sellerGrad)" activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>Low Stock Alert</h2>
            <Link to="/seller/inventory" style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>Fix now</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lowStockItems.map((item) => (
              <div key={item.sku} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '0.85rem', borderRadius: 14,
                background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)'
              }}>
                <AlertTriangle size={16} color="#ef4444" style={{ marginTop: 2 }} />
                <div>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 700 }}>{item.name}</p>
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, marginTop: 2 }}>Only {item.stock} left</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, marginTop: 2 }}>{item.sku}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/seller/inventory" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '1.25rem',
            background: 'rgba(8,145,178,0.1)', color: '#06b6d4', padding: '0.75rem', borderRadius: 12,
            fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(8,145,178,0.2)'
          }}>
            View all inventory
          </Link>
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="lg:grid-cols-2">
        {/* Orders */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>Recent Orders</h2>
            <Link to="/seller/orders" style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>See all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentOrders.map((order) => (
              <div key={order.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem', borderRadius: 14,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid transparent',
                transition: 'all 0.2s', cursor: 'pointer'
              }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-color)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'rgba(6,182,212,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#06b6d4'
                }}>
                  {order.customer[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.product}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>{order.id} · {order.customer}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 800 }}>₹{order.amount.toLocaleString()}</p>
                  <span style={{
                    fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: 99, fontWeight: 700,
                    background: statusColors[order.status].bg, color: statusColors[order.status].text, textTransform: 'uppercase'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Add Product', icon: Plus, to: '/seller/products/new', bg: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
              { label: 'View Orders', icon: Package, to: '/seller/orders', bg: 'linear-gradient(135deg, #0891b2, #06b6d4)' },
              { label: 'AI Tools', icon: TrendingUp, to: '/seller/ai-tools', bg: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
              { label: 'Analytics', icon: BarChart3, to: '/seller/analytics', bg: 'linear-gradient(135deg, #f59e0b, #f97316)' },
            ].map(({ label, icon: Icon, to, bg }) => (
              <Link key={to} to={to} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '1.5rem', borderRadius: 16, background: bg, color: 'white', textDecoration: 'none',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'transform 0.2s'
              }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Icon size={26} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
