import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Phone, MapPin, Save, Lock, Eye, EyeOff, ShoppingBag, Heart } from 'lucide-react';
import { updateProfile } from '../store/slices/authSlice';
import { formatDate } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [o, w] = await Promise.all([api.get('/orders/my'), api.get('/wishlist')]);
        setStats({ orders: o.data.orders?.length || 0, wishlist: w.data.wishlist?.products?.length || 0 });
      } catch {}
    })();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success('Profile updated! ✅');
    } catch (err) { toast.error(err || 'Update failed'); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await api.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password updated! 🔒');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update password'); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <Helmet>
        <title>My Profile – NEXA</title>
        <meta name="description" content="Manage your NEXA account profile and settings." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 border border-purple-500/20 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-black text-white">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            <p className="text-slate-400 text-sm mb-3">{user?.email}</p>
            <p className="text-slate-500 text-xs">Member since {formatDate(user?.createdAt || new Date())}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1.5 mb-1">
                <ShoppingBag size={16} className="text-purple-400" />
                <span className="text-2xl font-black text-white">{stats.orders}</span>
              </div>
              <p className="text-slate-500 text-xs">Orders</p>
            </div>
            <div className="w-px bg-purple-500/20" />
            <div className="text-center">
              <div className="flex items-center gap-1.5 mb-1">
                <Heart size={16} className="text-pink-400" />
                <span className="text-2xl font-black text-white">{stats.wishlist}</span>
              </div>
              <p className="text-slate-500 text-xs">Wishlist</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                  : 'glass border border-purple-500/20 text-slate-400 hover:text-white'}`}>
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <User size={20} className="text-purple-400" /> Personal Information
            </h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium block mb-2">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field pl-10" placeholder="Your name" required />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-field pl-10" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium block mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="input-field pl-10" placeholder="9876543210" />
                </div>
              </div>
              <motion.button type="submit" disabled={isLoading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2 py-2.5 px-6">
                {isLoading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Save size={16} /> Save Changes</>}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Lock size={20} className="text-purple-400" /> Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              {[
                { key: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
                { key: 'newPassword', label: 'New Password', placeholder: 'Min. 6 characters' },
                { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-slate-300 text-sm font-medium block mb-2">{f.label}</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type={showPw ? 'text' : 'password'} value={pwForm[f.key]}
                      onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="input-field pl-10 pr-10" placeholder={f.placeholder} required />
                    {f.key === 'newPassword' && (
                      <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2 py-2.5 px-6">
                <Lock size={16} /> Update Password
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
