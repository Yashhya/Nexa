import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ArrowDownRight, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const earningsData = [
  { month: 'Jan', earnings: 42000 }, { month: 'Feb', earnings: 68000 },
  { month: 'Mar', earnings: 55000 }, { month: 'Apr', earnings: 91200 },
];

const payouts = [
  { id: 'PO-001', amount: 45000, status: 'completed', date: 'Apr 15, 2025', method: 'Bank Transfer', ref: 'TXN8823' },
  { id: 'PO-002', amount: 28500, status: 'processing', date: 'Apr 22, 2025', method: 'Bank Transfer', ref: 'TXN9012' },
  { id: 'PO-003', amount: 62000, status: 'pending', date: 'Apr 26, 2025', method: 'Bank Transfer', ref: '—' },
];

const statusColors = {
  completed: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.2)' },
  processing: { bg: 'rgba(14,165,233,0.1)', text: '#0ea5e9', border: 'rgba(14,165,233,0.2)' },
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  failed: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)' },
};

export default function SellerFinance() {
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const { isDark } = useTheme();

  const chartAxisColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.15)';
  const tooltipColor = isDark ? '#f8fafc' : '#0f172a';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Finance – NEXA Seller</title></Helmet>

      <div>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
          <DollarSign size={26} color="#06b6d4" /> Finance & Payouts
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Manage your earnings and withdrawal requests</p>
      </div>

      {/* Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{
          position: 'relative', background: 'linear-gradient(135deg, rgba(8,145,178,0.15), rgba(5,150,105,0.1))',
          border: '1px solid rgba(8,145,178,0.25)', borderRadius: 20, padding: '1.5rem', overflow: 'hidden'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Available Balance</p>
          <p style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 900 }}>₹62,400</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginTop: 4 }}>Ready to withdraw</p>
          <TrendingUp style={{ position: 'absolute', top: 20, right: 20, color: '#06b6d4', opacity: 0.2 }} size={60} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Pending Payout</p>
          <p style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 900 }}>₹28,500</p>
          <p style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> Processing
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Total Earned</p>
          <p style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 900 }}>₹2,56,200</p>
          <p style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 600, marginTop: 4 }}>All time</p>
        </motion.div>
      </div>

      {/* Earnings Chart + Withdraw Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="lg:grid-cols-3">
        <div className="lg:col-span-2" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)'
        }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Monthly Earnings</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 11, fontWeight: 600 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: tooltipColor, fontSize: 12, fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                formatter={(v) => [`₹${v.toLocaleString()}`, 'Earnings']}
              />
              <Area type="monotone" dataKey="earnings" stroke="#06b6d4" strokeWidth={3} fill="url(#finGrad)" activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Withdraw */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)'
        }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Request Withdrawal</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Amount (₹)</label>
              <input
                type="number" value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} placeholder="Enter amount"
                style={{
                  width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12,
                  padding: '0.85rem 1rem', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#06b6d4'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500, marginTop: 6 }}>Available: ₹62,400</p>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Bank Account</label>
              <div style={{
                background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12,
                padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500
              }}>
                HDFC Bank ****4892
              </div>
            </div>
            <div style={{
              background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12,
              padding: '0.85rem', display: 'flex', gap: 10, alignItems: 'flex-start'
            }}>
              <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4 }}>
                10% platform commission will be deducted. Payouts processed within 3-5 business days.
              </p>
            </div>
            <button style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: 8,
              background: 'linear-gradient(to right, #0891b2, #059669)', color: 'white', fontSize: '0.9rem', fontWeight: 700,
              padding: '0.85rem', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(8,145,178,0.2)', transition: 'opacity 0.2s'
            }} onMouseOver={e => e.currentTarget.style.opacity = 0.9} onMouseOut={e => e.currentTarget.style.opacity = 1}>
              <ArrowDownRight size={16} /> Request Withdrawal
            </button>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>Payout History</h2>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)',
            background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer'
          }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payout ID</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Method</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ref</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => {
                const { bg, text, border } = statusColors[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.id}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.95rem' }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{p.method}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 800, textTransform: 'capitalize', padding: '0.25rem 0.6rem', borderRadius: 99,
                        background: bg, color: text, border: `1px solid ${border}`
                      }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{p.date}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.ref}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
