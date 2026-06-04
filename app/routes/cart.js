// app/routes/cart.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const requireLogin = require('../middleware/requireLogin');

// GET /api/cart
router.get('/cart', requireLogin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM cart_items WHERE username = $1',
            [req.session.username]
        );

        const items = result.rows.map(r => ({
            productCode:  r.product_code,
            productName:  r.product_name,
            unitPrice:    parseFloat(r.unit_price),
            productImage: r.product_image,
            quantity:     r.quantity
        }));

        res.json({ success: true, items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
    }
});

// POST /api/cart — add item
router.post('/cart', requireLogin, async (req, res) => {
    const { productCode } = req.body;
    const username = req.session.username;

    try {
        const productResult = await pool.query(
            'SELECT * FROM products WHERE product_code = $1',
            [productCode]
        );

        const product = productResult.rows[0];
        if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
        if (product.quantity === 0) return res.status(400).json({ success: false, message: 'Product is out of stock.' });

        // check if already in cart
        const existing = await pool.query(
            'SELECT * FROM cart_items WHERE username = $1 AND product_code = $2',
            [username, productCode]
        );

        if (existing.rows.length > 0) {
            const currentQty = existing.rows[0].quantity;
            if (currentQty >= product.quantity) {
                return res.status(400).json({ success: false, message: 'Cannot exceed available stock.' });
            }

            await pool.query(
                'UPDATE cart_items SET quantity = quantity + 1 WHERE username = $1 AND product_code = $2',
                [username, productCode]
            );
        } else {
            await pool.query(
                `INSERT INTO cart_items (username, product_code, product_name, unit_price, product_image, quantity)
                 VALUES ($1, $2, $3, $4, $5, 1)`,
                [username, product.product_code, product.product_name, product.unit_price, product.product_image]
            );
        }

        const cartResult = await pool.query(
            'SELECT * FROM cart_items WHERE username = $1',
            [username]
        );

        const items = cartResult.rows.map(r => ({
            productCode:  r.product_code,
            productName:  r.product_name,
            unitPrice:    parseFloat(r.unit_price),
            productImage: r.product_image,
            quantity:     r.quantity
        }));

        res.json({ success: true, message: `"${product.product_name}" added to cart.`, items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add to cart.' });
    }
});

// DELETE /api/cart/:productCode — remove one item
router.delete('/cart/:productCode', requireLogin, async (req, res) => {
    const username = req.session.username;

    try {
        await pool.query(
            'DELETE FROM cart_items WHERE username = $1 AND product_code = $2',
            [username, req.params.productCode]
        );

        const cartResult = await pool.query(
            'SELECT * FROM cart_items WHERE username = $1',
            [username]
        );

        const items = cartResult.rows.map(r => ({
            productCode:  r.product_code,
            productName:  r.product_name,
            unitPrice:    r.unit_price,
            productImage: r.product_image,
            quantity:     r.quantity
        }));

        res.json({ success: true, message: 'Item removed.', items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to remove item.' });
    }
});

// DELETE /api/cart — clear entire cart
router.delete('/cart', requireLogin, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM cart_items WHERE username = $1',
            [req.session.username]
        );

        res.json({ success: true, message: 'Cart cleared.', items: [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to clear cart.' });
    }
});

// POST /api/cart/checkout
router.post('/cart/checkout', requireLogin, async (req, res) => {
    const username = req.session.username;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const cartResult = await client.query(
            'SELECT * FROM cart_items WHERE username = $1',
            [username]
        );

        if (cartResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Your cart is empty.' });
        }

        // validate stock for all items first
        for (const item of cartResult.rows) {
            const productResult = await client.query(
                'SELECT * FROM products WHERE product_code = $1',
                [item.product_code]
            );

            const product = productResult.rows[0];

            if (!product) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: `Product "${item.product_name}" no longer exists.`
                });
            }

            if (product.quantity < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for "${item.product_name}". Available: ${product.quantity}`
                });
            }
        }

        // deduct quantities
        for (const item of cartResult.rows) {
            await client.query(
                'UPDATE products SET quantity = quantity - $1 WHERE product_code = $2',
                [item.quantity, item.product_code]
            );
        }

        // clear cart
        await client.query(
            'DELETE FROM cart_items WHERE username = $1',
            [username]
        );

        await client.query('COMMIT');
        return res.json({ success: true, message: 'Checkout successful! Your order has been placed.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        return res.status(500).json({ success: false, message: 'Checkout failed. Please try again.' });
    } finally {
        client.release();
    }
});

module.exports = router;