import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { fetchFeatured, fetchTrending } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import { CATEGORIES } from '../utils/helpers';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featured, trending, isLoading } = useSelector(s => s.products);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchTrending());
  }, [dispatch]);

  const SkeletonCard = () => (
    <div className="product-card shimmer" style={{ height: '340px' }} />
  );

  return (
    <>
      <Helmet>
        <title>Home – NEXA AI Shopping</title>
        <meta name="description" content="Discover featured and trending products on NEXA. AI-powered recommendations just for you." />
      </Helmet>

      {/* Premium Hero Section */}
      <section className="pt-28 pb-12 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[2.5rem] overflow-hidden p-8 sm:p-16 lg:p-20"
            style={{ 
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.05) 50%, rgba(236,72,153,0.1) 100%)', 
              border: '1px solid var(--border-color)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/10 via-transparent to-[#06b6d4]/10" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6">
              
              <div className="flex-1 max-w-2xl">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="badge badge-purple mb-6 px-4 py-1.5 text-xs font-bold"
                >
                  <Sparkles size={12} className="mr-1" /> NEXT-GEN E-COMMERCE
                </motion.span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 font-['Space_Grotesk'] leading-[1.1] tracking-tight">
                  Hey, {user?.name?.split(' ')[0] || 'Shopper'} <span className="inline-block origin-bottom-right hover:animate-pulse">👋</span>
                </h1>
                <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
                  What are you looking for today? ARIA is ready to help you discover premium products tailored exactly to your taste.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base shadow-lg shadow-purple-500/30"
                    >
                      <ShoppingBag size={20} />
                      Shop Now
                    </motion.button>
                  </Link>
                  <Link to="/shop?category=Electronics">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base bg-white/5 backdrop-blur-md"
                    >
                      Browse Categories
                      <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Right Side Graphic */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="flex-1 hidden lg:flex justify-end relative"
              >
                <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent z-10 opacity-60" />
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" 
                    alt="Premium E-commerce" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-6 left-6 z-20 glass px-6 py-3 rounded-2xl flex items-center gap-4 border border-white/20">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">ARIA AI</p>
                      <p className="text-cyan-300 text-xs font-medium">Ready to assist</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="container">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl font-black text-white font-['Space_Grotesk'] mb-3">Shop by Category</h2>
            <p className="text-slate-400 max-w-md">Explore our curated collections of premium products across multiple categories.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.slug} to={`/shop?category=${cat.name}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-[var(--bg-card)] rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center border border-[var(--border-color)] hover:border-purple-500 hover:shadow-[0_15px_35px_rgba(168,85,247,0.15)] transition-all cursor-pointer group aspect-square"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/5 to-white/10 mb-4 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:scale-110 transition-all duration-300 shadow-inner">
                    <span className="text-3xl drop-shadow-md">{cat.icon}</span>
                  </div>
                  <p className="text-white font-bold text-sm group-hover:text-purple-300 transition-colors">{cat.name}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 px-4">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="badge badge-purple mb-2"><Sparkles size={10} /> Curated</span>
              <h2 className="text-2xl font-bold text-white">Featured Products</h2>
            </div>
            <Link to="/shop?sort=featured">
              <button className="btn-outline text-sm px-4 py-2 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoading
              ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : featured.slice(0, 10).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
            }
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-10 px-4 mb-10">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="badge badge-red mb-2">🔥 Hot Right Now</span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp size={22} className="text-orange-400" /> Trending
              </h2>
            </div>
            <Link to="/shop?sort=trending">
              <button className="btn-outline text-sm px-4 py-2 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoading
              ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : trending.slice(0, 10).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
