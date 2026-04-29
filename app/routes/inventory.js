const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const requireLogin = require('../middleware/requireLogin');

// GET /api/inventory — fetch all products
router.get('/inventory', requireLogin, async (req, res) => {
    try {
        const products = await Product.find().sort({ productCode: 1 });
        return res.json({ success: true, products });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch inventory.' });
    }
});

// POST /api/inventory — add new product
router.post('/inventory', requireLogin, async (req, res) => {
    const { productCode, productName, quantity, unitPrice, productImage } = req.body;

    // validate required fields
    if (!productCode || !productName) {
        return res.status(400).json({ 
            success: false, 
            message: 'Product Code and Product Name are required.' 
        });
    }

    try {
        // check if product code already exists
        const existing = await Product.findOne({ productCode });
        if (existing) {
            return res.status(409).json({ 
                success: false, 
                message: `Product Code "${productCode}" already exists.` 
            });
        }

        const product = await Product.create({
            productCode,
            productName,
            quantity:     quantity     ?? 0,
            unitPrice:    unitPrice    ?? 0,
            productImage: productImage || ''
        });

        return res.status(201).json({ 
            success: true, 
            message: `"${productName}" added to inventory.`,
            product 
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to add product.' });
    }
});

module.exports = router;