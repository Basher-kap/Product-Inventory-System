//app/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

//2nd handles login session upon receiving the credentials
//2.2 User Authentication, verifies the username and password, if correct creates a session and sends back success response(back to login.js)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);

    if (!user) return res.status(404).json({ success: false, message: 'Invalid username.' });
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid password.' });

    req.session.username = user.username;
    req.session.firstName = user.firstName;

    res.json({ success: true, username: user.username, firstName: user.firstName });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/session — 6th to check who is logged in using session
router.get('/session', (req, res) => {
  if (req.session.username) {
    res.json({ success: true, username: req.session.username, firstName: req.session.firstName });
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
    const users = await User.findAll();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to read user data' });
  }
});

// POST /api/register — create new account
//3.3 Menu Enhancement (Create new user account), routes and sends the new account credentials
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken. Please choose another.'
      });
    }

    await User.create({ username, password });

    req.session.username = username;

    res.json({
      success: true,
      message: 'Account created successfully! You can now log in.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create account.' });
  }
});

module.exports = router;