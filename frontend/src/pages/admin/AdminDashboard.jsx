import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Users, ShoppingBag, Package, TrendingUp, DollarSign,
  ShieldCheck, Clock, CheckCircle, XCircle, ArrowUpRight,
  BarChart3, Activity, AlertTriangle, Star
} from 'lucide-react';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ label, value, icon: Icon, color, bgAccent, change, prefix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    style={{
      background: 'var(--bg-card)', borderRadius: 16, padding: '1.5rem',
      border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)',
      transition: 'all 0.3s'
    }}
    whileHover={{ y: -4, borderColor: '#a855f7' }}
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

const salesData = [
  { name: 'Mon', revenue: 42000, orders: 34 },
  { name: 'Tue', revenue: 68000, orders: 52 },
  { name: 'Wed', revenue: 55000, orders: 41 },
  { name: 'Thu', revenue: 91000, orders: 73 },
  { name: 'Fri', revenue: 125000, orders: 99 },
  { name: 'Sat', revenue: 143000, orders: 121 },
  { name: 'Sun', revenue: 87000, orders: 67 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#7c3aed' },
  { name: 'Fashion', value: 28, color: '#06b6d4' },
  { name: 'Footwear', value: 17, color: '#ec4899' },
  { name: 'Accessories', value: 12, color: '#f59e0b' },
  { name: 'Others', value: 8, color: '#8b5cf6' },
];

const recentOrders = [
  { id: '#NEX-1024', user: 'Riya Sharma', amount: 12499, status: 'delivered', date: '2 min ago' },
  { id: '#NEX-1023', user: 'Akash Patel', amount: 3299, status: 'processing', date: '14 min ago' },
  { id: '#NEX-1022', user: 'Priya Singh', amount: 8750, status: 'shipped', date: '32 min ago' },
  { id: '#NEX-1021', user: 'Rohan Kumar', amount: 1599, status: 'placed', date: '1 hr ago' },
  { id: '#NEX-1020', user: 'Sneha Joshi', amount: 25000, status: 'cancelled', date: '2 hr ago' },
];

const pendingActions = [
  { type: 'seller', label: '3 Seller applications awaiting review', action: '/admin/sellers', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { type: 'product', label: '12 Products pending approval', action: '/admin/products', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  { type: 'dispute', label: '2 Active disputes need resolution', action: '/admin/disputes', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { type: 'payout', label: '5 Payout requests pending', action: '/admin/finance', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
];

const statusColors = {
  delivered: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
  processing: { bg: 'rgba(14,165,233,0.1)', text: '#0ea5e9' },
  shipped: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
  placed: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
};

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    users: 1247, sellers: 38, products: 2451, orders: 8923,
    revenue: 12456000, pendingApprovals: 17
  });

  const chartAxisColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.15)';
  const tooltipColor = isDark ? '#f8fafc' : '#0f172a';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Admin Dashboard – NEXA</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900 }}>Control Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Live overview of NEXA platform performance</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600,
          color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.4rem 0.8rem',
          borderRadius: 99, border: '1px solid rgba(16,185,129,0.2)'
        }}>
          <Activity size={14} className="animate-pulse" /> Live Data
        </div>
      </div>

      {/* Pending Actions Banner */}
      {pendingActions.length > 0 && (
        <div style={{
          background: isDark ? 'rgba(245,158,11,0.05)' : 'rgba(245,158,11,0.05)',
          border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 16, padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>Action Required</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {pendingActions.map((action, i) => (
              <Link key={i} to={action.action} style={{
                display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 600,
                padding: '0.6rem 0.8rem', borderRadius: 10, background: action.bg, color: action.color,
                textDecoration: 'none', transition: 'opacity 0.2s'
              }} onMouseOver={e => e.currentTarget.style.opacity = 0.8} onMouseOut={e => e.currentTarget.style.opacity = 1}>
                <AlertTriangle size={14} /> {action.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <StatCard label="Total Users" value={stats.users} icon={Users} color="#7c3aed" bgAccent="rgba(124,58,237,0.15)" change={12} />
        <StatCard label="Sellers" value={stats.sellers} icon={ShieldCheck} color="#06b6d4" bgAccent="rgba(6,182,212,0.15)" change={8} />
        <StatCard label="Products" value={stats.products} icon={ShoppingBag} color="#ec4899" bgAccent="rgba(236,72,153,0.15)" change={21} />
        <StatCard label="Orders" value={stats.orders} icon={Package} color="#f59e0b" bgAccent="rgba(245,158,11,0.15)" change={5} />
        <StatCard label="Revenue" value={stats.revenue} prefix="₹" icon={DollarSign} color="#10b981" bgAccent="rgba(16,185,129,0.15)" change={18} />
        <StatCard label="Approvals" value={stats.pendingApprovals} icon={Clock} color="#ef4444" bgAccent="rgba(239,68,68,0.15)" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>Revenue This Week</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>Daily revenue in INR</p>
            </div>
            <span style={{ color: '#a855f7', fontSize: '0.9rem', fontWeight: 800 }}>₹8.71L total</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: tooltipColor, fontSize: 12, fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} fill="url(#revenueGrad)" activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Sales by Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, fontSize: 12, color: tooltipColor, fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
            {categoryData.map((cat) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                </div>
                <span style={{ color: 'var(--text-primary)' }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders + Orders Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="lg:grid-cols-2">
        {/* Recent Orders */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentOrders.map((order) => (
              <div key={order.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem', borderRadius: 14,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid transparent',
                transition: 'all 0.2s', cursor: 'pointer'
              }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-color)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'rgba(124,58,237,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#a855f7'
                }}>
                  {order.user[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 700 }}>{order.user}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>{order.id} · {order.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
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

        {/* Weekly Orders Bar Chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Orders This Week</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid rgba(6,182,212,0.2)`, borderRadius: 12, color: tooltipColor, fontSize: 12, fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="orders" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
