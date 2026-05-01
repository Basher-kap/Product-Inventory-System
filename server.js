//server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); //for the user session management
const app = express();

app.use(express.json());

//session
//3rd sets up session (4th back to login.js)
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true, 
    cookie: { secure: false }
}));

app.use(express.static(__dirname));

// Connect to MongoDB
//first reads the connection string from the .env
mongoose.connect(process.env.MONGODB_URI) //mongoose is the library that translates your JavaScript code into MongoDB commands
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

//routers
app.use('/api', require('./app/routes/auth'));
app.use('/api', require('./app/routes/profile'));
app.use('/api', require('./app/routes/change-password'));
app.use('/api', require('./app/routes/inventory'));
app.use('/api', require('./app/routes/cart'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});