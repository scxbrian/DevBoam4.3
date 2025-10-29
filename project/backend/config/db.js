
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/devboma_db';
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
