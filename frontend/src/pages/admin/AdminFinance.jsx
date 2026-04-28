import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BarChart3, Download, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const revenueData = [
  { month: 'Jan', revenue: 420000, orders: 312 }, { month: 'Feb', revenue: 680000, orders: 489 },
  { month: 'Mar', revenue: 550000, orders: 401 }, { month: 'Apr', revenue: 910000, orders: 712 },
  { month: 'May', revenue: 1250000, orders: 901 }, { month: 'Jun', revenue: 1430000, orders: 1052 },
];

const catData = [
  { name: 'Electronics', value: 38, color: '#7c3aed' },
  { name: 'Fashion', value: 25, color: '#06b6d4' },
  { name: 'Footwear', value: 18, color: '#ec4899' },
  { name: 'Accessories', value: 11, color: '#f59e0b' },
  { name: 'Others', value: 8, color: '#6366f1' },
];

export default function AdminFinance() {
  const { isDark } = useTheme();

  const chartAxisColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.15)';
  const tooltipColor = isDark ? '#f8fafc' : '#0f172a';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Finance – NEXA Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={26} color="#a855f7" /> Finance & Revenue
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Platform-wide financial overview</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', color: 'var(--text-primary)',
          fontSize: '0.85rem', fontWeight: 600, padding: '0.75rem 1.25rem', borderRadius: 12, cursor: 'pointer',
          border: '1px solid var(--border-color)', transition: 'all 0.2s'
        }}>
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Total Revenue', value: '₹1.24 Cr', change: '+18%', icon: DollarSign, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
          { label: 'This Month', value: '₹14.3L', change: '+22%', icon: TrendingUp, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
          { label: 'Total Orders', value: '8,923', change: '+12%', icon: Package, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
          { label: 'Commission Earned', value: '₹12.4L', change: '+16%', icon: Users, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map(({ label, value, change, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Icon size={22} color={color} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>{label}</p>
            <p style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 900 }}>{value}</p>
            <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 700, marginTop: 4, display: 'inline-block' }}>{change} vs last month</span>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="lg:grid-cols-3">
        <div className="lg:col-span-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Revenue Over 6 Months</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: tooltipColor, fontSize: 12, fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} fill="url(#adminRevGrad)" activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, fontSize: 12, color: tooltipColor, fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
            {catData.map(cat => (
              <div key={cat.name} style={{ display: 'flex', itemsCenter: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', itemsCenter: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }} />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{cat.name}</span>
                </div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Chart */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Monthly Orders Volume</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid rgba(6,182,212,0.2)`, borderRadius: 12, color: tooltipColor, fontSize: 12, fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
            <Bar dataKey="orders" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
