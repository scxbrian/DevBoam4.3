
const express = require('express');
const { Client, Order, Shop, ActivityLog } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Middleware to check admin access
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.use(authenticateToken, requireAdmin);

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } },
    ]);

    const clientCounts = await Client.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const shopCounts = await Shop.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const tierRevenue = await Client.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'client',
          as: 'orders',
        },
      },
      { $unwind: '$orders' },
      { $match: { 'orders.status': 'completed' } },
      {
        $group: {
          _id: '$serviceTier',
          revenue: { $sum: '$orders.total_amount' },
        },
      },
    ]);

    const stats = {
      revenue: {
        total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      },
      clients: {
        total: clientCounts.reduce((acc, curr) => acc + curr.count, 0),
        active: clientCounts.find(c => c._id === 'active')?.count || 0,
      },
      shops: {
        total: shopCounts.reduce((acc, curr) => acc + curr.count, 0),
        active: shopCounts.find(c => c._id === 'active')?.count || 0,
      },
      tierRevenue,
    };

    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to get platform statistics' });
  }
});

// Get all clients
router.get('/clients', async (req, res) => {
  try {
    const { status, tier, limit = 10, offset = 0 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (tier) query.serviceTier = tier;

    const clients = await Client.find(query)
      .populate('shops')
      .populate('orders')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });

    res.json({ clients });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to get clients' });
  }
});

// Create new client
router.post('/clients', async (req, res) => {
  try {
    const { name, email, phone, company, serviceTier, contractValue, notes } = req.body;

    if (!name || !email || !serviceTier) {
      return res.status(400).json({ error: 'Name, email, and service tier are required' });
    }

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ error: 'Client with this email already exists' });
    }

    const client = new Client({
      name,
      email,
      phone,
      company,
      serviceTier,
      contractValue,
      notes,
    });

    await client.save();
    res.status(201).json({
      message: 'Client created successfully',
      client,
    });
  } catch (error) {
    console.error('Client creation error:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/clients/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, email, phone, company, serviceTier, contractValue, status, notes } = req.body;

    const client = await Client.findByIdAndUpdate(
      clientId,
      {
        name,
        email,
        phone,
        company,
        serviceTier,
        contractValue,
        status,
        notes,
      },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      message: 'Client updated successfully',
      client,
    });
  } catch (error) {
    console.error('Client update error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Get platform activity logs
router.get('/activity', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const activities = await ActivityLog.find()
      .populate('user', 'name')
      .populate('client', 'name')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });

    res.json({ activities });
  } catch (error) {
    console.error('Activity logs error:', error);
    res.status(500).json({ error: 'Failed to get activity logs' });
  }
});

module.exports = router;
