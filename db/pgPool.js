const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || process.env.PG_HOST || 'localhost',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
  user: process.env.PGUSER || process.env.PG_USER || 'postgres',
  password: process.env.PGPASSWORD || process.env.PG_PASSWORD || 'postgres',
  database: process.env.PGDATABASE || process.env.PG_DATABASE || 'shopdb',
});

module.exports = pool;
