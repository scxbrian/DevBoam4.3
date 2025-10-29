
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// --- Schemas ---
const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  serviceTier: {
    type: String,
    default: 'lite',
    enum: ['lite', 'core', 'prime', 'titan', 'shop'],
  },
  contractValue: { type: Number, default: 0 },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'suspended', 'cancelled'],
  },
  notes: { type: String },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: 'client',
    enum: ['admin', 'client'],
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
}, { timestamps: true });

// --- Models ---
const Client = mongoose.model('Client', ClientSchema);
const User = mongoose.model('User', UserSchema);

// --- Database Setup ---
async function setupDatabase() {
  console.log('🚀 Setting up DevBoma database...');

  const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/devboma_db';

  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // --- Clear existing data ---
    await Client.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing data');

    // --- Create admin user ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    const admin = new User({
      name: 'DevBoma Admin',
      email: 'admin@devboma.com',
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();
    console.log('👑 Created admin user');

    // --- Create sample client ---
    const client = new Client({
      name: 'Demo Client',
      email: 'demo@devboma.com',
      serviceTier: 'shop',
    });
    await client.save();
    console.log('🏢 Created sample client');

    // --- Create sample client user ---
    const clientUser = new User({
      name: 'Demo User',
      email: 'demo@devboma.com',
      password: hashedPassword,
      client: client._id,
    });
    await clientUser.save();
    console.log('👤 Created sample client user');

    console.log('🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

// --- Run if called directly ---
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
