//app/routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireLogin = require('../middleware/requireLogin');

//1.4 User Profile Management, two routes to get and update user profile from the database backend(MongoDB)
// GET /api/profile — fetch current user's profile
router.get('/profile', requireLogin, async (req, res) => {
    try {
        //4. File Handling, Ensure that user profiles are: * Saved to a file * Loaded from a file upon program execution
        const user = await User.findOne(
            { username: req.session.username },
            'username firstName middleName lastName address email'
        );
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
});

// POST /api/profile — update current user's profile
router.post('/profile', requireLogin, async (req, res) => {
    const { firstName, middleName, lastName, address, email } = req.body;

    try {
        await User.findOneAndUpdate(
            { username: req.session.username },
            { firstName, middleName, lastName, address, email }
        );

        req.session.firstName = firstName; // store firstName in session immediately after saving

        res.json({ success: true, message: 'Profile updated successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

module.exports = router;