/*
Migration script: reads from MongoDB (existing mongoose models) and inserts into PostgreSQL.
Run with: `node db/migrate.js` (set `.env` with MONGODB_URI and PG_* vars)
*/

require('dotenv').config();
const mongoose = require('mongoose');
const pool = require('./pgPool');

const User = require('../app/models/User');
const Product = require('../app/models/Product');
const Cart = require('../app/models/Cart');

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI, {});
  console.log('Connected to MongoDB');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Migrate users
    console.log('Migrating users...');
    const users = await User.find().lean();
    for (const u of users) {
      const query = `INSERT INTO users (username, password, first_name, middle_name, last_name, address, email)
                     VALUES ($1,$2,$3,$4,$5,$6,$7)
                     ON CONFLICT (username) DO NOTHING`;
      const params = [u.username, u.password, u.firstName || '', u.middleName || '', u.lastName || '', u.address || '', u.email || ''];
      await client.query(query, params);
    }
    console.log(`Inserted/Skipped ${users.length} users`);

    // Migrate products
    console.log('Migrating products...');
    const products = await Product.find().lean();
    for (const p of products) {
      const query = `INSERT INTO products (product_code, product_name, quantity, unit_price, product_image, created_at, updated_at)
                     VALUES ($1,$2,$3,$4,$5,$6,$7)
                     ON CONFLICT (product_code) DO UPDATE
                       SET product_name = EXCLUDED.product_name,
                           quantity = EXCLUDED.quantity,
                           unit_price = EXCLUDED.unit_price,
                           product_image = EXCLUDED.product_image,
                           updated_at = now()`;
      const params = [p.productCode, p.productName, p.quantity != null ? p.quantity : 0, p.unitPrice != null ? p.unitPrice : 0, p.productImage || '', p.createdAt || new Date(), p.updatedAt || new Date()];
      await client.query(query, params);
    }
    console.log(`Inserted/Updated ${products.length} products`);

    // Migrate cart items
    console.log('Migrating cart items...');
    const carts = await Cart.find().lean();
    let cartItemCount = 0;
    for (const c of carts) {
      if (!Array.isArray(c.items)) continue;
      for (const item of c.items) {
        const query = `INSERT INTO cart_items (username, product_code, product_name, unit_price, product_image, quantity)
                       VALUES ($1,$2,$3,$4,$5,$6)
                       ON CONFLICT (username, product_code) DO UPDATE
                         SET quantity = EXCLUDED.quantity,
                             product_name = EXCLUDED.product_name,
                             unit_price = EXCLUDED.unit_price,
                             product_image = EXCLUDED.product_image`;
        const params = [c.username, item.productCode, item.productName, item.unitPrice, item.productImage || '', item.quantity];
        await client.query(query, params);
        cartItemCount++;
      }
    }
    console.log(`Inserted/Updated ${cartItemCount} cart items`);

    await client.query('COMMIT');
    console.log('Migration completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed, rolled back.', err);
  } finally {
    client.release();
    await mongoose.disconnect();
    await pool.end();
  }
}

migrate().catch(err => {
  console.error('Unhandled error in migration:', err);
  process.exit(1);
});
