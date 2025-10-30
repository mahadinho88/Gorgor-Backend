require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Log startup info
console.log('='.repeat(60));
console.log('🚀 STARTING GAD AMA GADO BACKEND SERVER v2.0');
console.log('='.repeat(60));
console.log('📊 Environment Check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('  - PORT:', process.env.PORT || 'NOT SET');
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? 'SET ✅' : 'NOT SET ❌');
console.log('  - SESSION_SECRET:', process.env.SESSION_SECRET ? 'SET ✅' : 'NOT SET ❌');
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✅' : 'NOT SET ❌');
console.log('  - JWT_EXPIRE:', process.env.JWT_EXPIRE || 'NOT SET');
console.log('  - CORS_ORIGIN:', process.env.CORS_ORIGIN || 'NOT SET');
console.log('='.repeat(60));

const app = express();

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'gorgor-marketplace-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    sameSite: 'lax'
  }
}));

// Middleware - CORS with flexible configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow all origins if CORS_ORIGIN is not set (development)
    if (allowedOrigins.length === 0) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    // Allow localhost and file:// for development
    if (origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1') || 
        origin.startsWith('file://')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires']
}));
// Log CORS configuration
console.log('🔒 CORS Configuration:');
if (allowedOrigins.length > 0) {
  console.log('  - Allowed Origins:', allowedOrigins.join(', '));
} else {
  console.log('  - Mode: Allow All Origins (Development)');
}
console.log('  - Credentials: Enabled');
console.log('  - File Protocol: Allowed');
console.log('  - Localhost: Allowed');
console.log('='.repeat(60));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = async () => {
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('❌ FATAL ERROR: MONGODB_URI environment variable is not set!');
      console.error('Please add MONGODB_URI in your environment variables.');
      process.exit(1);
    }
    
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Database: ${conn.connection.name}`);
    console.log(`📍 Host: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Full error:', err);
    console.log('⚠️  Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adRoutes = require('./routes/ads');

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/ads', adRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GAD AMA GADO API is running! 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      ads: '/api/v1/ads'
    }
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     🚀 GAD AMA GADO Backend Server Running!          ║
║                                                       ║
║     📡 Port: ${PORT}                                     ║
║     🌍 Environment: ${process.env.NODE_ENV}                     ║
║     🔗 API: http://localhost:${PORT}/api/v1             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;