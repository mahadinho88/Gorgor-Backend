require('dotenv').config();

// Log startup info
console.log('='.repeat(60));
console.log('🚀 STARTING GAD AMA GADO BACKEND SERVER');
console.log('='.repeat(60));
console.log('📊 Environment Check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('  - PORT:', process.env.PORT || 'NOT SET');
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? 'SET ✅' : 'NOT SET ❌');
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✅' : 'NOT SET ❌');
console.log('  - JWT_EXPIRE:', process.env.JWT_EXPIRE || 'NOT SET');
console.log('  - CORS_ORIGIN:', process.env.CORS_ORIGIN || 'NOT SET');
console.log('='.repeat(60));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
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
