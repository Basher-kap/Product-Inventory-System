require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url, req.body);
    next();
});
app.use(express.static(__dirname));
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// routes
app.use('/api', require('./app/routes/auth'));
app.use('/api', require('./app/routes/profile'));
app.use('/api', require('./app/routes/change-password'));
app.use('/api', require('./app/routes/inventory'));
app.use('/api', require('./app/routes/cart'));

// root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// start server ← always last
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));