
const express = require('express');
const adminRoutes = require('./admin');
const clientRoutes = require('./client');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/client', clientRoutes);

module.exports = router;
