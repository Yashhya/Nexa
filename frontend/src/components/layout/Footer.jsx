import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe, MessageCircle, Share2, Code2, Mail, Phone, MapPin } from 'lucide-react';
import { CATEGORIES } from '../../utils/helpers';

const Footer = () => {
  return (
    <footer style={{
      position: 'relative',
      marginTop: '5rem',
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      transition: 'background 0.4s ease',
    }}>
      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)',
      }} />

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} className="glow-purple">
                <Zap size={16} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}
                className="gradient-text">NEXA</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: 260 }}>
              Next-generation AI-powered shopping. Discover premium products with intelligent recommendations.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[Globe, MessageCircle, Share2, Code2].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: '1px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-input)',
                  transition: 'all 0.25s',
                  textDecoration: 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a855f7'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(168,85,247,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Home', path: '/home' },
                { label: 'Shop All', path: '/shop' },
                { label: 'My Orders', path: '/orders' },
                { label: 'Wishlist', path: '/wishlist' },
                { label: 'My Profile', path: '/profile' },
              ].map(item => (
                <li key={item.path}>
                  <Link to={item.path} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: 'var(--text-secondary)', fontSize: '0.875rem',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(168,85,247,0.4)', flexShrink: 0 }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link to={`/shop?category=${cat.name}`} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    color: 'var(--text-secondary)', fontSize: '0.875rem',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                    <span>{cat.icon}</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { icon: MapPin, text: 'NEXA Tech Park, Cyber City, Mumbai 400001' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'support@nexa.shop' },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  <Icon size={15} style={{ color: '#a855f7', flexShrink: 0, marginTop: 2 }} />
                  {text}
                </li>
              ))}
            </ul>
            <div style={{
              padding: '0.875rem', borderRadius: 12,
              background: 'rgba(168,85,247,0.06)',
              border: '1px solid rgba(168,85,247,0.15)',
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
                Get AI-curated deals in your inbox
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <input type="email" placeholder="your@email.com"
                  className="input-field"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem 0.75rem' }} />
                <button className="btn-primary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem', borderRadius: 8, flexShrink: 0 }}>
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>© 2025 NEXA. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['Privacy', 'Terms', 'Refund Policy'].map(l => (
              <a key={l} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.825rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                {l}
              </a>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            Built with <span style={{ color: '#f87171' }}>♥</span> & Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
