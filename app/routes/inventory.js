// app/routes/inventory.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const requireLogin = require('../middleware/requireLogin');

// GET /api/inventory
router.get('/inventory', requireLogin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY product_code ASC'
        );

        const products = result.rows.map(p => ({
            productCode:  p.product_code,
            productName:  p.product_name,
            quantity:     p.quantity,
            unitPrice:    parseFloat(p.unit_price),
            productImage: p.product_image
        }));

        return res.json({ success: true, products });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to fetch inventory.' });
    }
});

// POST /api/inventory
router.post('/inventory', requireLogin, async (req, res) => {
    const { productCode, productName, quantity, unitPrice, productImage } = req.body;

    if (!productCode || !productName) {
        return res.status(400).json({
            success: false,
            message: 'Product Code and Product Name are required.'
        });
    }

    try {
        const existing = await pool.query(
            'SELECT product_code FROM products WHERE product_code = $1',
            [productCode]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: `Product Code "${productCode}" already exists.`
            });
        }

        const result = await pool.query(
            `INSERT INTO products (product_code, product_name, quantity, unit_price, product_image)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [productCode, productName, quantity ?? 0, unitPrice ?? 0, productImage || '']
        );

        const p = result.rows[0];
        return res.status(201).json({
            success: true,
            message: `"${productName}" added to inventory.`,
            product: {
                productCode:  p.product_code,
                productName:  p.product_name,
                quantity:     p.quantity,
                unitPrice:    parseFloat(p.unit_price),
                productImage: p.product_image
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to add product.' });
    }
});

// PATCH /api/inventory/:productCode/stock — add stock quantity
router.patch('/inventory/:productCode/stock', requireLogin, async (req, res) => {
    const { productCode } = req.params;
    const { addQty } = req.body;

    if (!addQty || isNaN(addQty) || parseInt(addQty) <= 0) {
        return res.status(400).json({ success: false, message: 'Please enter a valid quantity.' });
    }

    try {
        const result = await pool.query(
            `UPDATE products
             SET quantity = quantity + $1
             WHERE product_code = $2
             RETURNING *`,
            [parseInt(addQty), productCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        const p = result.rows[0];
        return res.json({
            success: true,
            message: `Stock updated! "${p.product_name}" now has ${p.quantity} units.`,
            product: {
                productCode:  p.product_code,
                productName:  p.product_name,
                quantity:     p.quantity,
                unitPrice:    parseFloat(p.unit_price),
                productImage: p.product_image
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to update stock.' });
    }
});

module.exports = router;