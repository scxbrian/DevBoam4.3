const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken, checkTenant } = require('../middleware/auth');

// Get all products for a client's shop
router.get('/:clientId', [authenticateToken, checkTenant], async (req, res) => {
  try {
    const { clientId } = req.params;
    const { shopId } = req.query;

    let filter = { client: clientId };
    if (shopId) {
      filter.shop = shopId;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({ products });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Create new product
router.post('/:clientId', [authenticateToken, checkTenant], async (req, res) => {
  try {
    const { clientId } = req.params;
    const { shopId, name, price, inventory } = req.body;

    if (!name || !price || inventory === undefined) {
      return res.status(400).json({ error: 'Name, price, and inventory are required' });
    }

    const newProduct = new Product({
      ...req.body,
      client: clientId,
      shop: shopId,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    });

  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { client: clientId, role } = req.user;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (role === 'client' && product.client.toString() !== clientId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { client: clientId, role } = req.user;
    
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (role === 'client' && product.client.toString() !== clientId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Product.findByIdAndDelete(productId);

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update product inventory
router.patch('/:productId/inventory', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, operation = 'set' } = req.body;
    const { client: clientId, role } = req.user;

    const product = await Product.findById(productId);
     if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (role === 'client' && product.client.toString() !== clientId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let update;
    switch (operation) {
      case 'add':
        update = { $inc: { inventory: quantity } };
        break;
      case 'subtract':
        update = { $inc: { inventory: -quantity } };
        break;
      default: // 'set'
        update = { $set: { inventory: quantity } };
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, update, { new: true });

    res.json({
      message: 'Inventory updated successfully',
      newQuantity: updatedProduct.inventory
    });

  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

module.exports = router;
