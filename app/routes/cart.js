// app/routes/cart.js

const express = require('express');
const router  = express.Router();
const db = require('../db');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');
const requireLogin = require('../middleware/requireLogin');

// get the logged-in user's cart
router.get('/cart', requireLogin, async (req, res) => {
  try {
    const items = await Cart.getItems(req.session.username);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
  }
});

// add item to cart
router.post('/cart', requireLogin, async (req, res) => {
  const { productCode } = req.body;

  try {
    const product = await Product.findByCode(productCode);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.quantity === 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock.' });
    }

    const existing = await Cart.findItem(req.session.username, productCode);
    const existingQty = existing ? existing.quantity : 0;

    if (existingQty >= product.quantity) {
      return res.status(400).json({ success: false, message: 'Cannot exceed available stock.' });
    }

    await Cart.addItem(req.session.username, {
      productCode: product.productCode,
      productName: product.productName,
      unitPrice: product.unitPrice,
      productImage: product.productImage,
      quantity: 1
    });

    const items = await Cart.getItems(req.session.username);
    res.json({ success: true, message: `"${product.productName}" added to cart.`, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add to cart.' });
  }
});

// remove one item from cart
router.delete('/cart/:productCode', requireLogin, async (req, res) => {
  try {
    await Cart.deleteItem(req.session.username, req.params.productCode);
    const items = await Cart.getItems(req.session.username);
    res.json({ success: true, message: 'Item removed.', items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove item.' });
  }
});

// clear entire cart
router.delete('/cart', requireLogin, async (req, res) => {
  try {
    await Cart.clear(req.session.username);
    res.json({ success: true, message: 'Cart cleared.', items: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear cart.' });
  }
});

//checkout deduct quantities
// POST /api/cart/checkout
router.post('/cart/checkout', requireLogin, async (req, res) => {
  const client = await db.pool.connect();

  try {
    const items = await Cart.getItems(req.session.username);

    if (!items || items.length === 0) {
      client.release();
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    await client.query('BEGIN');

    for (const item of items) {
      const productResult = await client.query(
        'SELECT quantity FROM products WHERE product_code = $1',
        [item.productCode]
      );

      const product = productResult.rows[0];
      if (!product) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: `Product "${item.productName}" no longer exists.`
        });
      }

      if (product.quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${item.productName}". Available: ${product.quantity}`
        });
      }
    }

    for (const item of items) {
      await client.query(
        'UPDATE products SET quantity = quantity - $1 WHERE product_code = $2',
        [item.quantity, item.productCode]
      );
    }

    await client.query('DELETE FROM cart_items WHERE username = $1', [req.session.username]);
    await client.query('COMMIT');

    return res.json({ success: true, message: 'Checkout successful! Your order has been placed.' });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ success: false, message: 'Checkout failed. Please try again.' });
  } finally {
    client.release();
  }
});

module.exports = router;
