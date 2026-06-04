// app/routes/profile.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

// GET /api/profile
router.get('/profile', requireLogin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT username, first_name, middle_name, last_name, address, email
             FROM users WHERE username = $1`,
            [req.session.username]
        );

        const user = result.rows[0];
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        res.json({ success: true, user: {
            username:   user.username,
            firstName:  user.first_name,
            middleName: user.middle_name,
            lastName:   user.last_name,
            address:    user.address,
            email:      user.email
        }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
    }
});

// POST /api/profile
router.post('/profile', requireLogin, async (req, res) => {
    const { firstName, middleName, lastName, address, email } = req.body;

    try {
        await pool.query(
            `UPDATE users
             SET first_name = $1, middle_name = $2, last_name = $3, address = $4, email = $5
             WHERE username = $6`,
            [firstName, middleName, lastName, address, email, req.session.username]
        );

        req.session.firstName = firstName;

        res.json({ success: true, message: 'Profile updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update profile.' });
    }
});

module.exports = router;