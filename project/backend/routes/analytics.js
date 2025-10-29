
const express = require('express');
const mongoose = require('mongoose');
const { Order, OrderItem, Product, Customer } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Get analytics dashboard data for a client
router.get('/:clientId/dashboard', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { period = '30' } = req.query; // days

    // Check access permissions
    if (req.user.role === 'client' && req.user.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const periodDays = parseInt(period);
    const startDate = new Date(Date.now() - (periodDays * 24 * 60 * 60 * 1000));

    const revenue = await Order.aggregate([
      {
        $match: {
          client: new mongoose.Types.ObjectId(clientId),
          status: 'completed',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total_revenue: { $sum: '$total_amount' },
          total_orders: { $sum: 1 },
        },
      },
    ]);

    const ordersTrend = await Order.aggregate([
      {
        $match: {
          client: new mongoose.Types.ObjectId(clientId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await OrderItem.aggregate([
        {
            $lookup: {
                from: 'orders',
                localField: 'order',
                foreignField: '_id',
                as: 'orderInfo'
            }
        },
        { $unwind: '$orderInfo' },
        {
            $match: {
                'orderInfo.client': new mongoose.Types.ObjectId(clientId),
                'orderInfo.status': 'completed',
                'orderInfo.createdAt': { $gte: startDate }
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productInfo'
            }
        },
        { $unwind: '$productInfo' },
        {
            $group: {
                _id: '$productInfo.name',
                total_sold: { $sum: '$quantity' },
                total_revenue: { $sum: '$total' }
            }
        },
        { $sort: { total_revenue: -1 } },
        { $limit: 5 }
    ]);

    const customerInsights = await Order.aggregate([
      {
        $match: {
          client: new mongoose.Types.ObjectId(clientId),
          status: 'completed',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          unique_customers: { $addToSet: '$customer' },
          avg_order_value: { $avg: '$total_amount' },
        },
      },
      {
        $project: {
            _id: 0,
            unique_customers: { $size: '$unique_customers' },
            avg_order_value: 1
        }
      }
    ]);

    res.json({
        revenue: revenue[0] || { total_revenue: 0, total_orders: 0 },
        trends: { orders: ordersTrend },
        topProducts,
        customers: customerInsights[0] || { unique_customers: 0, avg_order_value: 0 }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics data' });
  }
});


// Get sales report
router.get('/:clientId/sales-report', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { startDate, endDate, format = 'json' } = req.query;

    if (req.user.role === 'client' && req.user.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const orders = await Order.find({
      client: clientId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })
      .populate({ path: 'customer', select: 'name email' })
      .populate({
        path: 'items',
        populate: { path: 'product', select: 'name' },
      });

    if (format === 'csv') {
      let csvData = 'Order ID,Date,Customer Name,Customer Email,Product Name,Quantity,Price,Item Total,Order Total,Status\n';
      orders.forEach(order => {
        order.items.forEach(item => {
            csvData += `${order._id},${order.createdAt},${order.customer.name},${order.customer.email},${item.product.name},${item.quantity},${item.price},${item.total},${order.total_amount},${order.status}\n`;
        });
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
      res.send(csvData);
    } else {
      res.json({ report: orders });
    }
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
});

module.exports = router;
