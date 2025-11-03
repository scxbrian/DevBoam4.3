
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Use MONGO_URI for Atlas connection, otherwise fall back to a local MongoDB instance.
    const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/devboma_db';
    
    await mongoose.connect(dbUrl);

    if (process.env.MONGO_URI) {
      console.log('✅ Database connected successfully to MongoDB Atlas');
    } else {
      console.log('✅ Database connected successfully to local MongoDB. Set MONGO_URI in your .env file to connect to MongoDB Atlas.');
    }
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
