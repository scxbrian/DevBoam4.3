const express = require('express');
const { admin } = require('../services/firebase');
const { User, Client } = require('../models');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

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

// User login (token generation is handled client-side with Firebase SDK)
router.post('/login', async (req, res) => {
    // Client sends Firebase ID token in Authorization header
    // The authenticateToken middleware will verify it.
    // If verified, req.user will be populated.
    res.json({ message: 'Login successful', user: req.user });
});


// Get current user profile
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await User.findOne({ firebaseId: decodedToken.uid }).populate('client');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;
