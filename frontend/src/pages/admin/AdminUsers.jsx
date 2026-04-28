import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Users, Search, X, UserCheck, UserX, Loader } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { isDark } = useTheme();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { keyword: search, role: roleFilter } });
      setUsers(res.data.users || []);
    } catch { toast.error('Failed to load users'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleToggleBlock = async (userId, isActive) => {
    if (!window.confirm(`${isActive ? 'Block' : 'Unblock'} this user?`)) return;
    setUpdatingId(userId);
    try {
      const res = await api.put(`/admin/users/${userId}/toggle`);
      setUsers(prev => prev.map(u => u._id === userId ? res.data.user : u));
      toast.success(`User ${res.data.user.isActive ? 'unblocked' : 'blocked'}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setUpdatingId(null); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>Admin – Users | NEXA</title></Helmet>

      <div>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={26} color="#a855f7" /> Users
          <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 600 }}>({users.length})</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Manage users, sellers, and admin accounts</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: 12, padding: '0.75rem 1rem', flex: 1, minWidth: 250, maxWidth: 400, position: 'relative'
        }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{
            background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', flex: 1
          }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={14} /></button>}
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{
          padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12,
          color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', minWidth: 140
        }}>
          <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>All Roles</option>
          <option value="user" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Users</option>
          <option value="seller" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Sellers</option>
          <option value="admin" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Admins</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Users', value: users.length, color: '#a855f7' },
          { label: 'Sellers', value: users.filter(u => u.role === 'seller').length, color: '#06b6d4' },
          { label: 'Active', value: users.filter(u => u.isActive !== false).length, color: '#22c55e' },
          { label: 'Blocked', value: users.filter(u => u.isActive === false).length, color: '#ef4444' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem', textAlign: 'center', boxShadow: 'var(--shadow-card)'
          }}>
            <p style={{ color: s.color, fontSize: '2rem', fontWeight: 900 }}>{s.value}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginTop: 4 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20 }}>
          <Loader size={32} className="animate-spin" color="#a855f7" />
        </div>
      ) : (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>No users found</td></tr>
              ) : users.map((user, i) => (
                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800 }}>{user.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 99, fontWeight: 700,
                      background: user.role === 'admin' ? 'rgba(168,85,247,0.1)' : user.role === 'seller' ? 'rgba(6,182,212,0.1)' : 'var(--bg-input)',
                      color: user.role === 'admin' ? '#a855f7' : user.role === 'seller' ? '#06b6d4' : 'var(--text-secondary)',
                      border: `1px solid ${user.role === 'admin' ? 'rgba(168,85,247,0.2)' : user.role === 'seller' ? 'rgba(6,182,212,0.2)' : 'var(--border-color)'}`
                    }}>
                      {user.role === 'admin' ? '👑 Admin' : user.role === 'seller' ? '🏪 Seller' : '👤 User'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{formatDate(user.createdAt)}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {user.isActive === false ? (
                      <span style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: 99, background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 800 }}>Blocked</span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: 99, background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 800 }}>Active</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button onClick={() => handleToggleBlock(user._id, user.isActive !== false)} disabled={updatingId === user._id} style={{
                      display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer',
                      background: user.isActive === false ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: user.isActive === false ? '#22c55e' : '#ef4444',
                      border: `1px solid ${user.isActive === false ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
                    }}>
                      {updatingId === user._id ? <Loader size={12} className="animate-spin" /> : user.isActive === false ? <><UserCheck size={12} /> Unblock</> : <><UserX size={12} /> Block</>}
                    </button>
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

export default AdminUsers;
