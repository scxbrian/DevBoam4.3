
const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { checkTenant } = require('../middleware/auth');

// @route   POST /api/clients
// @desc    Add a new client
// @access  Tenant-specific
router.post('/', checkTenant, async (req, res) => {
  const { name, email } = req.body;
  const shopId = req.headers['x-tenant-id'];

  try {
    let client = await Client.findOne({ email, shop: shopId });

    if (client) {
      return res.status(400).json({ msg: 'Client already exists for this shop' });
    }

    client = new Client({
      name,
      email,
      shop: shopId,
    });

    await client.save();
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/clients
// @desc    Get all clients for a shop
// @access  Tenant-specific
router.get('/', checkTenant, async (req, res) => {
  const shopId = req.headers['x-tenant-id'];

  try {
    const clients = await Client.find({ shop: shopId });
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
