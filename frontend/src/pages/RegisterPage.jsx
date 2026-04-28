import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { register, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(s => s.auth);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      const result = await dispatch(register({ name: form.name, email: form.email, password: form.password })).unwrap();
      toast.success('Account created! Welcome to NEXA 🚀');
      const role = result?.user?.role;
      if (role === 'admin') navigate('/admin', { replace: true });
      else if (role === 'seller') navigate('/seller', { replace: true });
      else navigate('/home', { replace: true });
    } catch {}
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', position: 'relative', overflow: 'hidden',
      backgroundColor: 'var(--bg-primary)', fontFamily: "'Inter', sans-serif"
    }}>
      <Helmet>
        <title>Create Account – NEXA</title>
        <meta name="description" content="Join NEXA for free and experience premium shopping." />
      </Helmet>

      {/* Soft gradient accents */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-10%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 60%)',
          borderRadius: '50%', filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-10%', width: '35vw', height: '35vw',
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 60%)',
          borderRadius: '50%', filter: 'blur(60px)'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(124,58,237,0.2)'
            }}>
              <Zap size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NEXA
            </span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join thousands of smart shoppers</p>
        </div>

        {/* Premium Auth Card */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 24, padding: '2.5rem',
          boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-color)',
          backdropFilter: 'blur(20px)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text" placeholder="John Doe" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: 'var(--bg-input)', border: '1.5px solid var(--border-color)',
                    borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem',
                    outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: 'var(--bg-input)', border: '1.5px solid var(--border-color)',
                    borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem',
                    outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{
                    width: '100%', padding: '0.85rem 2.75rem 0.85rem 2.75rem',
                    background: 'var(--bg-input)', border: '1.5px solid var(--border-color)',
                    borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem',
                    outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password" placeholder="Repeat password" value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: 'var(--bg-input)', border: '1.5px solid var(--border-color)',
                    borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem',
                    outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.01, translateY: -1 }} whileTap={{ scale: 0.99 }}
              style={{
                width: '100%', padding: '0.85rem', marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: 'white',
                border: 'none', borderRadius: 12, fontSize: '0.95rem', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(124,58,237,0.3)', transition: 'box-shadow 0.2s'
              }}
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
