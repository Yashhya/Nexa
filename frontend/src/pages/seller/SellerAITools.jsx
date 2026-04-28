import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Tag, TrendingUp, Copy, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AITools() {
  const [activeTab, setActiveTab] = useState('description');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'description', label: 'Product Description', icon: Wand2 },
    { id: 'seo', label: 'SEO Title', icon: Tag },
    { id: 'pricing', label: 'Pricing Suggestion', icon: TrendingUp },
    { id: 'insights', label: 'Sales Insights', icon: Sparkles },
  ];

  const prompts = {
    description: `Write a compelling, SEO-optimized product description for: "${input}". Include key features, benefits, and a call to action. Keep it under 200 words.`,
    seo: `Generate 3 SEO-optimized product titles for: "${input}". Each title should be under 70 characters, include important keywords, and be compelling for e-commerce.`,
    pricing: `Based on the product: "${input}", suggest a competitive pricing strategy for the Indian market. Include price range, discounts, and positioning tips.`,
    insights: `Provide market insights and sales tips for selling: "${input}" on an Indian e-commerce platform. Include target audience, best selling season, and marketing angles.`,
  };

  const handleGenerate = async () => {
    if (!input.trim()) return toast.error('Please describe your product first');
    setLoading(true);
    setResult('');
    try {
      const token = localStorage.getItem('nexaToken');
      const { data } = await axios.post('/api/ai/chat', {
        message: prompts[activeTab],
      }, { headers: { Authorization: `Bearer ${token}` } });
      setResult(data.reply || data.message || 'Generated content will appear here');
    } catch (err) {
      // Fallback demo content
      const demoContent = {
        description: `✨ **${input || 'Premium Product'}**\n\nElevate your lifestyle with this exceptional product, crafted for those who demand nothing but the best. Featuring premium materials and meticulous attention to detail, this product delivers unmatched quality and performance.\n\n**Key Features:**\n• Premium quality construction\n• Ergonomic design for maximum comfort\n• Long-lasting durability\n• Stylish aesthetic that complements any setting\n\nPerfect for everyday use. Order now and experience the difference quality makes!`,
        seo: `1. "${input} - Premium Quality | Best Price in India | NEXA"\n2. "Buy ${input} Online | Authentic & Affordable | Free Shipping"\n3. "${input} | Top Rated | 10,000+ Happy Customers | Shop Now"`,
        pricing: `**Recommended Pricing for "${input}":**\n\n• **MRP:** ₹4,999\n• **Sale Price:** ₹3,499 (30% off)\n• **Flash Sale:** ₹2,999 (40% off)\n\n**Strategy:**\n- Position in mid-premium segment\n- Offer first-purchase discount (10%)\n- Bundle deals for higher cart value\n- Seasonal discounts during festive sales`,
        insights: `**Market Insights for "${input}":**\n\n📈 **Demand:** High and growing, especially among 22-35 age group\n🎯 **Target Audience:** Urban professionals and students\n📅 **Best Selling Season:** Festive season (Oct-Nov) and New Year\n\n**Marketing Tips:**\n• Use Instagram & YouTube for visual showcasing\n• Collaborate with micro-influencers\n• Highlight value-for-money in listings\n• Respond quickly to customer queries to boost ratings`,
      };
      setResult(demoContent[activeTab]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <Helmet><title>AI Seller Tools – NEXA</title></Helmet>

      <div>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={26} color="#a855f7" /> AI Seller Tools
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Powered by AI to supercharge your listings</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setResult(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.25rem', borderRadius: 12,
                fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s', cursor: 'pointer',
                background: isActive ? 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))' : 'var(--bg-card)',
                color: isActive ? '#a855f7' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(168,85,247,0.3)' : '1px solid var(--border-color)',
                boxShadow: isActive ? '0 4px 12px rgba(168,85,247,0.1)' : 'none'
              }}
            >
              <Icon size={16} /> {label}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>Describe your product</label>
        <textarea
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="e.g., Premium noise-cancelling wireless headphones with 30hr battery life, ideal for professionals"
          rows={4}
          style={{
            width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 16,
            padding: '1.25rem', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', resize: 'none',
            transition: 'border 0.2s, box-shadow 0.2s'
          }}
          onFocus={e => { e.target.style.borderColor = '#a855f7'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          onClick={handleGenerate} disabled={loading || !input.trim()}
          style={{
            marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', fontSize: '0.95rem', fontWeight: 800,
            padding: '0.85rem 2rem', borderRadius: 12, border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1, transition: 'all 0.2s', boxShadow: '0 8px 16px rgba(168,85,247,0.25)'
          }}
          onMouseOver={e => { if(!loading && input.trim()) e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseOut={e => { if(!loading && input.trim()) e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {loading ? <Loader size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.03), rgba(6,182,212,0.03))',
            border: '1px solid rgba(168,85,247,0.3)', borderRadius: 20, padding: '1.5rem', boxShadow: '0 10px 30px rgba(168,85,247,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ color: '#a855f7', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={16} /> AI Generated Result
            </span>
            <button onClick={handleCopy} style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600,
              background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: copied ? '#22c55e' : 'var(--text-secondary)',
              padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {copied ? <CheckCircle size={14} color="#22c55e" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{
            color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: "'Inter', sans-serif"
          }}>
            {result}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
