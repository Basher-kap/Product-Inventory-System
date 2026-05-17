const db = require('../db');

async function getItems(username) {
  const result = await db.query(
    'SELECT product_code AS "productCode", product_name AS "productName", unit_price AS "unitPrice", product_image AS "productImage", quantity FROM cart_items WHERE username = $1 ORDER BY id',
    [username]
  );
  return result.rows;
}

async function findItem(username, productCode) {
  const result = await db.query(
    'SELECT quantity FROM cart_items WHERE username = $1 AND product_code = $2',
    [username, productCode]
  );
  return result.rows[0];
}

async function addItem(username, item) {
  await db.query(
    `INSERT INTO cart_items (username, product_code, product_name, unit_price, product_image, quantity)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (username, product_code)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [username, item.productCode, item.productName, item.unitPrice, item.productImage, item.quantity]
  );
}

async function deleteItem(username, productCode) {
  await db.query('DELETE FROM cart_items WHERE username = $1 AND product_code = $2', [username, productCode]);
}

async function clear(username) {
  await db.query('DELETE FROM cart_items WHERE username = $1', [username]);
}

module.exports = {
  getItems,
  findItem,
  addItem,
  deleteItem,
  clear
};