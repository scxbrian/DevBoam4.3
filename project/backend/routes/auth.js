const express = require('express');
const { admin } = require('../services/firebase');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Create user in Firebase
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });

    // Create a corresponding user in the local database
    const newUser = new User({ firebaseId: userRecord.uid, email, name, role: 'client' });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login (token is verified by middleware)
router.post('/login', authenticateToken, async (req, res) => {
  // If authenticateToken middleware succeeds, req.user is populated.
  // We can also fetch the full user profile with client data.
  const user = await User.findById(req.user._id).populate('client');
  res.json({ message: 'Login successful', user });
});


// Get current user profile (protected by middleware)
router.get('/me', authenticateToken, async (req, res) => {
  // The middleware has already verified the token and attached the user.
  // We just need to send it back, but we'll populate the client info first.
  try {
    const user = await User.findById(req.user._id).populate('client');
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

module.exports = router;
