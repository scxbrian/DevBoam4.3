const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
// Correctly import middleware
const { authenticateToken, checkTenant } = require('../middleware/auth'); 

// Create new shop
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, domain, designTheme, features, hostingTier, transactionFee } = req.body;
    // Use req.user.client which is consistent with checkTenant middleware
    const { userId, client: clientId } = req.user; 

    if (!name || !designTheme) {
      return res.status(400).json({ error: 'Shop name and design are required' });
    }

    const newShop = new Shop({
      client: clientId,
      name,
      domain,
      designTheme,
      features,
      hostingTier,
      transactionFee,
      createdBy: userId,
    });

    const savedShop = await newShop.save();

    res.status(201).json({
      message: 'Shop created successfully',
      shop: savedShop
    });

  } catch (error) {
    console.error('Shop creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A shop with this domain already exists.' });
    }
    res.status(500).json({ error: 'Failed to create shop' });
  }
});

// Get shops for a client - now using checkTenant middleware
router.get('/:clientId', [authenticateToken, checkTenant], async (req, res) => {
  try {
    const { clientId } = req.params;
    const shops = await Shop.find({ client: clientId }).sort({ createdAt: -1 });
    res.json({ shops });

  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ error: 'Failed to get shops' });
  }
});

// Update shop
router.put('/:shopId', authenticateToken, async (req, res) => {
  try {
    const { shopId } = req.params;
    const { name, domain, designTheme, features, hostingTier, status } = req.body;
    const { client: clientId, role } = req.user;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Check access permissions
    if (role === 'client' && shop.client.toString() !== clientId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { $set: { name, domain, designTheme, features, hostingTier, status } },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Shop updated successfully',
      shop: updatedShop
    });

  } catch (error) {
    console.error('Shop update error:', error);
     if (error.code === 11000) {
      return res.status(400).json({ error: 'A shop with this domain already exists.' });
    }
    res.status(500).json({ error: 'Failed to update shop' });
  }
});

// Delete shop
router.delete('/:shopId', authenticateToken, async (req, res) => {
  try {
    const { shopId } = req.params;
    const { role } = req.user;

    // Only admins can delete shops
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const deletedShop = await Shop.findByIdAndDelete(shopId);

    if (!deletedShop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({ message: 'Shop deleted successfully' });

  } catch (error) {
    console.error('Shop deletion error:', error);
    res.status(500).json({ error: 'Failed to delete shop' });
  }
});

module.exports = router;
