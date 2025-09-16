const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
require('dotenv').config({ path: './.env' });

const app = express();

// --- Check for critical env variables ---
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in config.env");
  process.exit(1);
}

// --- Middleware ---
app.use(cors());
app.use(helmet()); // Adds security headers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth', require('./routes/auth'));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ message: 'TNP Server is running!', status: 'OK' });
});

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// --- 404 handler ---
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Database connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tnp-website');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n🔧 To fix this issue:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your MONGODB_URI in server/config.env');
    console.log('3. See MONGODB_SETUP.md for detailed instructions');
    console.log('\n📝 Quick setup options:');
    console.log('- Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('- Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('- Use Docker: docker run -d -p 27017:27017 mongo');
    console.log('\n⏳ Server will continue running but database features will not work...\n');
  }
};

// --- Start server regardless of database connection ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log(`🔗 API: http://localhost:5000`);
  console.log(`❤️  Health: http://localhost:5000/api/health\n`);
});

// --- Connect to database ---
connectDB();
