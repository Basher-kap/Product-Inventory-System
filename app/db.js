// app/db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host:     process.env.PG_HOST     || 'localhost',
    port:     parseInt(process.env.PG_PORT) || 5433,
    user:     process.env.PG_USER     || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DATABASE || 'shopdb'
});

pool.on('error', (err) => {
    console.error('Unexpected Postgres error', err);
});

module.exports = pool;