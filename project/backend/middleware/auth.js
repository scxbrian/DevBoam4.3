const { admin } = require('../services/firebase');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseId: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found in local database' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
};

const checkTenant = (req, res, next) => {
  const { clientId } = req.params;
  
  if (req.user.role === 'admin') {
    return next(); // Admins can access any client's data
  }
  
  if (req.user.role === 'client' && req.user.client.toString() === clientId) {
    return next(); // Clients can only access their own data
  }
  
  return res.status(403).json({ error: 'Forbidden: You do not have access to this resource' });
};

module.exports = { authenticateToken, checkTenant };
