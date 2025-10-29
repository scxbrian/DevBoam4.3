const express = require('express');
const { Client } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Get client dashboard
router.get('/:clientId/dashboard', async (req, res) => {
  try {
    const { clientId } = req.params;

    if (req.user.role === 'client' && req.user.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ client });
  } catch (error) {
    console.error('Get client dashboard error:', error);
    res.status(500).json({ error: 'Failed to get client dashboard' });
  }
});

module.exports = router;
