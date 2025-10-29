
const express = require('express');
const router = express.Router();
const Domain = require('../models/Domain');
const Shop = require('../models/Shop');
const { isAuthenticated } = require('../middleware/auth');
const crypto = require('crypto');

// @route   POST /api/domains
// @desc    Add a custom domain
// @access  Private
router.post('/', isAuthenticated, async (req, res) => {
  const { domain, shopId } = req.body;

  try {
    // Check if the user owns the shop
    const shop = await Shop.findOne({ _id: shopId, owner: req.user.id });
    if (!shop) {
      return res.status(401).json({ msg: 'Not authorized to add a domain to this shop' });
    }

    // Check if domain already exists
    let existingDomain = await Domain.findOne({ domain });
    if (existingDomain) {
      return res.status(400).json({ msg: 'Domain already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const newDomain = new Domain({
      domain,
      shop: shopId,
      verificationToken,
    });

    const savedDomain = await newDomain.save();

    res.json(savedDomain);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/domains/shop/:shopId
// @desc    Get all domains for a shop
// @access  Private
router.get('/shop/:shopId', isAuthenticated, async (req, res) => {
  try {
    // Check if the user owns the shop
    const shop = await Shop.findOne({ _id: req.params.shopId, owner: req.user.id });
    if (!shop) {
      return res.status(401).json({ msg: 'Not authorized to view domains for this shop' });
    }

    const domains = await Domain.find({ shop: req.params.shopId });
    res.json(domains);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/domains/:id
// @desc    Delete a domain
// @access  Private
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id).populate('shop');

    if (!domain) {
      return res.status(404).json({ msg: 'Domain not found' });
    }

    // Check if the user owns the shop associated with the domain
    if (domain.shop.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this domain' });
    }

    await domain.remove();

    res.json({ msg: 'Domain removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Domain not found' });
    }
    res.status(500).send('Server Error');
  }
});


module.exports = router;
