import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, Search, User, Menu, X, Zap, LogOut,
  Package, Settings, ChevronDown, Sparkles
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { toggleCart } from '../../store/slices/uiSlice';
import { toggleAssistant } from '../../store/slices/uiSlice';
import { CATEGORIES } from '../../utils/helpers';
import LampSwitch from '../ui/LampSwitch';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const { cart } = useSelector(s => s.cart);
  const cartCount = cart?.totalItems || 0;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
    setShowCategories(false);
  }, [location.pathname]);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('See you soon! 👋');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: isScrolled ? 'var(--nav-bg)' : 'transparent',
        borderBottom: isScrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        padding: isScrolled ? '0.625rem 0' : '0.875rem 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

            {/* LOGO */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                className="glow-purple"
              >
                <Zap size={17} color="white" fill="white" />
              </motion.div>
              <span style={{
                fontSize: '1.35rem', fontWeight: 800,
                fontFamily: "'Space Grotesk', sans-serif",
              }} className="gradient-text">
                NEXA
              </span>
            </Link>

            {/* CENTER NAV LINKS */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}
              className="hide-mobile">
              {[{ label: 'Home', path: '/home' }, { label: 'Shop', path: '/shop' }].map(link => (
                <Link key={link.path} to={link.path} style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive(link.path) ? '#a855f7' : 'var(--text-secondary)',
                  background: isActive(link.path) ? 'rgba(168,85,247,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '0.5rem 1rem', borderRadius: 10,
                  fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                  color: 'var(--text-secondary)', background: 'transparent',
                  border: 'none', transition: 'all 0.2s',
                }}>
                  Categories
                  <ChevronDown size={13} style={{ transform: showCategories ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: 'absolute', top: '100%', left: 0,
                        marginTop: 8, width: 200,
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 14,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        zIndex: 100,
                      }}
                    >
                      {CATEGORIES.map(cat => (
                        <Link key={cat.slug} to={`/shop?category=${cat.name}`} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '0.65rem 1rem', textDecoration: 'none',
                          color: 'var(--text-secondary)', fontSize: '0.88rem',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#a855f7'; e.currentTarget.style.background = 'rgba(168,85,247,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ fontSize: '1rem' }}>{cat.icon}</span>
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>

              {/* Lamp Switch */}
              <div style={{ marginRight: '0.5rem' }}>
                <LampSwitch />
              </div>

              {/* Search */}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(!showSearch)}
                style={{ padding: '0.55rem', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <Search size={19} />
              </motion.button>

              {/* AI */}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(toggleAssistant())}
                style={{ padding: '0.55rem', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: '#22d3ee', position: 'relative' }}>
                <Sparkles size={19} />
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 7, height: 7, background: '#22d3ee',
                  borderRadius: '50%', animation: 'pulse-glow 2s infinite',
                }} />
              </motion.button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link to="/wishlist" style={{ textDecoration: 'none' }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '0.55rem', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <Heart size={19} />
                  </motion.button>
                </Link>
              )}

              {/* Cart */}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(toggleCart())}
                style={{ padding: '0.55rem', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative' }}>
                <ShoppingCart size={19} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span key={cartCount}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: 2, right: 2,
                        width: 18, height: 18,
                        background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                        color: 'white', fontSize: '0.65rem', fontWeight: 700,
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User */}
              {isAuthenticated ? (
                <div style={{ position: 'relative' }}>
                  <motion.button whileHover={{ scale: 1.02 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                      borderRadius: 10,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}
                      className="hide-mobile">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: 'absolute', right: 0, top: '100%',
                          marginTop: 8, width: 210,
                          background: 'var(--glass-bg)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 14, overflow: 'hidden',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.3)', zIndex: 100,
                        }}
                      >
                        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.email}</p>
                        </div>
                        {[
                          ...(user?.role === 'admin'
                            ? [{ icon: Settings, label: 'Admin Panel', path: '/admin' }]
                            : user?.role === 'seller'
                            ? [{ icon: Settings, label: 'Seller Panel', path: '/seller' }]
                            : [{ icon: User, label: 'My Account', path: '/account' }]),
                          { icon: Package, label: 'My Orders', path: user?.role === 'user' ? '/account/orders' : '/orders' },
                          ...(user?.role === 'user' ? [{ icon: Heart, label: 'Wishlist', path: '/wishlist' }] : []),
                          { icon: User, label: 'Profile', path: '/profile' },
                        ].map(item => (
                          <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 1rem', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#a855f7'; e.currentTarget.style.background = 'rgba(168,85,247,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}>
                            <item.icon size={15} />
                            {item.label}
                          </Link>
                        ))}
                        <button onClick={handleLogout} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '0.65rem 1rem', width: '100%',
                          background: 'transparent', border: 'none', borderTop: '1px solid var(--border-color)',
                          color: '#f87171', cursor: 'pointer', fontSize: '0.88rem', transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <LogOut size={15} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to="/login">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      style={{ padding: '0.5rem 1rem', borderRadius: 10, border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setShowMobileMenu(!showMobileMenu)}
                style={{ padding: '0.5rem', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', display: 'none' }}
                className="mobile-menu-btn">
                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleSearch}
                style={{ overflow: 'hidden', marginTop: '0.75rem' }}
              >
                <div style={{ position: 'relative' }}>
                  <Search size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input ref={searchRef} type="text" value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for products, brands, categories..."
                    className="input-field"
                    style={{ paddingLeft: '2.5rem', paddingRight: '7rem' }} />
                  <button type="submit" className="btn-primary"
                    style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                    Search
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                overflow: 'hidden',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <div className="container" style={{ padding: '1rem 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {[{ label: 'Home', path: '/home' }, { label: 'Shop', path: '/shop' }].map(link => (
                    <Link key={link.path} to={link.path} style={{ padding: '0.65rem 0.75rem', borderRadius: 8, textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {link.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    <p style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Categories</p>
                    {CATEGORIES.map(cat => (
                      <Link key={cat.slug} to={`/shop?category=${cat.name}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 0.75rem', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', borderRadius: 8 }}>
                        <span>{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Height spacer */}
      <div style={{ height: 72 }} />

      {/* Click outside overlay */}
      {(showUserMenu || showSearch || showCategories) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => { setShowUserMenu(false); setShowSearch(false); setShowCategories(false); }} />
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
