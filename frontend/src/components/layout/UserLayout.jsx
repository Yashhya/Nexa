import React from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, Package, Heart, User,
  LogOut, Bell, Gift, Home, Sun, Moon, ShoppingBag
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/account' },
  { label: 'My Orders', icon: Package,         path: '/account/orders' },
  { label: 'Wishlist',  icon: Heart,           path: '/account/wishlist' },
  { label: 'Profile',   icon: User,            path: '/account/profile' },
  { label: 'Rewards',   icon: Gift,            path: '/account/rewards' },
];

export default function UserLayout() {
  const { user } = useSelector(s => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('See you soon! 👋');
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Top Navbar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40, height: 56,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center',
        padding: '0 1.5rem', gap: 12,
      }}>
        {/* Back to shop */}
        <button onClick={() => navigate('/home')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: '0.85rem',
          transition: 'color 0.2s', marginRight: 4,
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <Home size={15} />
          <span>Back to Shop</span>
        </button>

        {/* Logo */}
        <Link to="/account" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingBag size={14} color="white" />
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>My Account</span>
        </Link>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'} style={{
            width: 32, height: 32, borderRadius: 9, border: '1px solid var(--border-color)',
            background: 'var(--bg-input)', cursor: 'pointer', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button style={{
            width: 32, height: 32, borderRadius: 9, border: '1px solid var(--border-color)',
            background: 'var(--bg-input)', cursor: 'pointer', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <Bell size={14} />
          </button>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '0.8rem',
            }}>
              {user?.name?.[0] || 'U'}
            </div>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
              {user?.name?.split(' ')[0]}
            </span>
          </div>

          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#f87171', fontSize: '0.85rem', transition: 'opacity 0.2s',
          }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Body: Sidebar + Content */}
      <div style={{
        display: 'flex', maxWidth: 1200,
        margin: '0 auto', padding: '2rem 1.5rem', gap: '2rem',
      }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0 }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 18, padding: '1rem',
            position: 'sticky', top: 72,
          }}>
            {/* Avatar block */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '1rem 0.5rem 0.75rem',
              borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '1.3rem', marginBottom: 8,
              }}>
                {user?.name?.[0] || 'U'}
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'center', marginTop: 2 }}>
                {user?.email}
              </p>
            </div>

            {/* Nav links */}
            <nav>
              {navItems.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/account'}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '0.6rem 0.8rem', borderRadius: 10, marginBottom: 2,
                    textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                    transition: 'all 0.18s',
                    background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                    color: isActive ? '#a855f7' : 'var(--text-secondary)',
                    border: isActive ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent',
                  })}
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
