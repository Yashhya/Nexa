import React, { useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import {
  Zap, ShoppingBag, Sparkles, ArrowRight, Shield,
  Truck, HeadphonesIcon, ChevronDown
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { CATEGORIES } from '../utils/helpers';

const FloatingOrb = ({ position, color, speed = 2, distort = 0.3, scale = 1 }) => (
  <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial color={color} distort={distort} speed={speed} roughness={0.1} metalness={0.8} transparent opacity={0.7} />
    </mesh>
  </Float>
);

const HeroScene = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
    <ambientLight intensity={0.3} />
    <pointLight position={[5, 5, 5]} intensity={3} color="#a855f7" />
    <pointLight position={[-5, -3, 2]} intensity={2} color="#06b6d4" />
    <pointLight position={[0, -5, -5]} intensity={1.5} color="#ec4899" />
    <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
    <Suspense fallback={null}>
      <FloatingOrb position={[3, 1, -2]} color="#7c3aed" speed={1.5} distort={0.4} scale={1.5} />
      <FloatingOrb position={[-3, -1, -3]} color="#0891b2" speed={2} distort={0.3} scale={1} />
      <FloatingOrb position={[0, 3, -4]} color="#be185d" speed={1.8} distort={0.5} scale={0.8} />
      <FloatingOrb position={[-2, 2, -1]} color="#5b21b6" speed={1.2} distort={0.2} scale={0.6} />
    </Suspense>
  </Canvas>
);

const LandingPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stats = [
    { val: '50K+', label: 'Happy Customers' },
    { val: '10K+', label: 'Premium Products' },
    { val: '99.8%', label: 'Satisfaction Rate' },
    { val: '4.9★', label: 'App Rating' },
  ];

  const features = [
    { icon: Sparkles, title: 'AI Shopping Assistant', desc: 'ARIA helps you find perfect products with voice commands and smart recommendations', color: 'purple' },
    { icon: Shield, title: 'Secure Payments', desc: 'End-to-end encrypted Razorpay payments with multiple payment options', color: 'cyan' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders above ₹999. Express delivery in 2–3 days', color: 'pink' },
    { icon: HeadphonesIcon, title: '24/7 AI Support', desc: 'ARIA is always available to assist you with queries and issues', color: 'green' },
  ];

  return (
    <>
      <Helmet>
        <title>NEXA – AI-Powered Next-Gen Shopping</title>
        <meta name="description" content="Experience the future of shopping with NEXA. AI-powered recommendations, 3D virtual assistant, 10,000+ premium products." />
      </Helmet>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* 3D bg */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <HeroScene />
        </div>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <motion.div style={{ y, opacity, position: 'relative', zIndex: 10, textAlign: 'center', width: '100%' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>



            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                fontWeight: 900, lineHeight: 1.05,
                marginBottom: '1.5rem',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
              <span style={{ color: 'var(--text-primary)' }}>Shop </span>
              <span className="gradient-text text-glow">Smarter</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>with </span>
              <span className="gradient-text-warm">AI Power</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                maxWidth: 580, marginBottom: '2.5rem', lineHeight: 1.75,
              }}>
              Meet <strong style={{ color: '#22d3ee' }}>ARIA</strong>, your AI shopping companion. Voice-controlled, 3D-animated, always available. Discover 10,000+ premium products curated just for you.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
              <Link to="/home" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary"
                  style={{ fontSize: '1rem', padding: '0.9rem 2rem', gap: '0.5rem' }}>
                  <ShoppingBag size={20} /> Start Shopping <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-outline"
                  style={{ fontSize: '1rem', padding: '0.9rem 2rem', gap: '0.5rem' }}>
                  <Zap size={18} /> Join Free
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: 560, width: '100%' }}>
              {stats.map((s, i) => (
                <div key={i} className="glass" style={{
                  borderRadius: 14, padding: '1rem',
                  border: '1px solid rgba(168,85,247,0.12)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">{s.val}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3 }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'var(--text-muted)' }}>
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-header">
            <span className="badge badge-purple">Explore</span>
            <h2>Shop By Category</h2>
            <p>Find what you're looking for across our curated collections</p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1.25rem',
          }}>
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.slug} to={`/shop?category=${cat.name}`} style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.06, y: -5 }}
                  className="glass"
                  style={{
                    borderRadius: 18, padding: '1.75rem 1rem',
                    textAlign: 'center',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(168,85,247,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <span style={{ fontSize: '2.25rem', display: 'block', marginBottom: '0.75rem' }}>{cat.icon}</span>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>{cat.name}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.06) 0%, transparent 65%)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-header">
            <span className="badge badge-cyan">Why NEXA?</span>
            <h2>The Future of Shopping</h2>
            <p>Built for the next generation of shoppers</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass"
                style={{
                  borderRadius: 20, padding: '1.75rem',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.35s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(168,85,247,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: 'rgba(168,85,247,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <f.icon size={24} color="#a855f7" />
                </div>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              borderRadius: 28, overflow: 'hidden', padding: 'clamp(2.5rem, 6vw, 4rem)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.28) 0%, rgba(6,182,212,0.18) 50%, rgba(236,72,153,0.18) 100%)',
              border: '1px solid rgba(168,85,247,0.3)',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(76,29,149,0.3), transparent, rgba(8,145,178,0.2))' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Sparkles size={44} color="#22d3ee" style={{ margin: '0 auto 1.25rem' }} />
              <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Try ARIA for Free Today
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.7 }}>
                Experience AI-powered shopping. Ask ARIA to find products, compare items, or place orders — all with your voice!
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2rem', gap: '0.5rem' }}>
                    Get Started Free <ArrowRight size={18} />
                  </button>
                </Link>
                <Link to="/shop" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                    Explore Products
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
