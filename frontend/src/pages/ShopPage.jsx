import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { fetchProducts, setFilters, clearFilters } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import { CATEGORIES, debounce } from '../utils/helpers';

const ShopPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, total, pages, isLoading, filters } = useSelector(s => s.products);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const cat = searchParams.get('category');
    const sort = searchParams.get('sort');
    if (cat) dispatch(setFilters({ category: cat }));
    if (sort) dispatch(setFilters({ sort }));
  }, []);

  useEffect(() => { dispatch(fetchProducts(filters)); }, [filters, dispatch]);

  const debouncedSearch = useCallback(
    debounce((val) => dispatch(setFilters({ keyword: val, page: 1 })), 500), [dispatch]
  );

  const handleSearch = (e) => { setLocalSearch(e.target.value); debouncedSearch(e.target.value); };
  const handleCategory = (cat) => dispatch(setFilters({ category: cat === filters.category ? '' : cat, page: 1 }));
  const handleSort = (sort) => dispatch(setFilters({ sort, page: 1 }));
  const handlePage = (page) => dispatch(setFilters({ page }));

  const sortOptions = [
    { val: 'newest', label: 'Newest First' },
    { val: 'price_asc', label: 'Price: Low to High' },
    { val: 'price_desc', label: 'Price: High to Low' },
    { val: 'rating', label: 'Top Rated' },
    { val: 'trending', label: 'Trending' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <Helmet>
        <title>Shop – NEXA | Explore Products</title>
        <meta name="description" content="Browse premium products across electronics, fashion, beauty and more on NEXA." />
      </Helmet>
      <div className="container">
        <div className="mb-8">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
            {filters.category || 'All Products'}
          </motion.h1>
          <p style={{ color: 'var(--text-secondary)' }}>{total} products found</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="shop-search" type="text" placeholder="Search products..." value={localSearch}
              onChange={handleSearch} className="input-field pl-10 py-2.5" />
            {localSearch && <button onClick={() => { setLocalSearch(''); dispatch(setFilters({ keyword: '', page: 1 })); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X size={14} /></button>}
          </div>
          <select value={filters.sort} onChange={e => handleSort(e.target.value)}
            className="input-field py-2.5 cursor-pointer" style={{ minWidth: '180px' }}>
            {sortOptions.map(o => <option key={o.val} value={o.val} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{o.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(s => !s)}
            className={`btn-outline flex items-center gap-2 py-2.5 ${showFilters ? 'bg-purple-500/20' : ''}`}>
            <SlidersHorizontal size={16} /> Filters
          </button>
          {(filters.category || filters.minPrice || filters.maxPrice) && (
            <button onClick={() => { dispatch(clearFilters()); setLocalSearch(''); }}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <div className="glass rounded-2xl p-6 border border-purple-500/15">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-sm">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat.slug} onClick={() => handleCategory(cat.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            filters.category === cat.name
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'border-purple-500/20 text-slate-400 hover:border-purple-500/50 hover:text-white'}`}>
                          {cat.icon} {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-sm">Price Range (₹)</h3>
                    <div className="flex gap-2 items-center">
                      <input type="number" placeholder="Min" value={filters.minPrice}
                        onChange={e => dispatch(setFilters({ minPrice: e.target.value, page: 1 }))}
                        className="input-field py-2 text-sm" />
                      <span className="text-slate-500">–</span>
                      <input type="number" placeholder="Max" value={filters.maxPrice}
                        onChange={e => dispatch(setFilters({ maxPrice: e.target.value, page: 1 }))}
                        className="input-field py-2 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="shimmer rounded-2xl" style={{ height: '340px' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Filter size={60} className="text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No products found</h2>
            <p className="text-slate-400 mb-6">Try different filters or search terms</p>
            <button onClick={() => { dispatch(clearFilters()); setLocalSearch(''); }} className="btn-outline">Clear Filters</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => handlePage(filters.page - 1)} disabled={filters.page <= 1}
              className="w-9 h-9 rounded-lg glass border border-purple-500/20 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => handlePage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  filters.page === page
                    ? 'bg-gradient-to-br from-purple-600 to-cyan-600 text-white'
                    : 'glass border border-purple-500/20 text-slate-400 hover:text-white'}`}>
                {page}
              </button>
            ))}
            <button onClick={() => handlePage(filters.page + 1)} disabled={filters.page >= pages}
              className="w-9 h-9 rounded-lg glass border border-purple-500/20 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
