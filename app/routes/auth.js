//app/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

//2nd handles login session upon receiving the credentials
//2.2 User Authentication, verifes the username and password, if correct creates a session and sends back success response(back to login.js)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ success: false, message: 'Invalid username.' });
        if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid password.' });

        // save username in session
        //this creates a session as a username key (3rd onto above)
        req.session.username = user.username;

        req.session.firstName = user.firstName; // also save first name for display on homepage


        res.json({ success: true, username: user.username, firstName: user.firstName });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// GET /api/session — 6th to check who is logged in using session
router.get('/session', (req, res) => {
    if (req.session.username) { //reads the session using the cookie to check if that username exists
        res.json({ success: true, username: req.session.username, firstName: req.session.firstName }); //if exists, sends back true and username (7th onto homepage.html)
    } else {
        res.status(401).json({ success: false, message: 'Not logged in.' });
    }
});

//9TH WHEN LOGOUT EXECUTED, SESSION IS DESTROYED (10TH BACK TO HOMEPAGE.HTML)
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out.' });
});

// GET /api/users — no longer needed for login, kept for reference
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username password');
        res.json({ users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to read user data' });
    }
});

// POST /api/register — create new account
//3.3 Menu Enhcancement (Create new user account), routes and sends the new account credentials
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // check if username already exists
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username already taken. Please choose another.' 
            });
        }

        // create new user
        await User.create({ username, password });

        //6.1 Login Functionality,  * Allow users to log in using their credentials
        req.session.username = username; // auto-login after registration

        res.json({ 
            success: true, 
            message: 'Account created successfully! You can now log in.' 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create account.' });
    }
});

module.exports = router;