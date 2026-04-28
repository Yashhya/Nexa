import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ShoppingBag, Package,
  LogOut, ChevronRight, Bell, Search, Menu, X,
  ShieldCheck, BarChart3, Tag, Gavel, Sun, Moon, Zap
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard',  icon: LayoutDashboard, path: '/admin' },
  { label: 'Products',   icon: ShoppingBag,     path: '/admin/products' },
  { label: 'Orders',     icon: Package,         path: '/admin/orders' },
  { label: 'Users',      icon: Users,           path: '/admin/users' },
  { label: 'Sellers',    icon: ShieldCheck,     path: '/admin/sellers' },
  { label: 'Finance',    icon: BarChart3,       path: '/admin/finance' },
  { label: 'Coupons',    icon: Tag,             path: '/admin/coupons' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector(s => s.auth);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg-primary)', color: 'var(--text-primary)',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 252, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              flexShrink: 0, height: '100vh', overflow: 'hidden',
              background: 'var(--bg-secondary)',
              borderRight: '1px solid var(--border-color)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Logo */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ShieldCheck size={18} color="white" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2 }}>NEXA</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</p>
                </div>
              </Link>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
              {navItems.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/admin'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0.6rem 0.85rem', borderRadius: 10,
                    marginBottom: 2, textDecoration: 'none',
                    fontSize: '0.875rem', fontWeight: 600,
                    background: isActive ? 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))' : 'transparent',
                    color: isActive ? '#a855f7' : 'var(--text-secondary)',
                    border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(124,58,237,0.1)' : 'none',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={16} />
                      {label}
                      {isActive && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.85rem',
                }}>
                  {user?.name?.[0] || 'A'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Admin'}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.5rem 0.75rem', borderRadius: 10, border: 'none',
                background: 'transparent', color: '#f87171', cursor: 'pointer',
                fontSize: '0.85rem', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{
          height: 56, background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 1.25rem', flexShrink: 0,
        }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '0.35rem', borderRadius: 8,
          }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-input)', borderRadius: 10,
            padding: '0.4rem 0.9rem', flex: 1, maxWidth: 340,
            border: '1px solid var(--border-color)',
          }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input placeholder="Search users, orders, products..." style={{
              background: 'transparent', border: 'none', outline: 'none', flex: 1,
              fontSize: '0.85rem', color: 'var(--text-primary)',
            }} />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Theme toggle */}
            <button onClick={toggleTheme} title={isDark ? 'Switch to Light' : 'Switch to Dark'} style={{
              width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border-color)',
              background: 'var(--bg-input)', cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button style={{
              position: 'relative', width: 34, height: 34, borderRadius: 10,
              border: '1px solid var(--border-color)', background: 'var(--bg-input)',
              cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={15} />
              <span style={{
                position: 'absolute', top: 6, right: 6, width: 7, height: 7,
                background: '#a855f7', borderRadius: '50%',
              }} />
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 10, padding: '0.3rem 0.75rem',
            }}>
              <ShieldCheck size={13} color="#a855f7" />
              <span style={{ color: '#a855f7', fontSize: '0.78rem', fontWeight: 700 }}>Super Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
