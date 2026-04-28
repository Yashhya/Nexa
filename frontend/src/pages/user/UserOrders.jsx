import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Package, Search, Filter, ChevronRight, Download } from 'lucide-react';

const orders = [
  { id: '#NEX-1024', product: 'Sony WH-1000XM5', seller: 'ElectroHub', status: 'delivered', date: 'Apr 24, 2025', amount: 24990, items: 1, img: 'https://placehold.co/56x56/1e1b4b/a855f7?text=Sony' },
  { id: '#NEX-1019', product: 'Leather Biker Jacket', seller: 'FashionVault', status: 'shipped', date: 'Apr 21, 2025', amount: 8999, items: 1, img: 'https://placehold.co/56x56/1e1b4b/a855f7?text=Jacket' },
  { id: '#NEX-1011', product: 'Air Jordan 1 Retro', seller: 'StreetKicks', status: 'delivered', date: 'Apr 15, 2025', amount: 12499, items: 1, img: 'https://placehold.co/56x56/1e1b4b/a855f7?text=Jordan' },
  { id: '#NEX-1008', product: 'MacBook Pro M3 Case', seller: 'TechGear', status: 'cancelled', date: 'Apr 12, 2025', amount: 1299, items: 2, img: 'https://placehold.co/56x56/1e1b4b/a855f7?text=MacBook' },
  { id: '#NEX-1001', product: 'Slim Fit Jeans', seller: 'UrbanDenim', status: 'delivered', date: 'Apr 8, 2025', amount: 2199, items: 3, img: 'https://placehold.co/56x56/1e1b4b/a855f7?text=Jeans' },
];

const statusColors = {
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  placed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function UserOrders() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <Helmet><title>My Orders – NEXA</title></Helmet>

      <div>
        <h1 className="text-white text-xl font-black flex items-center gap-2"><Package size={20} className="text-[#a855f7]" /> My Orders</h1>
        <p className="text-slate-400 text-sm mt-0.5">Track and manage all your orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-[#0d0d17]/80 border border-white/5 rounded-xl px-3 py-2 flex-1">
          <Search size={14} className="text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="bg-transparent text-sm text-white placeholder-slate-500 outline-none flex-1" />
        </div>
        <div className="flex gap-2">
          {['all', 'placed', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === s ? 'bg-[#7c3aed] text-white' : 'bg-[#0d0d17]/80 border border-white/5 text-slate-400 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0d0d17]/80 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <img src={order.img} alt={order.product} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500 text-xs font-mono">{order.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-white font-semibold text-sm truncate">{order.product}</p>
                <p className="text-slate-500 text-xs">{order.seller} · {order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-black text-lg">₹{order.amount.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2 justify-end">
                  {order.status === 'delivered' && (
                    <button className="text-[10px] bg-[#7c3aed]/10 text-[#a855f7] border border-[#7c3aed]/20 px-2 py-1 rounded-lg hover:bg-[#7c3aed]/20 transition-all">
                      Return
                    </button>
                  )}
                  {order.status === 'placed' && (
                    <button className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-lg hover:bg-red-500/20 transition-all">
                      Cancel
                    </button>
                  )}
                  <button className="text-[10px] bg-white/5 text-slate-300 border border-white/10 px-2 py-1 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1">
                    <Download size={9} /> Invoice
                  </button>
                  <ChevronRight size={14} className="text-slate-500" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Package size={32} className="mx-auto mb-3 opacity-30" />
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
