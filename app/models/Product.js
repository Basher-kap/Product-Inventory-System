const db = require('../db');

async function listAll() {
  const result = await db.query(
    'SELECT product_code AS "productCode", product_name AS "productName", quantity, unit_price AS "unitPrice", product_image AS "productImage" FROM products ORDER BY product_code'
  );
  return result.rows;
}

async function findByCode(productCode) {
  const result = await db.query(
    'SELECT product_code AS "productCode", product_name AS "productName", quantity, unit_price AS "unitPrice", product_image AS "productImage" FROM products WHERE product_code = $1',
    [productCode]
  );
  return result.rows[0];
}

async function create(product) {
  await db.query(
    'INSERT INTO products (product_code, product_name, quantity, unit_price, product_image) VALUES ($1, $2, $3, $4, $5)',
    [product.productCode, product.productName, product.quantity, product.unitPrice, product.productImage]
  );
}

async function updateQuantity(productCode, delta) {
  await db.query(
    'UPDATE products SET quantity = quantity + $1 WHERE product_code = $2',
    [delta, productCode]
  );
}

module.exports = {
  listAll,
  findByCode,
  create,
  updateQuantity
};