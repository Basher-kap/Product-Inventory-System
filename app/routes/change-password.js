// app/routes/change-password.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

// POST /api/change-password
router.post('/change-password', requireLogin, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const username = req.session.username;

    try {
        const result = await pool.query(
            'SELECT password FROM users WHERE username = $1',
            [username]
        );

        const user = result.rows[0];

        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        if (user.password !== oldPassword) return res.status(401).json({ success: false, message: 'Old password is incorrect.' });

        await pool.query(
            'UPDATE users SET password = $1 WHERE username = $2',
            [newPassword, username]
        );

        console.log(`Password updated for user: ${username}`);
        res.json({ success: true, message: 'Password changed successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update password.' });
    }
});

module.exports = router;