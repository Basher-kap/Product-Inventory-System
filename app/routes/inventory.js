// app/routes/inventory.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const requireLogin = require('../middleware/requireLogin');

// GET /api/inventory — fetch all products
router.get('/inventory', requireLogin, async (req, res) => {
    try {
        const products = await Product.find().sort({ productCode: 1 });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch inventory.' });
    }
});

module.exports = router;