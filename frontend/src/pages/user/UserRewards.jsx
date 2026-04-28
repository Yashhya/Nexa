import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Gift, Star, Copy, Tag, ArrowRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const coupons = [
  { code: 'WELCOME10', discount: '10% OFF', desc: 'On your next order', expiry: 'May 31, 2025', color: 'from-[#7c3aed] to-[#a855f7]' },
  { code: 'FREESHIP', discount: 'Free Shipping', desc: 'On orders above ₹499', expiry: 'Apr 30, 2025', color: 'from-[#0891b2] to-[#06b6d4]' },
];

const transactions = [
  { type: 'earned', desc: 'Order #NEX-1024 delivered', points: 250, date: 'Apr 24, 2025' },
  { type: 'earned', desc: 'Referral bonus – Riya S.', points: 100, date: 'Apr 18, 2025' },
  { type: 'spent', desc: 'Redeemed on #NEX-1011', points: -80, date: 'Apr 15, 2025' },
  { type: 'earned', desc: 'Review bonus', points: 50, date: 'Apr 10, 2025' },
];

export default function UserRewards() {
  const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}"!`);
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Rewards – NEXA Account</title></Helmet>

      <div>
        <h1 className="text-white text-xl font-black flex items-center gap-2">
          <Gift size={20} className="text-[#f59e0b]" /> Rewards & Coupons
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Your loyalty points and exclusive offers</p>
      </div>

      {/* Points Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-[#7c3aed]/30 via-[#0891b2]/20 to-transparent border border-[#7c3aed]/30 rounded-2xl p-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_60%)]" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-[#f59e0b] fill-[#f59e0b]" />
              <span className="text-[#f59e0b] text-sm font-bold uppercase tracking-widest">Loyalty Points</span>
            </div>
            <p className="text-white text-5xl font-black">{totalPoints.toLocaleString()}</p>
            <p className="text-slate-400 text-sm mt-1">≈ ₹{(totalPoints * 0.5).toFixed(0)} value</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-1">Your Tier</p>
            <div className="flex items-center gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl px-4 py-2">
              <Zap size={16} className="text-[#f59e0b]" />
              <span className="text-[#f59e0b] font-bold text-sm">Silver Member</span>
            </div>
            <p className="text-slate-500 text-xs mt-2">300 pts to Gold tier</p>
          </div>
        </div>
      </motion.div>

      {/* How to earn */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Make a Purchase', pts: '+100 pts', icon: '🛍️' },
          { label: 'Write a Review', pts: '+50 pts', icon: '⭐' },
          { label: 'Refer a Friend', pts: '+100 pts', icon: '👥' },
        ].map(({ label, pts, icon }) => (
          <div key={label} className="bg-[#0d0d17]/80 border border-white/5 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-white text-sm font-semibold">{label}</p>
              <p className="text-[#f59e0b] text-xs font-bold">{pts}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Coupons */}
      <div>
        <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Tag size={16} className="text-[#a855f7]" /> Your Coupons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((c) => (
            <div key={c.code} className={`bg-gradient-to-r ${c.color} rounded-2xl p-5 relative overflow-hidden`}>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-black/10 flex items-center justify-center" style={{ clipPath: 'circle(40% at 110% 50%)' }} />
              <p className="text-white/70 text-xs font-semibold mb-1">{c.desc}</p>
              <p className="text-white text-2xl font-black mb-1">{c.discount}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="bg-white/20 rounded-lg px-3 py-1.5 text-white font-mono text-sm font-bold tracking-widest">
                  {c.code}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-xs">Expires {c.expiry}</span>
                  <button onClick={() => copyCode(c.code)} className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all">
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#0d0d17]/80 border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-5">Points History</h2>
        <div className="space-y-3">
          {transactions.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-all">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.points > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <Star size={14} className={t.points > 0 ? 'text-green-400' : 'text-red-400'} />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{t.desc}</p>
                <p className="text-slate-500 text-xs">{t.date}</p>
              </div>
              <span className={`font-black text-sm ${t.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {t.points > 0 ? '+' : ''}{t.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
