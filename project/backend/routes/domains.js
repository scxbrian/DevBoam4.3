const express = require('express');
const router = express.Router();
const Domain = require('../models/Domain');
const Shop = require('../models/Shop');
const { authenticateToken, checkTenant } = require('../middleware/auth');
const crypto = require('crypto');

// Add a custom domain to a shop
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { domain, shopId } = req.body;
    const { client: clientId, role } = req.user;

    if (!domain || !shopId) {
      return res.status(400).json({ error: 'Domain and shop ID are required' });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (role === 'client' && shop.client.toString() !== clientId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const existingDomain = await Domain.findOne({ domain });
    if (existingDomain) {
      return res.status(400).json({ error: 'Domain already in use' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newDomain = new Domain({
      domain,
      shop: shopId,
      client: clientId,
      verificationToken,
      status: 'pending'
    });

    const savedDomain = await newDomain.save();

    res.status(201).json({ 
        message: 'Domain added successfully', 
        domain: savedDomain 
    });

  } catch (error) {
    console.error('Add domain error:', error);
    res.status(500).json({ error: 'Failed to add domain' });
  }
});

// Get domains for a client
router.get('/:clientId', [authenticateToken, checkTenant], async (req, res) => {
    try {
        const { clientId } = req.params;
        const domains = await Domain.find({ client: clientId }).populate('shop', 'name');
        res.json({ domains });

    } catch (error) {
        console.error('Get domains error:', error);
        res.status(500).json({ error: 'Failed to get domains' });
    }
});

// Delete a domain
router.delete('/:domainId', authenticateToken, async (req, res) => {
  try {
    const { domainId } = req.params;
    const { client: clientId, role } = req.user;

    const domain = await Domain.findById(domainId);

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    if (role === 'client' && domain.client.toString() !== clientId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Domain.findByIdAndDelete(domainId);

    res.json({ message: 'Domain deleted successfully' });

  } catch (error) {
    console.error('Delete domain error:', error);
    res.status(500).json({ error: 'Failed to delete domain' });
  }
});


module.exports = router;
