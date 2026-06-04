// app/routes/auth.js
const express = require('express');
const router  = require('express').Router();
const pool    = require('../db');

// POST /api/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        const user = result.rows[0];

        if (!user) return res.status(404).json({ success: false, message: 'Invalid username.' });
        if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid password.' });

        req.session.username  = user.username;
        req.session.firstName = user.first_name;

        res.json({ success: true, username: user.username, firstName: user.first_name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// GET /api/session
router.get('/session', (req, res) => {
    if (req.session.username) {
        res.json({ success: true, username: req.session.username, firstName: req.session.firstName });
    } else {
        res.status(401).json({ success: false, message: 'Not logged in.' });
    }
});

// POST /api/logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out.' });
});

// POST /api/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existing = await pool.query(
            'SELECT username FROM users WHERE username = $1',  // username instead of id
            [username]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Username already taken. Please choose another.'
            });
        }

        await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, password]
        );

        req.session.username = username;

        res.json({ success: true, message: 'Account created successfully! You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create account.' });
    }
});

// GET /api/users
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT username, password FROM users');
        res.json({ users: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to read user data' });
    }
});

module.exports = router;