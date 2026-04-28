const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ─── Socket.IO ───────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Attach io to every request so controllers can emit events
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Join user-specific room for private notifications
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Join admin room
  socket.on('join_admin', () => {
    socket.join('admin_room');
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in controllers
module.exports.io = io;

// ─── Security Middleware ──────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));
app.use(cookieParser());

// ─── Rate Limiting ────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// ─── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── MongoDB Connection ───────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    setTimeout(connectDB, 5000); // retry after 5 seconds
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected — retrying...');
  setTimeout(connectDB, 5000);
});

connectDB();

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart',       require('./routes/cartRoutes'));
app.use('/api/wishlist',   require('./routes/wishlistRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/payments',   require('./routes/paymentRoutes'));
app.use('/api/reviews',    require('./routes/reviewRoutes'));
app.use('/api/coupons',    require('./routes/couponRoutes'));
app.use('/api/ai',         require('./routes/aiRoutes'));
app.use('/api/admin',      require('./routes/adminRoutes'));
app.use('/api/seller',     require('./routes/sellerRoutes'));
app.use('/api/analytics',  require('./routes/analyticsRoutes'));
app.use('/api/upload',     require('./routes/uploadRoutes'));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 NEXA API is running!',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌', err.message);

  // Mongoose CastError
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }
  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  // Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired, please login again' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 NEXA Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO ready`);
});
