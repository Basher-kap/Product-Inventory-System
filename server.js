const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./app/db');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/style.css', express.static(path.join(__dirname, 'style.css')));
app.use(express.static(path.join(__dirname, 'app')));
app.use('/app', express.static(path.join(__dirname, 'app')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'replace-with-secure-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/api', require('./app/routes/auth'));
app.use('/api', require('./app/routes/profile'));
app.use('/api', require('./app/routes/change-password'));
app.use('/api', require('./app/routes/inventory'));
app.use('/api', require('./app/routes/cart'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;

db.pool.query('SELECT 1')
  .then(() => {
    app.listen(PORT, () => console.log(`Server now running`));
  })
  .catch(err => {
    console.error('PostgreSQL connection failed:', err);
    process.exit(1);
  });