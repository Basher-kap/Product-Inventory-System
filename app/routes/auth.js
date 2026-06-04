//app/routes/auth.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const UserService = require('../services/UserService');

const loginDebugLog = path.join(__dirname, '../../login-debug.log');

//2nd handles login session upon receiving the credentials
//2.2 User Authentication, verifies the username and password, if correct creates a session and sends back success response(back to login.js)
router.post('/login', async (req, res) => {
    const logEntry = {
        ts: new Date().toISOString(),
        body: req.body,
    };
    fs.appendFileSync(loginDebugLog, JSON.stringify({ event: 'login-start', ...logEntry }) + '\n');

    const { username, password } = req.body || {};

    if (!username || !password) {
        fs.appendFileSync('login-debug.log', JSON.stringify({ event: 'login-bad-request', ...logEntry }) + '\n');
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const user = await UserService.findByUsername(username);
        fs.appendFileSync(loginDebugLog, JSON.stringify({ event: 'login-user-found', username, user: !!user }) + '\n');

        if (!user) return res.status(404).json({ success: false, message: 'Invalid username.' });
        if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid password.' });

        req.session.username = user.username;
        req.session.firstName = user.first_name || '';

        fs.appendFileSync(loginDebugLog, JSON.stringify({ event: 'login-success', username }) + '\n');
        res.json({ success: true, username: user.username, firstName: req.session.firstName });
    } catch (err) {
        fs.appendFileSync(loginDebugLog, JSON.stringify({ event: 'login-error', error: err.message, stack: err.stack }) + '\n');
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

// GET /api/users — user list for debugging / admin purposes
router.get('/users', async (req, res) => {
    try {
        const users = await UserService.findAll();
        res.json({ users });
    } catch (err) {
        console.error('Users route error:', err);
        res.status(500).json({ success: false, message: 'Failed to read user data' });
    }
});

// POST /api/register — create new account
//3.3 Menu Enhcancement (Create new user account), routes and sends the new account credentials
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existing = await UserService.findByUsername(username);
        if (existing) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username already taken. Please choose another.' 
            });
        }

        const newUser = await UserService.create({ username, password });

        req.session.username = newUser.username;
        req.session.firstName = newUser.first_name || '';

        res.json({ 
            success: true, 
            message: 'Account created successfully! You can now log in.' 
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Failed to create account.' });
    }
});

module.exports = router;