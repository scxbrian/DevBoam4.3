const express = require('express');
const mongoose = require('mongoose');
const { Order, OrderItem, Product, Customer, Client } = require('../models');
const { authenticateToken, checkTenant } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Get all orders for a client
router.get('/:clientId', checkTenant, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status, limit = 10, page = 1 } = req.query;

    const query = { client: clientId };
    if (status) {
      query.status = status;
    }

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const orders = await Order.find(query, null, options).populate('customer', 'name email');
    const totalOrders = await Order.countDocuments(query);

    res.json({ 
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Create new order
router.post('/:clientId', checkTenant, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { clientId } = req.params;
    const {
      customerId,
      shopId,
      items, // [{ productId, quantity }]
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    let subtotal = 0;
    const createdOrderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || product.client.toString() !== clientId) {
        throw new Error(`Product ${item.productId} not found or doesn't belong to this client.`);
      }
      
      if (product.inventory < item.quantity) {
        throw new Error(`Insufficient inventory for ${product.name}. Available: ${product.inventory}, Required: ${item.quantity}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      createdOrderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price, // Price at time of purchase
        total: itemTotal
      });
      
      product.inventory -= item.quantity;
      await product.save({ session });
    }

    const shipping = 500; // Example fixed shipping
    const tax = subtotal * 0.16; // Example 16% VAT
    const total = subtotal + shipping + tax;
    
    // Create the main order
    const order = new Order({
      client: clientId,
      shop: shopId,
      customer: customerId,
      subtotal: subtotal,
      shippingCost: shipping,
      taxAmount: tax,
      totalAmount: total,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      status: 'pending',
    });
    
    const savedOrder = await order.save({ session });

    // Create the associated order items
    const finalOrderItems = createdOrderItems.map(item => ({
        ...item,
        order: savedOrder._id
    }));

    const insertedItems = await OrderItem.insertMany(finalOrderItems, { session });

    await session.commitTransaction();

    res.status(201).json({
      message: 'Order created successfully',
      order: { ...savedOrder.toObject(), items: insertedItems }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  } finally {
    session.endSession();
  }
});

// Update order status
router.patch('/:clientId/:orderId/status', checkTenant, async (req, res) => {
  try {
    const { clientId, orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, client: clientId },
      { $set: { status, trackingNumber } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
