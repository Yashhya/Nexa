const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const Product = require('../models/Product');

const getAI = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set in environment');
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const SYSTEM_PROMPT = `You are ARIA, the AI shopping assistant for NEXA — a premium futuristic e-commerce platform based in India.
You help users find products, make recommendations, navigate the website, answer shopping queries, and perform actions.
Be friendly, concise (2-3 sentences max unless explaining), enthusiastic, and helpful.

Currency: Indian Rupees (₹). Always format prices as ₹X,XXX.

When you need to perform an action, embed it ANYWHERE in your response as: [ACTION:{"type":"<action_type>","payload":<payload>}]

Available actions:
- navigate: {"type":"navigate","payload":{"path":"/page-url"}}
- filter_products: {"type":"filter_products","payload":{"category":"electronics","maxPrice":5000,"keyword":"phone"}}
- open_category: {"type":"open_category","payload":{"category":"electronics"}}
- add_to_cart: {"type":"add_to_cart","payload":{"productId":"<id>"}}
- show_products: {"type":"filter_products","payload":{"keyword":"shoes"}}

Current platform: NEXA — AI-powered smart shopping for India.`;

// POST /api/ai/chat
const aiChat = async (req, res) => {
  const { message, sessionId, context } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    // ── Product context enrichment ──────────────────────────────
    let productContext = '';
    const productKeywords = ['phone', 'laptop', 'shoe', 'dress', 'watch', 'headphone', 'camera',
      'tablet', 'perfume', 'bag', 'jacket', 'hoodie', 'sneaker', 'tv', 'earbuds', 'ps5',
      'xbox', 'sofa', 'lamp', 'wallet', 'sunglasses', 'jeans', 'skincare', 'serum', 'gaming'];
    const isProductQuery =
      productKeywords.some(k => message.toLowerCase().includes(k)) ||
      /show|find|search|recommend|suggest|buy|cheap|best|top|under ₹|budget/i.test(message);

    if (isProductQuery) {
      const priceMatch = message.match(/(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/gi);
      const maxPrice = priceMatch
        ? parseInt(priceMatch[priceMatch.length - 1].replace(/[₹rs.,\s]/gi, ''))
        : null;

      const searchQuery = { isActive: true, status: 'approved' };
      if (maxPrice && maxPrice > 100) searchQuery.price = { $lte: maxPrice };

      // keyword-based text search
      const textQuery = message.match(/\b(phone|laptop|shoe|shoe|headphone|watch|bag|dress|jacket|serum|perfume|earbuds|gaming|chair|sofa|lamp|wallet|sunglasses)\b/i);
      if (textQuery) searchQuery.$text = { $search: textQuery[0] };

      const relatedProducts = await Product.find(searchQuery)
        .sort({ ratings: -1 })
        .limit(5)
        .select('name price category ratings brand _id thumbnail');

      if (relatedProducts.length) {
        productContext = '\n\nRelevant products available:\n' +
          relatedProducts.map(p =>
            `• ${p.name} — ₹${p.price.toLocaleString('en-IN')} (${p.category}, ⭐ ${p.ratings.toFixed(1)}) [ID: ${p._id}]`
          ).join('\n');
      }
    }

    // ── Load chat history from DB ───────────────────────────────
    let chatHistory = [];
    let chatDoc = null;
    if (sessionId) {
      chatDoc = await Chat.findOne({ sessionId });
      if (chatDoc && chatDoc.messages.length > 0) {
        chatHistory = chatDoc.messages.slice(-12).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));
      }
    }

    const fullPrompt = [
      SYSTEM_PROMPT,
      `User context: page=${context?.currentPath || '/'}, loggedIn=${context?.isLoggedIn || false}`,
      productContext,
      `\nUser: ${message}`,
    ].join('\n');

    // ── Try models in order (quota fallback) ────────────────────
    const MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];
    let rawText = null;
    let lastError = null;

    for (const modelName of MODELS) {
      try {
        const genAI = getAI();
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { maxOutputTokens: 500, temperature: 0.75, topP: 0.9 },
        });
        const conversation = model.startChat({ history: chatHistory });
        const result = await conversation.sendMessage(fullPrompt);
        rawText = result.response.text();
        break;
      } catch (err) {
        lastError = err;
        if (!err.message?.includes('429') && !err.message?.includes('quota') && !err.message?.includes('not found')) throw err;
      }
    }

    if (!rawText) throw lastError;

    // ── Parse action from response ──────────────────────────────
    let action = null;
    const actionMatch = rawText.match(/\[ACTION:(\{.*?\})\]/s);
    if (actionMatch) {
      try { action = JSON.parse(actionMatch[1]); } catch { /* ignore parse errors */ }
    }
    const cleanResponse = rawText.replace(/\[ACTION:.*?\]/gs, '').trim();

    // ── Persist to DB ───────────────────────────────────────────
    if (sessionId) {
      if (!chatDoc) {
        chatDoc = await Chat.create({
          user: req.user?._id || null,
          sessionId,
          messages: [],
        });
      }
      chatDoc.messages.push({ role: 'user', content: message });
      chatDoc.messages.push({ role: 'assistant', content: cleanResponse, action });
      // Keep last 50 messages
      if (chatDoc.messages.length > 50) chatDoc.messages = chatDoc.messages.slice(-50);
      await chatDoc.save();
    }

    return res.json({ success: true, response: cleanResponse, action });
  } catch (error) {
    console.error('AI Error:', error.message);

    // Graceful fallback message
    const fallback = "I'm having a brief hiccup — please try again in a moment! Meanwhile, you can browse our shop or search for products directly. 😊";
    return res.status(500).json({
      success: false,
      message: error.message,
      response: fallback,
    });
  }
};

// GET /api/ai/recommendations
const getRecommendations = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true, status: 'approved' })
      .sort({ ratings: -1 })
      .limit(12)
      .select('-reviews -__v');
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { aiChat, getRecommendations };
