// app/routes/cart.js

const express = require('express');
const router  = express.Router();
const Cart    = require('../models/Cart');
const Product = require('../models/Product');
const requireLogin = require('../middleware/requireLogin');

// get the logged-in user's cart
router.get('/cart', requireLogin, async (req, res) => {
    try {
        const cart = await Cart.findOne({ username: req.session.username });
        res.json({ success: true, items: cart ? cart.items : [] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
    }
});

// add item to cart
router.post('/cart', requireLogin, async (req, res) => {
    const { productCode } = req.body;

    try {
        // check product exists in inventory
        const product = await Product.findOne({ productCode });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        if (product.quantity === 0) {
            return res.status(400).json({ success: false, message: 'Product is out of stock.' });
        }

        let cart = await Cart.findOne({ username: req.session.username }); 

        if (!cart) {
            // first time — create a new cart for this user
            cart = new Cart({ username: req.session.username, items: [] });
        }

        //if the product is already in the cart, increase quantity by 1, but don't exceed stock
        const existing = cart.items.find(i => i.productCode === productCode);

        if (existing) {
            // already in cart — increase qty, but don't exceed stock
            if (existing.quantity >= product.quantity) {
                return res.status(400).json({ success: false, message: 'Cannot exceed available stock.' });
            }
            existing.quantity += 1;
        } else {
            // new item
            cart.items.push({
                productCode:  product.productCode,
                productName:  product.productName,
                unitPrice:    product.unitPrice,
                productImage: product.productImage,
                quantity:     1
            });
        }

        await cart.save();
        res.json({ success: true, message: `"${product.productName}" added to cart.`, items: cart.items });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add to cart.' });
    }
});

// remove one item from cart
router.delete('/cart/:productCode', requireLogin, async (req, res) => {
    try {
        const cart = await Cart.findOne({ username: req.session.username });
        if (!cart) return res.json({ success: true, items: [] });

        cart.items = cart.items.filter(i => i.productCode !== req.params.productCode);
        await cart.save();
        res.json({ success: true, message: 'Item removed.', items: cart.items });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to remove item.' });
    }
});

// clear entire cart
router.delete('/cart', requireLogin, async (req, res) => {
    try {
        const cart = await Cart.findOne({ username: req.session.username });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ success: true, message: 'Cart cleared.', items: [] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to clear cart.' });
    }
});

//checkout deduct quantites
// POST /api/cart/checkout
router.post('/cart/checkout', requireLogin, async (req, res) => {
    try {
        const cart = await Cart.findOne({ username: req.session.username });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty.' });
        }

        // fetch all products first
        const productMap = {};
        for (const item of cart.items) {
            const product = await Product.findOne({ productCode: item.productCode });
            productMap[item.productCode] = product;
        }

        // validate all, collect any errors
        for (const item of cart.items) {
            const product = productMap[item.productCode];

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product "${item.productName}" no longer exists.`
                });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for "${item.productName}". Available: ${product.quantity}`
                });
            }
        }

        //all valid, now deduct quantities
        for (const item of cart.items) {
            await Product.findOneAndUpdate(
                { productCode: item.productCode },
                { $inc: { quantity: -item.quantity } }
            );
        }

        // clear cart
        cart.items = [];
        await cart.save();

        // send one single response
        return res.json({ success: true, message: 'Checkout successful! Your order has been placed.' });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Checkout failed. Please try again.' });
    }
});

module.exports = router;